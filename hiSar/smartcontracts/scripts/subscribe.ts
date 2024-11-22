import { Address, beginCell, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { master } from './address/const';
export async function run(provider: NetworkProvider) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const lvl = 0;
    await tkMaster.send(
        provider.sender(),
        {
            value: toNano('0.3'),
        },
        {
            $$type: 'Subscribe',
            lvl: BigInt(lvl),
        }
    );
}
