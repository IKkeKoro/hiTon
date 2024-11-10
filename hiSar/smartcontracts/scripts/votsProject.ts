import { Address, Slice, beginCell, toNano } from '@ton/core';

import { NetworkProvider } from '@ton/blueprint';
import { TokenMaster } from '../wrappers/master';
import { TokenWallet } from '../build/Master/tact_TokenWallet';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { Project } from '../wrappers/project';
import { master,deployer } from './address/const';
export async function run(provider: NetworkProvider, args: string[]) {

    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const walletAddress = await tkMaster.getGetWalletAddress(provider.sender().address!!) //
    const wallet = provider.open(TokenWallet.fromAddress(walletAddress));
    const amount = toNano('50')  // 500 * 10^9 
    const projectId = 0;
    const to = await projectsDeployer.getDonationAddress(BigInt(projectId));
    await wallet.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Transfer',
            query_id: BigInt(Date.now()),
            amount: amount,
            destination: to,
            response_destination: to,
            forward_ton_amount: BigInt(0),
            forward_payload: beginCell().endCell().asSlice(),
            custom_payload: beginCell().endCell()
        }
    );
}
