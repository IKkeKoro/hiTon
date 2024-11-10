import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { master } from './address/const';


export type Level = {
    $$type: 'Level';
    jettons: bigint;
    price: bigint;
}


export async function run(provider: NetworkProvider) {
    const dic = Dictionary.empty<bigint, Level>()
        .set(BigInt(0), { $$type: 'Level', jettons: toNano(100), price: toNano(0.1) })
        .set(BigInt(1), { $$type: 'Level', jettons: toNano(200), price: toNano(0.3) })
        .set(BigInt(2), { $$type: 'Level', jettons: toNano(600), price: toNano(0.5) })
        .set(BigInt(3), { $$type: 'Level', jettons: toNano(1200), price: toNano(1) })
    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    await tkMaster.send(
        provider.sender(),
        {
            value: toNano('0.04'),
        },
        {
            $$type: 'ChangeSubscribePrice',
            subscribePrice: dic
        }
    );
}
