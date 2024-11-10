import { Address, beginCell, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { master } from './address/const';
export async function run(provider: NetworkProvider) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const amount = toNano('100000000')  // 200 * 10^9 
    const to =  provider.sender().address!! //Address.parse("0QBUTV4-IBl4bnK4aSvmMdvjoB-02lDLP4sGI-MkEHYKTGiC")
    console.log((await tkMaster.getSubscribePrice()).get(BigInt(0)))
    console.log((await tkMaster.getSubscribePrice()).get(BigInt(1)))
    console.log((await tkMaster.getSubscribePrice()).get(BigInt(2)))
    console.log((await tkMaster.getSubscribePrice()).get(BigInt(3)))
}
