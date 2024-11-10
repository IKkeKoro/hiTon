
import { Address, OpenedContract, toNano } from "ton-core";
import { ProjectsDeployer } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Donation } from "../../abi/ProjectDeployer/tact_Donation";
import { deployer } from "./addresses";



export type Data = {
    $$type: 'DonationData';
    donated: bigint;
    deployer: Address;
    id: bigint;
    owner: Address;
    data: Data;
}
export type DonationData = Promise<{
    $$type: 'DonationData';
    donated: bigint;
    deployer: Address;
    id: bigint;
    owner: Address;
    data: Data;
}>

export function useDonationContract(id: bigint) {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()

    const deployerContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;

        const contract = ProjectsDeployer.fromAddress(Address.parse(deployer))

        return client.open(contract) as OpenedContract<ProjectsDeployer>
    }, [client, wallet])

    const donationContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;

        const contract = Donation.fromAddress(
            await deployerContract?.getDonationAddress(id)! 
        )

        return client.open(contract) as OpenedContract<Donation>
    }, [client, wallet])


    return {
        donate: ( amount:bigint) => {
            donationContract?.send(sender, {
                value: toNano("0.2")
            }, {
                $$type: "Donate",
                amount: amount
            })
        },
        getDonationData: async ( ) => {
            const result = (await donationContract?.getDonationData()) 
            return result
        }
    }
}