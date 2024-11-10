import { useEffect, useState } from "react";
import { Address, Dictionary, fromNano, OpenedContract, toNano } from "ton-core";
import {TokenMaster} from "../../abi/Master/tact_TokenMaster";
import {TokenWallet} from "../../abi/Master/tact_TokenWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { beginCell } from "ton-core";
import { master } from "./addresses";
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
export type Level = {
    $$type: 'Level';
    jettons: bigint;
    price: bigint;
}
export function useJettonContract() {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()
    const [balance, setBalance] = useState<string | null>()

    const jettonContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract = TokenMaster.fromAddress(Address.parse(master))        
        return client.open(contract) as OpenedContract<TokenMaster>
    }, [client, wallet])
    
    const price = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        let prices : bigint[] = []
        const tons: Dictionary<bigint,Level> | undefined = await jettonContract?.getSubscribePrice()
        for (let i = 0; i < 5; i++) {
            prices.push(tons!.get(BigInt(i))!.price)
        }
        return prices!
    }, [client, wallet])

    const jettons = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        let jettons : bigint[] = []
        const tons: Dictionary<bigint,Level> | undefined = await jettonContract?.getSubscribePrice()
        for (let i = 0; i < 5; i++) {
            jettons.push(tons!.get(BigInt(i))!.jettons)
        }
        return jettons
    }, [client, wallet])

    const jettonWalletContract = useAsyncInitialize(async()=>{
        if(!jettonContract || !client) return;

        const jettonWalletAddress = await jettonContract.getGetWalletAddress(
            Address.parse(Address.parse(wallet!).toString())
        )

        return client.open(TokenWallet.fromAddress(jettonWalletAddress))
    }, [jettonContract, client])

    useEffect(()=>{
        async function getBalance() {
            if(!jettonWalletContract) return 
            setBalance(null)
            const balance = (await jettonWalletContract.getGetWalletData()).balance
            setBalance(fromNano(balance))
            await sleep(5000)
            getBalance()
        }

        getBalance()

    }, [jettonWalletContract])

    return {
        jettonWalletAddress: jettonWalletContract?.address.toString(),
        balance: balance,
        jettons: jettons,
        subscribe: (lvl: bigint) => {
            
            jettonContract?.send(sender, {
                value: price![Number(lvl)] + toNano("0.05")
            },{
                $$type: "Subscribe",
                lvl: lvl
            })
        },
        claim: () => {
            jettonWalletContract?.send(sender, {
                value: toNano("0.05")
            },{
                $$type: "Claim",
                query_id: 0n
            })
        },
        claimPool: () => {
            jettonWalletContract?.send(sender, {
                value: toNano("0.05")
            },{
                $$type: "ClaimPool",
                query_id: 0n
            })
        },
        changeInviter: (inviter: Address) => {
            jettonWalletContract?.send(sender, {
                value: toNano("0.05")
            },{
                $$type: "ChangeInviter",
                inviter: inviter
            })
        },
        transfer: (to: Address, amount: bigint) => {
            jettonWalletContract?.send(
                sender,
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'Transfer',
                    query_id: BigInt(Date.now()),
                    amount: amount,
                    destination: to,
                    response_destination: to,
                    forward_ton_amount: BigInt(0),
                    forward_payload: beginCell().endCell().asSlice(),
                    custom_payload: beginCell().endCell()
                }
            );
        }

    }
}