import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer} from '../wrappers/ProjectDeployer';
import { Project } from '../wrappers/project';
import { UserData } from '../wrappers/user';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const projectId = 0;
    const user = Address.parse("");
    const project = provider.open(Project.fromAddress(await projectsDeployer.getDonationAddress(BigInt(projectId))));
    const userData = provider.open(UserData.fromAddress(await project.getUserData(user)));
    console.log(await userData.getData())
}
