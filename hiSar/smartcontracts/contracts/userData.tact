import "./imports/messages.tact";
//_________________________________________________________
contract UserData {
    owner: Address;
    projectId: Int as uint64;
    deployer: Address;

    invested: Int as coins = 0;
    voted: Int as coins = 0;
    
    withdrawnAt: Int as coins = 0;
    totalIncome: Int as coins = 0;

    init(owner: Address, projectId: Int, deployer: Address) {
        self.projectId = projectId;
        self.owner = owner;
        self.deployer = deployer;
    }
//_________________________________________________________
    receive(msg: AddInvest) {
        let from: Address = contractAddress(initOf Project(self.deployer, self.projectId));
        require(sender() == from, "Wrong sender");
        self.invested += msg.invested;
        self.voted += msg.voted;
        send(SendParameters {
            to: jettonMaster,
            value: 0,
            mode: SendRemainingValue,
            body: CheckWallet{
                wallet: self.owner,
                sender: self.owner,
                amount: msg.voted
            }.toCell()
        });  

    }

    receive(msg: Validate) {
        require(sender() == jettonMaster, "Wrong sender");
        send(SendParameters {
            to: msg.wallet,
            value: 0,
            mode: SendRemainingValue,
            body: AddVots{
                sender: self.owner,
                amount: msg.amount
            }.toCell()
        });  
    }

    receive(msg: Withdraw) {
        require(sender() == self.owner, "Not an owner");
        let from: Address = contractAddress(initOf Project(self.deployer, self.projectId));
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: UserWithdraw{
                from: sender(),
                withdrawnAt: self.withdrawnAt,
                voted: self.voted,
                invested: self.invested,
            }.toCell()
        });        
    }

    receive(msg: GetIncome) {
        require(sender() == self.owner, "Not an owner");
        self.withdrawnAt = msg.withdrawnAt;
        self.totalIncome += msg.income;    
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue
        });
    }
//_________________________________________________________
    get fun data(): UserInfo {
        return UserInfo{
            invested: self.invested,
            voted: self.voted,
            withdrawnAt: self.withdrawnAt,
            owner: self.owner,
            projectId: self.projectId,
            totalIncome: self.totalIncome
        };
    }
}
