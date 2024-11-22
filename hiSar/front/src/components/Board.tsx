import { ProjectCard } from "./ProjectCard";
import { useDeployerContract } from "../hooks/useDeployer";
import { Address } from "ton-core";
import { useState, useEffect } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useEvent } from "../hooks/useEvent";
import { DonationCard } from "./DonationCard";

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
    const [data, setData] = useState<any>(null);
    async function fetchData() {
        const eventData = await useEvent();
        setData(eventData);
    }
    useEffect(() => {

        fetchData();
    }, []);


    function CardList({ view, onCardClick }: { view: 'projects' | 'donations', onCardClick: (id: bigint) => void }) {
        const items = data ? (view === 'projects' ? Array.from({ length: Number(data.projects.length) }) : Array.from({ length: Number(data.donations.length) })) : [];
    
        return (
            <>
                {items.map((_, index) => {
                    return view === 'projects' ? (
                        <ProjectCard key={index} id={BigInt(index)} data={data.projects[index]} onClick={() => onCardClick(BigInt(index))} />
                    ) : (
                        <DonationCard key={index} id={BigInt(index)} data={data.donations[index]} onClick={() => onCardClick(BigInt(index))} />
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
                <Button bg="black" color="white"  maxWidth="80px" borderRadius="18px" onClick={() => { fetchData(); }}>Reload</Button>
            </Flex>
            <CardList view={view} onCardClick={() => { /* handle card click */ }} />
        </Flex>
    );
}