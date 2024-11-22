import { getHttpEndpoint } from "@orbs-network/ton-access";

import { TonClient } from "ton";
import { Cell } from "ton-core";

import {  loadVoted, Voted, Withdrawn, loadWithdrawn, IncomeAdded, loadIncomeAdded, Invested, loadInvested, loadStageChanged, StageChanged, loadCheckWallet, CheckWallet } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";

import { Address } from "ton-core";

// Define the emitted message formats


// Function to decode the TransferEvent from a cell
function newVote(cell: Cell): Voted {
    const slice = cell.beginParse();
    return loadVoted(slice);
}

function newWithdrawn(cell: Cell): Withdrawn {
    const slice = cell.beginParse();
    return loadWithdrawn(slice);
}

function newIncome(cell: Cell): IncomeAdded {
    const slice = cell.beginParse();
    return loadIncomeAdded(slice);
}

function newInvested(cell: Cell): Invested {
    const slice = cell.beginParse();
    return loadInvested(slice);
}

function newStage(cell: Cell): StageChanged {
    const slice = cell.beginParse();
    return loadStageChanged(slice);
}

function getEventType(cell: Cell): 'Withdrawn' | 'Invested' | 'IncomeAdded' | 'Voted' | 'StageChanged' |'Unknown' {
    const slice = cell.beginParse();
    const header = slice.loadUint(32);
    if (header === 870400834) {
        return 'Voted';
    } else if (header === 1165006918) {
        return 'Withdrawn';
    } else if (header === 666248598) {
        return 'IncomeAdded';
    } else  if (header === 2469875973) {
        return 'Invested';
    } else if(header === 2731741061){ 
        return 'StageChanged';
    } else {
        return 'Unknown';
    }
}
export type Vots = {
    amount: bigint;
    from: Address;
}
export async function useProjectEvent(address: Address) {
    const endpoint = await getHttpEndpoint({
        network: "testnet",
    });

    const client = new TonClient({ endpoint });
    const transactions = await client.getTransactions(address, { limit: 30 });
    // console.log('Transactions data', transactions);
    const voted: Voted[]  = [];
    const withdrawn: Withdrawn[]  = [];
    const income: IncomeAdded[]  = [];
    const invested: Invested[]  = [];
    let amount: bigint[] = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)];
    let stage = -1n;
    console.log('Transactions datass', transactions);
    for (const tx of transactions) {
        for(let i=0; i < tx.outMessagesCount; i++) {
            if(tx.outMessages.get(i)?.body) {
                console.log('Transaction voted', tx.outMessages.get(i)?.body.beginParse().loadUint(32));
                    const eventType = getEventType(tx.outMessages.get(i)?.body!);

                    if (eventType === 'Voted') {
                        const decodedTransfer = newVote(tx.outMessages.get(i)?.body!);
                        voted?.push(decodedTransfer);
                        console.log('Transaction voted', decodedTransfer);
                        amount[0] += decodedTransfer.amount;
                    }
                    if (eventType === 'Withdrawn') {
                        const decodedTransfer = newWithdrawn(tx.outMessages.get(i)?.body!);
                        withdrawn?.push(decodedTransfer);
    
                        amount[3] += decodedTransfer.amount;
                    }

                    if (eventType === 'StageChanged') {
                        const decodedTransfer = newStage(tx.outMessages.get(i)?.body!);
                        if(stage == -1n)
                        stage = decodedTransfer.stage;

                    }

                    if (eventType === 'IncomeAdded') {
                        const decodedTransfer = newIncome(tx.outMessages.get(i)?.body!);
                        income?.push(decodedTransfer);
    
                        amount[2] += decodedTransfer.amount;
                    }

                    if (eventType === 'Invested') {
                        const decodedTransfer = newInvested(tx.outMessages.get(i)?.body!);
                        invested?.push(decodedTransfer);
    
                        amount[1] += decodedTransfer.amount;
                    }
            }
        }    

    }
  

    return {amount: amount, stage: stage, voted: voted, withdrawn: withdrawn, income: income, invested: invested};

}