import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer} from '../wrappers/ProjectDeployer';
import { Project } from '../wrappers/project';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const projectId = 1;
    const project = provider.open(Project.fromAddress(await projectsDeployer.getProjectAddress(BigInt(projectId))));
    console.log(await project.getProjectData())
}
