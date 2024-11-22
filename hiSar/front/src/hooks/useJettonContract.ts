import { useEffect, useState } from "react";
import { Address, Dictionary, fromNano, OpenedContract, toNano } from "ton-core";
import {MemberData, TokenMaster, WalletData} from "../../abi/Master/tact_TokenMaster";
import {TokenWallet} from "../../abi/Master/tact_TokenWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { beginCell } from "ton-core";
import { deployer, master, ref } from "./addresses";
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
export type Level = {
    $$type: 'Level';
    jettons: bigint;
    price: bigint;

}

const dataW: WalletData = { 
    $$type: 'WalletData',
    balance: 0n,
    owner: Address.parse(deployer),
    master: Address.parse(master),
    code: beginCell().endCell(),
}

const dataS: MemberData = {
    $$type: "MemberData",
    totalVoted: 0n,
    lastClaimed: 0n,
    subscribedUntil: 0n,
    jettonsToClaim: 0n,
    inviter: Address.parse(ref),
    poolWithdrawnAt: 0n
}
const subPrice = [toNano("0.1"), toNano("0.3"), toNano("0.5"), toNano("1"), toNano("3")]
export function useJettonContract() {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()
    const [data, setData] = useState<WalletData>(dataW)
    const [member, setMemberData] = useState<MemberData>(dataS)
    const jettonContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract = TokenMaster.fromAddress(Address.parse(master))        
        return client.open(contract) as OpenedContract<TokenMaster>
    }, [client, wallet])
    

    const jettonWalletContract = useAsyncInitialize(async()=>{
        if(!jettonContract || !client) return;

        const jettonWalletAddress = await jettonContract.getGetWalletAddress(
            Address.parse(Address.parse(wallet!).toString())
        )

        return client.open(TokenWallet.fromAddress(jettonWalletAddress))
    }, [jettonContract, client])
    

    useEffect(()=>{
        async function getData() {
            if(!jettonWalletContract) return 
            const data = (await jettonWalletContract.getGetWalletData())
            const memberData = (await jettonWalletContract.getMemberData())
            setMemberData(memberData)
            setData(data)
            await sleep(5000)
            if(!data.balance || !memberData.totalVoted)
                getData()
        }

        getData()

    }, [jettonWalletContract])

    return {
        data: data,
        member: member,
        jettonWalletAddress: jettonWalletContract?.address.toString(),
        subscribe: (lvl: bigint) => {
            
            jettonContract?.send(sender, {
                value: toNano("0.5") + subPrice[Number(lvl)]
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
        transfer: (amount: bigint, to: string) => {
            jettonWalletContract?.send(sender,
                {
                    value: toNano('0.25'),
                },
                {
                    $$type: 'Transfer',
                    query_id: BigInt(Date.now()),
                    amount: amount,
                    destination: Address.parse(to),
                    response_destination: Address.parse(to),
                    forward_ton_amount: BigInt(0),
                    forward_payload: beginCell().endCell().asSlice(),
                    custom_payload: beginCell().endCell()
                }
            );
        },
        getSubsribePrice: async() => {
            let prices : bigint[] = []
            const tons: Dictionary<bigint,Level> | undefined = (await jettonContract?.getSubscribePrice())
            for (let i = 0; i < 5; i++) {
                prices.push(tons!.get(BigInt(i))!.price)
            }
            return tons
        }

    }
}



