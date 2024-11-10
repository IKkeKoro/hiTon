import { Address, beginCell, toNano } from '@ton/core';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const owner = Address.parse("0QCb-O1Tn-_RL_T4h2U6VU-4dqmYewmWx6HpJrdJTOXy6B0H")
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.02'),
        },
        {
            $$type: 'ChangeOwner',
            owner: owner
        }
    );
}
