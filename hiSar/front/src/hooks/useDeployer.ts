
import { Address, Dictionary, OpenedContract, toNano } from "ton-core";

import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

import { ProjectsDeployer } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { deployer } from "./addresses";

export type Level = {
    $$type: 'Level';
    jettons: bigint;
    price: bigint;
}

export type Data = {
    $$type: 'Data';
    title: string;
    description: string;
    image: string;
    link: string;
}


export function useDeployerContract() {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()

    const deployerContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;
        const contract = ProjectsDeployer.fromAddress(Address.parse(deployer))        
        return client.open(contract) as OpenedContract<ProjectsDeployer>
    }, [client, wallet])
    return {
        createProject: (title: string, description: string, image: string, link: string, percents: bigint[], required: bigint) => {
            const data: Data = {
                $$type: 'Data',
                title: title,
                description: description,
                image: image,
                link: link
            }
            const owner = Address.parse(sender.address?.toString()!)
            required = toNano(required)
            let percentsD = Dictionary.empty<bigint, bigint>();
            for(let i = 0; i < percents.length; i++)
                percentsD.set(BigInt(i), BigInt(percents[i]));
            
            deployerContract?.send(
                sender,
                {
                    value: toNano('0.2'),
                },
                {
                    $$type: 'CreateProject',
                    data: data,
                    owner: owner,
                    required: required,
                    percents: percentsD
                }
            );
        
        },
        createDonation: (title: string, description: string, image: string, link: string) => {
            const data: Data = {
                $$type: 'Data',
                title: title,
                description: description,
                image: image,
                link: link
            }
        
            const owner = Address.parse(sender.address?.toString()!)
            deployerContract?.send(
                sender,
                {
                    value: toNano('0.2'),
                },
                {
                    $$type: 'CreateDonation',
                    data: data,
                    owner: owner
                }
            );
        },
        getProjectAddress: async(id: bigint) => {
            const result = (await deployerContract?.getProjectAddress(id))
            return result

        },
        getDonationAddress: async (id: bigint) => {
            const result = (await deployerContract?.getDonationAddress(id))
            return result

        }, 
        getDeployerData: async() => {
            const result = (await deployerContract?.getData())
            return result
        }

    }
}