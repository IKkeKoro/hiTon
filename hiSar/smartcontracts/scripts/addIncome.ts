import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer} from '../wrappers/ProjectDeployer';
import { Project } from '../wrappers/project';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const projectId = 0;
    const project = provider.open(Project.fromAddress(await projectsDeployer.getProjectAddress(BigInt(projectId))));
    const income = toNano('200')
    await project.send(
        provider.sender(),
        {
            value: toNano('0.02'),
        },
        {
            $$type: 'AddIncome',
            amount: income 
        }
    );
}
