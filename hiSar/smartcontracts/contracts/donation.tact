import "./imports/messages.tact";
struct DonationData {
    donated: Int as uint32;
    deployer: Address;
    id: Int as uint64;
    owner: Address;
    data: Data;
}

message DeployDonation{
    data: Data;
    owner: Address;
}

message Donate {
    amount: Int as coins;
}

message DonationEvent {
    amount: Int as coins;
    from: Address;
}
//_________________________________________________________
contract Donation {
    donated: Int as coins = 0;
    deployer: Address;
    id: Int as uint64;
    owner: Address;
    data: Data = Data{
        title: "",
        description: "",
        image: "",
        link: ""
    };
    active: Bool = true;

    init(deployer: Address, id: Int) {
        self.id = id;
        self.owner = myAddress();
        self.deployer = deployer;
    }
//_________________________________________________________
    receive(msg: DeployDonation) {
        require(sender() == self.deployer, "Not a deployer");
        self.data = msg.data;
        self.owner = msg.owner;
        emit(NewDonation{address: myAddress(), id: self.id, owner: msg.owner, data: msg.data}.toCell());
    }

    receive(msg: ChangeActive) {
        require(sender() == self.deployer, "Not a deployer");
        self.active = msg.active;
    }
//_________________________________________________________
    receive(){
        require(self.active, "Not active");
        self.donated += context().value;
        emit(DonationEvent{amount: context().value, from: sender()}.toCell());
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue
        });  
    }

    receive(msg: Donate) {
        require(self.active, "Not active");
        require(context().value >= msg.amount, "Not enough tons");
        self.donated += msg.amount;
        emit(DonationEvent{amount: context().value, from: sender()}.toCell());
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue
        });        
    }
//_________________________________________________________
    get fun donationData(): DonationData {
        return DonationData{
            donated: self.donated,
            deployer: self.deployer,
            id: self.id,
            owner: self.owner,
            data: self.data
        };
    }
}
