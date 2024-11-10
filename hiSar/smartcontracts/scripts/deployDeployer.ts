import { toNano } from '@ton/core';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const deployer = provider.open(await ProjectsDeployer.fromInit());

    await deployer.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(deployer.address);
}
