
import { Address,OpenedContract, toNano } from "ton-core";
import {TokenMaster} from "../../abi/Master/tact_TokenMaster";
import {MembersPool} from "../../abi/Master/tact_MembersPool";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { master } from "./addresses";

export type Level = {
    $$type: 'Level';
    jettons: bigint;
    price: bigint;
}
export function useMemberContract() {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()

    const jettonContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract = TokenMaster.fromAddress(Address.parse(master))        
        return client.open(contract) as OpenedContract<TokenMaster>
    }, [client, wallet])
    
    const memberContract = useAsyncInitialize(async()=>{
        if(!jettonContract || !client) return;

        const poolAddress = MembersPool.fromAddress(await jettonContract.getPoolAddress())
            Address.parse(Address.parse(wallet!).toString())

        return client.open(poolAddress) as OpenedContract<MembersPool>
    }, [client, wallet])

    return {
        addIncome: (amount: bigint) => {
            memberContract?.send(sender, {
                value: toNano("0.05")
            },{
                $$type: "AddIncome",
                amount: amount
            })
        },
        getData: (to: Address, amount: bigint) => {
            memberContract?.getPoolData()
        }

    }
}