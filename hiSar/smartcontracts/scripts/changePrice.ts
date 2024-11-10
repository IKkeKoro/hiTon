import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const price = toNano('200')
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.02'),
        },
        {
            $$type: 'ChangePrice',
            projectPrice: price
        }
    );
}
