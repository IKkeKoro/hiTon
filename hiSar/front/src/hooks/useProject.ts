
import { Address,OpenedContract, toNano } from "ton-core";
import { ProjectsDeployer } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Project } from "../../abi/ProjectDeployer/tact_Project";
import { deployer } from "./addresses";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export type Data = {
    $$type: 'Data';
    title: string;
    description: string;
    image: string;
    link: string;
}

export function useProjectContract(id: bigint) {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()

    const projectConatract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract1 = ProjectsDeployer.fromAddress(Address.parse(deployer))
        const d: OpenedContract<ProjectsDeployer> = client.open(contract1) as OpenedContract<ProjectsDeployer>
        const address =  (await d?.getProjectAddress(id)!)
        const contract = Project.fromAddress(
            address 
        )

        return client.open(contract) as OpenedContract<Project>
    }, [client, wallet])

    return {
        ownerWithdraw: ( amount:bigint) => {
            projectConatract?.send(sender, {
                value: toNano("0.05")
            }, {
                $$type: "OwnerWithdraw",
                amount: amount
            })
        },
        invest: ( amount:bigint) => {
            projectConatract?.send(sender, {
                value: amount + toNano("0.1")
            }, {
                $$type: "Invest",
                amount: amount
            })
        },
        
        getProjectData: async () => {
            const data = (await projectConatract?.getProjectData())
            return data
        }
    }
}