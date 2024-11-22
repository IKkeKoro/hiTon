import { Address, Slice, beginCell, toNano } from '@ton/core';


import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { deployer, master } from './address/const';
import { TokenWallet } from '../build/Master/tact_TokenWallet';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
export async function run(provider: NetworkProvider, args: string[]) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const walletAddress = provider.sender().address!//await Address.parse('kQCb-O1Tn-_RL_T4h2U6VU-4dqmYewmWx6HpJrdJTOXy6EDC') //
    const wallet = provider.open(TokenWallet.fromAddress(await tkMaster.getGetWalletAddress(walletAddress)));

    console.log(await wallet.getMemberData())
}
