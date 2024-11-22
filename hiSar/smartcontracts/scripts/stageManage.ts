import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const projectId = 2;
    const stage = 3
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'StageManage',
            id: BigInt(projectId),
            stage: BigInt(stage)
        }
    );
}
