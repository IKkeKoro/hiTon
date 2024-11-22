import { getHttpEndpoint } from "@orbs-network/ton-access";

import { TonClient } from "ton";
import { Cell } from "ton-core";

import { loadDonationEvent, DonationEvent } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";

import { Address } from "ton-core";

// Define the emitted message formats


// Function to decode the TransferEvent from a cell
function newDonation(cell: Cell): DonationEvent {
    const slice = cell.beginParse();
    return loadDonationEvent(slice);
}



function getEventType(cell: Cell): 'NewProject' | 'DonationEvent' | 'Unknown' {
    const slice = cell.beginParse();
    const header = slice.loadUint(32);
    if (header === 310130085) {
        return 'DonationEvent';
    } else {
        return 'Unknown';
    }
}

export async function useDonationEvent(address: Address) {
    const endpoint = await getHttpEndpoint({
        network: "testnet",
    });

    const client = new TonClient({ endpoint });
    const transactions = await client.getTransactions(address, { limit: 30 });
    // console.log('Transactions data', transactions);
    const data: DonationEvent[]  = [];
    let amount: bigint = BigInt(0);
    for (const tx of transactions) {
        if(tx.outMessages.get(0)?.body) {
            console.log('Transaction data', tx.outMessages.get(0)?.body.beginParse().loadUint(32));
                const eventType = getEventType(tx.outMessages.get(0)?.body!);

                if (eventType === 'DonationEvent') {
                    const decodedTransfer = newDonation(tx.outMessages.get(0)?.body!);
                    data?.push(decodedTransfer);
  
                    amount += decodedTransfer.amount;
                }
        }
            
   
    }

    return {data: data, amount: amount};

}