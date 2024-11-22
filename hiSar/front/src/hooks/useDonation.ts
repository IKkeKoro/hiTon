
import { Address, OpenedContract, toNano } from "ton-core";
import { ProjectsDeployer } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Donation } from "../../abi/ProjectDeployer/tact_Donation";
import { deployer } from "./addresses";
import { useEffect, useState } from "react";
import { DonationData } from "../components/data";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))



export function useDonationContract(id: bigint) {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()
    const [dataD, setData] = useState<DonationData | null>()
    const donationContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract1 = ProjectsDeployer.fromAddress(Address.parse(deployer))
        const d = client.open(contract1) as OpenedContract<ProjectsDeployer>
        const contract = Donation.fromAddress(
            await d?.getDonationAddress(id)! 
        )     
        return client.open(contract) as OpenedContract<Donation>
    }, [client, wallet])

    useEffect(()=>{
        async function getData() {
            if(!dataD) return 
            const data = (await donationContract?.getDonationData())
            setData(data)
            await sleep(5000)
            getData()
        }

        getData()

    }, [donationContract])


    return {
        data: dataD,
        donate: ( amount:bigint) => {
            donationContract?.send(sender, {
                value: amount
            }, {
                $$type: "Donate",
                amount: amount
            })
        },
        getDonationData: async ( ) => {
            const result = (await donationContract?.getDonationData()) 
            console.log('Donation data', result)
            return result
        }
    }
}