import { getHttpEndpoint } from "@orbs-network/ton-access";

import { TonClient } from "ton";
import { Cell } from "ton-core";
import { Buffer } from "buffer";
import { loadNewDonation, loadNewProject, NewDonation, NewProject } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { deployer } from "./addresses";
import { Address } from "ton-core";
import { DonationData, ProjectData } from "../components/data";
// Define the emitted message formats


// Function to decode the TransferEvent from a cell
function newDonation(cell: Cell): NewDonation {
    const slice = cell.beginParse();
    return loadNewDonation(slice);
}

// Function to decode the StakeEvent from a cell
function newProject(cell: Cell): NewProject {
    const slice = cell.beginParse();
    return loadNewProject(slice);
}

function getEventType(cell: Cell): 'NewProject' | 'NewDonation' | 'Unknown' {
    const slice = cell.beginParse();
    const header = slice.loadUint(32);
    if (header === 3359593827) {
        return 'NewDonation';
    } else if (header === 1463093253) {
        return 'NewProject';
    } else {
        return 'Unknown';
    }
}

export async function useEvent() {
    const endpoint = await getHttpEndpoint({
        network: "testnet",
    });

    const client = new TonClient({ endpoint });
    const transactions = await client.getTransactions(Address.parse(deployer), { limit: 30 });
    // console.log('Transactions data', transactions);
    const donations: NewDonation[] = [];
    const projects: NewProject[] = [];
    for (const tx of transactions) {
        if(tx.outMessages.get(0)?.body) {
            console.log('Transaction data', tx.outMessages.get(0)?.body.beginParse().loadUint(32));
                const eventType = getEventType(tx.outMessages.get(0)?.body!);

                if (eventType === 'NewDonation') {
                    const decodedTransfer = newDonation(tx.outMessages.get(0)?.body!);
                    donations.push(decodedTransfer);
                    console.log('Decoded transfer', decodedTransfer);
                } else if (eventType === 'NewProject') {
                    const decodedStake = newProject(tx.outMessages.get(0)?.body!);
                    projects.push(decodedStake);
                    console.log('Decoded stake', decodedStake);
                }
        }
            
   
    }
    donations.reverse();
    projects.reverse();
    return {projects: projects, donations: donations};

}