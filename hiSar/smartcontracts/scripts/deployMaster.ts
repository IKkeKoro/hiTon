import { Address, beginCell, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!!

    const JSON = 
    beginCell()
        .storeUint(1,8)
        .storeStringTail('https://raw.githubusercontent.com/IKkeKoro/jsonhehe/refs/heads/main/jetton-metadata-example.json') // <- Jetton Metadata
    .endCell() 
    const master = provider.open(await TokenMaster.fromInit(owner,JSON));

    await master.send(
        provider.sender(),
        {
            value: toNano('0.08'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(master.address);
}
