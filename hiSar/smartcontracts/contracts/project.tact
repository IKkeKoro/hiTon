import "./userData.tact";
//_________________________________________________________
contract Project {
    deployer: Address;
    id: Int as uint64;
    owner: Address;
    data: Data = Data{
        title: "",
        description: "",
        image: "",
        link: ""
    };

    voted: Int as coins = 0;
    invested: Int as coins = 0;
    required: Int as coins = 0;
    withdrawn: Int as coins = 0;
    income: Int as coins = 0;
    stage: Int as uint8 = 0;
    percents: map<Int, Int> = emptyMap();

    init(deployer: Address, id: Int) {
        self.id = id;
        self.owner = myAddress();
        self.deployer = deployer;
    }

    receive(){
       self.income += context().value - context().readForwardFee() - ton("0.01");
    }
//_________________________________________________________
    receive(msg: DeployProject) {
        require(sender() == self.deployer, "Wrong sender");
        self.data = msg.data;
        self.required = msg.required;
        self.percents = msg.percents;
        self.owner = msg.owner;
        send(SendParameters {
            to: self.deployer,
            value: 0,
            mode: SendRemainingValue,
            body: ProjectDeployed{
                id: self.id
            }.toCell()
        });
    }

    receive(msg: ChangeStage) {
        require(sender() == self.deployer, "Wrong sender");
        self.stage = msg.stage;
    }
//OWNER____________________________________________________
    receive(msg: OwnerWithdraw) {
        require(sender() == self.owner, "Wrong sender");
        require(self.stage > 1, "Wrong stage");
        require(msg.amount + self.withdrawn <= self.invested, "Wrong amount");
        self.withdrawn += msg.amount;
        emit(Withdrawn{amount: msg.amount, from: sender()}.toCell());
        send(SendParameters {
            to: self.owner,
            value: msg.amount,
            mode: SendPayGasSeparately
        });
    }

    receive(msg: AddIncome) {
        require(context().value >= msg.amount + context().readForwardFee(), "Not enough tons");
        let platformPie: Int = (msg.amount * self.percents.get(0)!!) / 100;
        let ownerPie: Int = (msg.amount * self.percents.get(1)!!) / 100;
        if(!msg.ownerPie) {
            self.income += ownerPie;
        }
        self.income += msg.amount;
        send(SendParameters {
            to: self.deployer,
            value: ownerPie,
            mode: 0
        });
    }
//USER_____________________________________________________
    receive(msg: TransferNotification){
        require(self.stage == 1, "Wrong stage");
        send(SendParameters {
            to: jettonMaster,
            value: 0,
            mode: SendRemainingValue,
            body: CheckWallet{
                wallet: sender(),
                amount: msg.amount,
                sender: msg.sender
            }.toCell()
        });

    }

    receive(msg: Validate) {
        require(sender() == jettonMaster, "Wrong sender");
        self.voted += msg.amount;
        if( self.voted >= (self.required * 20) ){
            self.stage = 2;
        }

        let init: StateInit = initOf UserData(msg.sender, self.id, self.deployer);
        let to: Address = contractAddress(init);
        emit(Voted{amount: msg.amount, from: msg.sender}.toCell());
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: AddInvest{
                invested: 0,
                voted: msg.amount
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }


    receive(msg: Invest) {
        require(self.stage == 2, "Wrong stage"); 
        require(context().value >= msg.amount + context().readForwardFee(), "Not enough tons");
        self.invested += msg.amount;
        if( self.invested >= self.required ){
            self.stage = 3;
        }

        let init: StateInit = initOf UserData(sender(), self.id, self.deployer);
        let to: Address = contractAddress(init); 
        emit(Invested{amount: msg.amount, from: sender()}.toCell()); 
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: AddInvest{
                invested: msg.amount,
                voted: 0
            }.toCell(),
            code: init.code,
            data: init.data
        });

    }

    receive(msg: UserWithdraw) {
        let init: StateInit = initOf UserData(msg.from, self.id, self.deployer);
        let to: Address = contractAddress(init);  
        require(sender() == to, "Wrong sender");
        require(self.stage == 3, "Wrong stage");

        let incomePie: Int = (self.income - msg.withdrawnAt) / 100;
        let votsPie: Int =   ((incomePie * self.percents.get(2)!!)) / 100 * (self.voted / msg.voted);
        let tonsPie: Int = ((incomePie * self.percents.get(3)!!)) / 100 * (self.invested / msg.invested);
        let income: Int = votsPie + tonsPie;

        require(myBalance() >= income , "Not enough tons");
        require(income >= ton("0.1"), "Not enough income");
        emit(Withdrawn{amount: income, from: msg.from}.toCell());
        send(SendParameters {
            to: sender(),
            value: income,
            mode: 0,
            body: GetIncome{
                income: income,
                withdrawnAt: self.income
            }.toCell()
        });
    }
//GETTERS__________________________________________________
    get fun projectData(): ProjectData {
        return ProjectData{
            voted: self.voted,
            invested: self.invested,
            required: self.required,
            withdrawn: self.withdrawn,
            income: self.income,
            owner: self.owner,
            id: self.id,
            data: self.data
        };
    }

    get fun userData(owner: Address): Address {
        let init: StateInit = initOf UserData(owner, self.id, self.deployer);
        return contractAddress(init);
    }
}
