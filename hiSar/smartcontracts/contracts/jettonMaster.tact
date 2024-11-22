import "./jettonWallet";
import "@stdlib/deploy";

struct MasterData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
    pool: Address;
}

contract TokenMaster with  Deployable {
    total_supply: Int as coins = 0;
    mintable: Bool = true;
    owner: Address;
    jetton_content: Cell;
    subscribePrice: map<Int, Level> = emptyMap();

    init(owner: Address, jetton_content: Cell) {
        self.owner = owner;
        self.jetton_content = jetton_content;
        self.subscribePrice.set(0, Level{jettons: ton("100"), price: ton("0.1")});
        self.subscribePrice.set(1, Level{jettons: ton("300"), price: ton("0.3")});
        self.subscribePrice.set(2, Level{jettons: ton("500"), price: ton("0.5")});
        self.subscribePrice.set(3, Level{jettons: ton("1000"), price: ton("1")});
        self.subscribePrice.set(4, Level{jettons: ton("4000"), price: ton("3")});
    }

    receive(msg: ChangeContent) {
        require(sender() == self.owner, "Invalid sender");
        self.jetton_content = msg.jetton_content;
    }

    receive(msg: ChangeOwner) {
        require(sender() == self.owner, "Invalid sender");
        self.owner = msg.owner;
    }

    receive(msg: ChangeSubscribePrice) {
        require(sender() == self.owner, "Invalid sender");
        self.subscribePrice = msg.subscribePrice;
    }

    receive(msg: Transfer) {
        let ctx: Context = context();
        require(sender() == self.owner, "Invalid sender");
        require(self.mintable, "Mint stopped");
        require(ctx.readForwardFee() + minTons + msg.forward_ton_amount < ctx.value, "Invalid ton amount");
        self.total_supply = self.total_supply + msg.amount;
        let init: StateInit = initOf TokenWallet(msg.destination, myAddress());
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

    receive(msg: Subscribe) {
        let data: Level = self.subscribePrice.get(msg.lvl)!!;
        let init: StateInit = initOf TokenWallet(sender(), myAddress());
        let to: Address = contractAddress(init);
        require(data.price > 0, "Invalid lvl");
        require(context().value >= data.price + context().readForwardFee() + ton("0.15"), "Invalid ton amount");
        self.total_supply = (self.total_supply + data.jettons + (data.jettons / 10) + (data.jettons / 20));
        let sendValue: Int = ((data.price / 10) + (data.price / 20) + ton("0.15"));
        send(SendParameters {
            to: to,
            value: (sendValue),
            mode: 0,
            bounce: false,
            body: UpdateSubscribe{
                jettons: data.jettons,
                price: data.price
            }.toCell(),
            data: init.data,
            code: init.code
        });
    }

    receive(msg: MintVots) {
        let init: StateInit = initOf TokenWallet(msg.sender, myAddress());
        let to: Address = contractAddress(init);
        require(sender() == to, "Invalid sender");
        self.total_supply = self.total_supply + msg.amount;
    }

    receive(msg: ProvideWalletAddress) {
        let ctx: Context = context();
        let wallet: Address = contractAddress(initOf TokenWallet(msg.owner_address, myAddress()));
        let owner_address: Address? = null;
        if (msg.include_address) {
            owner_address = msg.owner_address;
        }
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue,
            body: TakeWalletAddress{
                query_id: msg.query_id,
                wallet_address: wallet,
                owner_address: owner_address
            }.toCell()
        });
    }

    receive(msg: CheckWallet) {
        let wallet: Address = contractAddress(initOf TokenWallet(sender(), myAddress()));
        let userWallet: Address = contractAddress(initOf TokenWallet(msg.sender, myAddress()));
        if (msg.wallet == wallet) {
            send(SendParameters {
                to: userWallet,
                value: (context().value / 3),
                mode: 0,
                body: AddVots{
                    amount: msg.amount
                }.toCell()
            });
            send(SendParameters {
                to: sender(),
                value: (context().value / 2),
                mode: 0,
                body: Validate{
                    wallet: wallet,
                    sender: msg.sender,
                    amount: msg.amount
                }.toCell()
            });
        }
    }

    receive("Stop Mint") {
        require(sender() == self.owner, "Invalid sender");
        self.mintable = false;
    }

    receive(msg: BurnNotification) {
        let init: StateInit = initOf TokenWallet(msg.sender, myAddress());
        require(contractAddress(init) == sender(), "Invalid sender");

        self.total_supply = self.total_supply - msg.amount;
        send(SendParameters{
            to: msg.response_destination,
            value: 0,
            mode: SendRemainingValue,
            body: Excesses{query_id: msg.query_id}.toCell()
        });
    }

    receive(msg: CheckSupply) {
        let init: StateInit = initOf TokenWallet(msg.sender, myAddress());
        let from: Address = contractAddress(init);
        require(sender() == from, "Invalid sender");
        let poolAddress: Address = contractAddress(initOf MembersPool(myAddress()));
        send(SendParameters {
            to: poolAddress,
            value: 0,
            mode: SendRemainingValue,
            body: SendIncome{
                totalSupply: self.total_supply,
                poolWithdrawnAt: msg.poolWithdrawnAt,
                totalVoted: msg.totalVoted,
                wallet: from
            }.toCell()
        });
    }

    get fun get_jetton_data(): MasterData {
        let pool: Address = contractAddress(initOf MembersPool(myAddress()));
        return MasterData{ pool: pool, total_supply: self.total_supply, mintable: self.mintable, owner: self.owner, jetton_content: self.jetton_content, jetton_wallet_code: (initOf TokenWallet(self.owner, myAddress())).code};
    }

    get fun subscribePrice(): map<Int, Level> {
        return self.subscribePrice;
    }

    get fun get_wallet_address(owner_address: Address): Address {
        let init: StateInit = initOf TokenWallet(owner_address, myAddress());
        return contractAddress(init);
    }

    get fun poolAddress(): Address {
        return contractAddress(initOf MembersPool(myAddress()));
    }
}