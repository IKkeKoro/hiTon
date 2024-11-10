import { Address, beginCell, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { master } from './address/const';
export async function run(provider: NetworkProvider) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const amount = toNano('100000000')  // 200 * 10^9 
    const to =  provider.sender().address!! //Address.parse("0QBUTV4-IBl4bnK4aSvmMdvjoB-02lDLP4sGI-MkEHYKTGiC")
    await tkMaster.send(
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
