import { ProjectCard } from "./ProjectCard";
import { useDeployerContract } from "../hooks/useDeployer";
import { Address } from "ton-core";
import { useState, useEffect } from "react";
import { Button, Flex } from "@chakra-ui/react";

export type ProjectData =  {
    $$type: "ProjectData";
    voted: bigint;
    invested: bigint;
    required: bigint;
    withdrawn: bigint;
    income: bigint;
    owner: Address;
    id: bigint;
    data: {
        $$type: "Data";
        title: string;
        description: string;
        image: string;
        link: string;
    };
} | undefined


export function Board() {
    const [view, setView] = useState<'projects' | 'donations'>('projects');
    const [donationsId, setDonationId] = useState<bigint | null>(2n);
    const [projectsId, setProjectId] = useState<bigint | null>(3n);

    const {
        getDeployerData,
      } = useDeployerContract();
    //   const { getDonationData } = useDonationContract(0n);
    //   const address = project ? getProjectAddress(id) : getDonationAddress(id);
    const fetchData = async () => {
        const data =  await getDeployerData();
        setDonationId(data!.donationId);
        setProjectId(data!.projectId)
        console.log(data);
    };


   
    useEffect(() => {
        

        fetchData();
    }, []);

    function CardList({ view, onCardClick }: { view: 'projects' | 'donations', onCardClick: (id: bigint) => void }) {
        const items = view === 'projects' ? Array.from({ length: Number(projectsId) }) : Array.from({ length: Number(donationsId) });
    
        return (
            <>
                {items.map((_, index) => {
                    return (
                        <ProjectCard key={index} id={BigInt(index)} project={view === 'projects'}  onClick={() => onCardClick(BigInt(index))} />
                    );
                })}
            </>
        );
    }

    return (
        <Flex style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Flex mb="20px" spaceX={'10px'}>
                <Button bg="black" color="white" borderRadius="18px" onClick={() => { setView('projects'); }}>Projects</Button>
                <Button bg="black" color="white" borderRadius="18px" onClick={() => { setView('donations'); }}>Donations</Button>
            </Flex>
            <CardList view={view} onCardClick={(id) => { /* handle card click */ }} />
        </Flex>
    );
}