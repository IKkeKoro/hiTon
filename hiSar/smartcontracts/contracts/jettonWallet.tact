
import "./membersPool";
const gasConsumption: Int = ton("0.02");
const minTons: Int = ton("0.01");
const dev: Address = address("0QCrro2_TPdN3cFhH0LQeXj8T3xkSCDnK54Nl6f8O0LUguYK");
struct WalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
    totalVoted: Int;
    inviter: Address;
    poolWithdrawnAt: Int;
}

contract TokenWallet {
    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    lastClaimed: Int;
    subscribedUntil: Int;
    jettonsToClaim: Int;
    inviter: Address;
    totalVoted: Int = 0;
    poolWithdrawnAt: Int = 0;

    init(owner: Address, master: Address) {
        self.owner = owner;
        self.master = master;
        self.inviter = dev;
        self.lastClaimed = now();
        self.subscribedUntil = now();
        self.jettonsToClaim = 0;
    }

    receive(){}

    receive(msg: ChangeInviter) {
        require(self.owner == sender() || self.master == sender(), "Invalid sender");
        require(self.inviter == dev, "Inviter already set");
        self.inviter = msg.inviter;
    }

    receive(msg: Transfer) {
        let ctx: Context = context();
        require(self.owner == ctx.sender, "Invalid sender");
        self.balance = self.balance - msg.amount;
        require(self.balance >= 0, "Invalid token amount");
        require(ctx.readForwardFee() + minTons + msg.forward_ton_amount < ctx.value, "Invalid ton amount");
        let init: StateInit = initOf TokenWallet(msg.destination, self.master);
        let to: Address = contractAddress(init);
        send(SendParameters {
            to: to,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: InternalTransfer{
                query_id: msg.query_id,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload}.toCell(),
            data: init.data,
            code: init.code
        });
    }

    receive(msg: AddVots) {
        require(self.owner == msg.sender, "Invalid sender");
        self.totalVoted = self.totalVoted + msg.amount;
    }

    receive(msg: PoolIncome){
        let poolAddress: Address = contractAddress(initOf MembersPool(self.master));
        require(poolAddress == sender(), "wrong sender");
        self.poolWithdrawnAt = msg.poolWithdrawnAt;
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue
        });
    }

    receive(msg: InternalTransfer) {
        let ctx: Context = context();
        if(ctx.sender != self.master) {
            let init: StateInit = initOf TokenWallet(msg.from, self.master);
            require(contractAddress(init) == ctx.sender, "Invalid sender");
        }
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid token amount");
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: TransferNotification {
                query_id: msg.query_id,
                amount: msg.amount,
                sender: msg.from,
                forward_payload: msg.forward_payload
            }.toCell()
        });
    }

    receive(msg: Burn) {
        let ctx: Context = context();
        require(self.owner == ctx.sender, "Invalid sender");
        require(ctx.value > gasConsumption + gasConsumption + ctx.readForwardFee(), "Invalid ton amount");
        self.balance = self.balance - msg.amount;
        require(self.balance >= 0, "Invalid token amount");
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            body: BurnNotification {
                query_id: msg.query_id,
                amount: msg.amount,
                sender: self.owner,
                response_destination: msg.response_destination
            }.toCell()
        });
    }

    receive(msg: UpdateSubscribe) {
        require(self.master == context().sender, "Invalid sender");
        let init: StateInit = initOf TokenWallet(self.inviter, self.master);
        let refWallet: Address = contractAddress(init);
        self.balance = self.balance + msg.jettons;
        self.lastClaimed = now();
        self.subscribedUntil = now() + 1 + ((60 * 60 * 24 * 7) * 4);
        let refIncome: Int = (msg.price / 10);
        send(SendParameters {
            to: refWallet,
            value: (refIncome + (refIncome/2) + ton("0.04")),
            mode: SendRemainingValue,
            body: RefIncome {
                income: refIncome,
                sender: self.owner,
                amount: msg.jettons,
                counter: 0
            }.toCell(),
            data: init.data,
            code: init.code
        });
    }

    receive(msg: RefIncome) {
        let init: StateInit = initOf TokenWallet(msg.sender, self.master);
        require(contractAddress(init) == sender(), "Invalid sender");
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid token amount");
        let initTo: StateInit = initOf TokenWallet(self.owner, self.master);
        let to: Address = contractAddress(initTo);
        let refIncome: Int = (msg.income / 2);
        if(msg.counter < 1) {
            send(SendParameters {
                to: to,
                value: refIncome + ton("0.02"),
                mode: 0,
                body: RefIncome {
                    income: refIncome,
                    sender: self.owner,
                    amount: msg.amount / 2,
                    counter: msg.counter + 1
                }.toCell(),
                data: initTo.data,
                code: initTo.code
            });
        } 
    }

    receive(msg: ClaimPool) {
        require(self.owner == context().sender, "Invalid sender");
        send(SendParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            body: CheckSupply{
                sender: self.owner,
                poolWithdrawnAt: self.poolWithdrawnAt,
                totalVoted: self.totalVoted,
            }.toCell()
        });
    }

    receive(msg: Claim) {
        require(self.owner == context().sender, "Invalid sender");
        let claims: Int = (now() - self.lastClaimed) / (60 * 60 * 24 * 7);
        if(now() > self.subscribedUntil) {
            claims = (self.subscribedUntil - self.lastClaimed) / (60 * 60 * 24 * 7);
        } 
        self.lastClaimed = now();
        if(self.lastClaimed >= self.subscribedUntil) {
            self.jettonsToClaim = 0;
        }
        require(claims > 0, "No claims available");
        self.balance += claims * self.jettonsToClaim;
        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: MintVots {
                amount: (claims * self.jettonsToClaim),
                sender: self.owner
            }.toCell()
        });
    }

    bounced(src: bounced<InternalTransfer>) {
        self.balance = self.balance + src.amount;
    }

    bounced(src: bounced<BurnNotification>) {
        self.balance = self.balance + src.amount;
    }

    get fun get_wallet_data(): WalletData {
        return WalletData{balance: self.balance, poolWithdrawnAt: self.poolWithdrawnAt, totalVoted: self.totalVoted, inviter: self.inviter, owner: self.owner, master: self.master, code: (initOf TokenWallet(self.owner, self.master)).code};
    }
}