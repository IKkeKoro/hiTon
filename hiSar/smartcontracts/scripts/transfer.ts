import { Address, Slice, beginCell, toNano } from '@ton/core';


import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { deployer, master } from './address/const';
import { TokenWallet } from '../build/Master/tact_TokenWallet';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
export async function run(provider: NetworkProvider, args: string[]) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const walletAddress = await tkMaster.getGetWalletAddress(provider.sender().address!!) //
    const wallet = provider.open(TokenWallet.fromAddress(walletAddress));
    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    const amount = toNano('500')  // 500 * 10^9 
    const id = BigInt(0)
    const to =  await projectsDeployer.getProjectAddress(id)
    await wallet.send(
        provider.sender(),
        {
            value: toNano('0.2'),
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
