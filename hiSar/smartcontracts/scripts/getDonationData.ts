import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer} from '../wrappers/ProjectDeployer';
import { Donation } from '../wrappers/donation';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const projectId = 0;
    const project = provider.open(Donation.fromAddress(await projectsDeployer.getDonationAddress(BigInt(projectId))));
    console.log(await project.getDonationData())
}
