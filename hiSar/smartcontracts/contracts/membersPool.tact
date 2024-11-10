import "./imports/tokenMessages.tact";
struct PoolData {
    totalIncome: Int as coins;
    master: Address;
}

message IncomeEvent {
    amount: Int as coins;
}
//_________________________________________________________
contract MembersPool {
    totalIncome: Int as coins = 0;
    master: Address;
    init(master: Address) {
        self.master = master;
    }
//_________________________________________________________
    receive(msg: AddIncome) {
        require(context().value >= msg.amount + context().readForwardFee(), "Not enough tons");
        self.totalIncome += msg.amount;
    }

    receive(msg: SendIncome) {
        require(sender() == self.master, "Not a master");
        let pie: Int = ( self.totalIncome - msg.poolWithdrawnAt ) / (100 * (msg.totalSupply / msg.totalVoted));
        if (msg.poolWithdrawnAt == 0) {
            pie = 0;
        }
        send(SendParameters {
            to: msg.wallet,
            value: pie,
            mode: SendPayGasSeparately,
            body: PoolIncome{
                poolWithdrawnAt: self.totalIncome
            }.toCell()
        });
    }
//_________________________________________________________
    get fun poolData(): PoolData {
        return PoolData{
            totalIncome: self.totalIncome,
            master: self.master
        };
    }
}
