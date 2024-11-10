import "@stdlib/deploy";
import "./project.tact";
import "./donation.tact";
//_______________________________________________________
contract ProjectsDeployer with Deployable {
    projectId: Int as uint64 = 0;
    donationId: Int as uint64 = 0;
    owner: Address;
    active: Bool = true;

    projectPrice: Int as coins = 0;

    init() {
        self.owner = sender();
    }

    receive(){}
//OWNER__________________________________________________
    receive(msg: ChangeOwner) {
        require(sender() == self.owner, "Not an owner");
        self.owner = msg.owner;
    }

    receive(msg: ChangePrice) {
        require(sender() == self.owner, "Not an owner");
        self.projectPrice = msg.projectPrice;
    }
    
    receive(msg: ChangeActive) {
        require(sender() == self.owner, "Not an owner");
        self.active = msg.active;
    }

    receive(msg: Withdraw) {
        require(sender() == self.owner, "Not an owner");
        send(SendParameters {
            to: self.owner,
            value: myBalance() - ton("0.1"),
            mode: SendPayGasSeparately
        });
    }

    receive(msg: StageManage) {
        require(sender() == self.owner, "Not an owner");
        let init: StateInit = initOf Project(myAddress(), msg.id);
        let to: Address = contractAddress(init);
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: ChangeStage{
                stage: msg.stage
            }.toCell(),
            data: init.data,
            code: init.code
        });
    }

    receive(msg: ActiveManage) {
        require(sender() == self.owner, "Not an owner");
        let init: StateInit = initOf Donation(myAddress(), msg.id);
        let to: Address = contractAddress(init);
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: ChangeActive{
                active: msg.active
            }.toCell(),
            data: init.data,
            code: init.code
        });
    }
//USER___________________________________________________
    receive(msg: CreateProject) {
        require(self.active, "Not active");
        require(context().value > self.projectPrice + context().readForwardFee(), "Not enough tons");
        let init: StateInit = initOf Project(myAddress(), self.projectId);
        let to: Address = contractAddress(init);
        let percents: Int = msg.percents.get(0)!! + msg.percents.get(1)!! + msg.percents.get(2)!! + msg.percents.get(3)!!;
        require(percents == 100, "Invalid percents");
        require(msg.percents.get(0)!! > 5, "Invalid percents");
        require(msg.percents.get(1)!! > 5, "Invalid percents");
        require(msg.percents.get(2)!! > 20, "Invalid percents");
        require(msg.percents.get(3)!! > 20, "Invalid percents");
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: DeployProject{
                owner: msg.owner,
                data: msg.data,
                required: msg.required,
                percents: msg.percents
            }.toCell(),
            data: init.data,
            code: init.code
        });
        emit(NewProject{address: to, id: self.projectId}.toCell());
    }

    receive(msg: CreateDonation) {
        require(self.active, "Not active");
        require(context().value > self.projectPrice + context().readForwardFee(), "Not enough tons");
        let init: StateInit = initOf Donation(myAddress(), self.donationId);
        let to: Address = contractAddress(init);
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            body: DeployDonation{
                owner: msg.owner,
                data: msg.data
            }.toCell(),
            data: init.data,
            code: init.code
        });
        emit(NewDonation{address: to, id: self.donationId}.toCell());
    }

    receive(msg: ProjectDeployed) {
        let init: StateInit = initOf Project(myAddress(), msg.id);
        let to: Address = contractAddress(init);
        let initDonation: StateInit = initOf Donation(myAddress(), msg.id);
        let toDonation: Address = contractAddress(initDonation);
        
        if(sender() == to) {
            self.projectId += 1;
        }

        if(sender() == toDonation) {
            self.donationId += 1;
        }
    }
//GETTERS________________________________________________
    get fun data(): DeployerData {
        return DeployerData{
            owner: self.owner,
            projectId: self.projectId,
            donationId: self.donationId,
            projectPrice: self.projectPrice,
            master: jettonMaster,
            balance: myBalance()
        };
    }

    get fun projectAddress(id: Int): Address {
        return contractAddress(initOf Project(myAddress(), id));
    }

    get fun donationAddress(id: Int): Address {
        return contractAddress(initOf Donation(myAddress(), id));
    }
}
