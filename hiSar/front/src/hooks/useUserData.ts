
import { Address,OpenedContract, toNano } from "ton-core";
import { ProjectsDeployer } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Project } from "../../abi/ProjectDeployer/tact_Project";
import { deployer } from "./addresses";
import {UserData} from "../../abi/ProjectDeployer/tact_UserData";
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export type Data = {
    $$type: 'Data';
    title: string;
    description: string;
    image: string;
    link: string;
}

export function useUserData(id: bigint) {
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
        const v: OpenedContract<Project> = client.open(contract) as OpenedContract<Project>
        const userData = UserData.fromAddress(
            await v.getUserData(Address.parse(wallet!))
        )

        return client.open(userData) as OpenedContract<UserData>
    }, [client, wallet])

    return {
        withdraw: () => {
            projectConatract?.send(sender, {
                value: toNano("0.05")
            }, {
                $$type: "Withdraw",
                query_id: 0n
            })
        },
    }
}