import { Address, Slice, beginCell, toNano } from '@ton/core';

import { NetworkProvider } from '@ton/blueprint';
import { TokenMaster } from '../wrappers/master';
import { TokenWallet } from '../build/Master/tact_TokenWallet';
import { deployer } from './address/const';
export async function run(provider: NetworkProvider, args: string[]) {

    const projectsDeployer = provider.open(TokenMaster.fromAddress(deployer));
    const walletAddress = await projectsDeployer.getGetWalletAddress(provider.sender().address!!) //
    const wallet = provider.open(TokenWallet.fromAddress(walletAddress));
    await wallet.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Claim',
            query_id: 0n
        }
    );
}
