import { Address, beginCell, toNano } from '@ton/core';
import { TokenMaster } from '../wrappers/master';
import { NetworkProvider } from '@ton/blueprint';
import { master } from './address/const';
export async function run(provider: NetworkProvider) {

    const tkMaster = provider.open(TokenMaster.fromAddress(master));
    const amount = toNano('1000000')  // 200 * 10^9 
    const to =  provider.sender().address! // Address.parse("kQCb-O1Tn-_RL_T4h2U6VU-4dqmYewmWx6HpJrdJTOXy6EDC")
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
