import { Address, fromNano, toNano } from "ton-core";
import { useDonationContract } from "../hooks/useDonation";
import { useParams } from "react-router-dom";
import { DonationData, donationsData} from "./data";
import {
    Box,
    Flex,
    Button,
    Text,
    Image,
    Heading,
    Input,
    Link,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { get } from "http";
import { useEvent } from "../hooks/useEvent";
import { DonationEvent } from "../../abi/ProjectDeployer/tact_ProjectsDeployer";
import { useDonationEvent } from "../hooks/useDonationEvent";

const cardStyles = {
    borderWidth: "1px",
    borderRadius: "36px",
    overflow: "hidden",
    p: "6",
    boxShadow: "lg",
    bg: "white",
    color: "black",
    width: "300px",
    height: "full",
    minWidth: "300px",
};
export function DetailedDonation() {

    const { id:idS } = useParams<{ id: string }>();
    const id = BigInt(idS!);
    const [donationAmount, setDonationAmount] = useState<string>("0");

    const { donate } = useDonationContract(id);
    

    const [data, setData] = useState<any>(null);
    const [donation, setDonation] = useState<any>([]); 
    const [amount, setAmount] = useState<any>(0);
    async function fetchData() {
        const eventData = await useEvent();
        setData(eventData.donations[Number(id)]);
        const donationData = (await useDonationEvent(eventData.donations[Number(id)].address));
        setAmount(fromNano(donationData.amount));
        setDonation(donationData);
        console.log(donation)
    }
    useEffect(() => {

        fetchData();
    }, []);
    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = "https://st3.depositphotos.com/5434018/37745/i/450/depositphotos_377454872-stock-photo-snow-white-felt-background-frost.jpg";
    };

    function CardList() {
        
        return (
            <>
                { donation && donation.data ? 
                <Box mt="4" {...cardStyles}>

                    <Heading as="h4" size="md" mb="2" color="gray.700" >Donations ({donation?.data.length})</Heading>

                    {donation.data.map((_, index: number) => (
                        <Flex key={index} justify="space-between" align="center" mb="2" >
                            <Box borderWidth="1px" borderRadius="18px" p="2" boxShadow="md" width={"full"} textAlign="center">
                            <Text fontSize={"14px"}>From: <Link color={"blue.400"} href={`https://testnet.tonviewer.com/${donation.data[index].from.toString()}`}>{`${donation.data[index].from.toString().slice(0, 4)}...${donation.data[index].from.toString().slice(-4)}`}</Link></Text>
                                <Text fontSize={"14px"}>Amount: {fromNano(donation.data[index].amount)} TON</Text>
                            </Box>
                        </Flex>
                    ))}
                </Box>
            : <div>Loading...</div>  }
            </>
        );
    }

    return (
        <>
            {data === null ? <div>Loading...</div> :  <Box {...cardStyles}>
            <Flex direction="column" height="100%">
                
                <Image
                    borderRadius={'18px'}
                    src={data!.data.image == null ? "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg" : data!.data.image}
                    alt="Donation Image"
                    width="100%"
                    height="auto"
                    onError={handleImageError}
                />
                <Flex justify="space-between" align="center">
                <Heading as="h3" size="lg" mt="4" fontWeight={'bold'} color="gray.700">{data!.data.title}</Heading>
                <Link mt="4" href="https://donation-website.com">
                    <Button ml={"auto"} rounded={"18px"} bgColor={"black"} color={"white"}>
                        <Image
                        
                            borderRadius={'18px'}
                            src="https://static.vecteezy.com/system/resources/previews/015/337/689/non_2x/web-icon-web-sign-free-png.png"
                            alt="Website Icon"
                            width="20px"
                            height="20px"
                            mr="2"
                        />
                        Visit Website
                    </Button>
                </Link>
                </Flex>
                <Box borderBottom="1px solid" borderColor="gray.200" mt="2" />
                <Text mt="2" >{data!.data.description}</Text>
                <Flex mt="4" justify="space-between">

                    <Text  fontWeight={'bold'} color={"gray.700"}>Owner: </Text> 
                    <Link   color={"blue.400"} href={`https://testnet.tonviewer.com/${data!.owner.toString()}`}>                    
                    <span style={{ marginLeft: 'auto' }}>{`${data!.owner.toString().slice(0,4)}...${data!.owner.toString().slice(-4)}`}</span>
                </Link>
                </Flex>
                <Flex mt="4" justify="space-between">

                    <Text  fontWeight={'bold'} color={"gray.700"}>Contract: </Text> 
                    <Link   color={"blue.400"} href={`https://testnet.tonviewer.com/${data!.address.toString()}`}>                    
                    <span style={{ marginLeft: 'auto' }}>{`${data!.address.toString().slice(0,4)}...${data!.address.toString().slice(-4)}`}</span>
                </Link>
                </Flex>
                {donation && donation.data && 
                 <Flex mt="4" justify="space-between">
                    <Text mt="4" fontWeight="bold" fontSize="s" color="gray.700"> Total Donated</Text>
                    <Text mt="4" fontWeight="inherit" fontSize="s" color="gray.500">{(amount)} TON</Text>
                    </Flex>
                }
                <Flex mt="4" justify="space-between" align="center">
                    <Input
                        rounded={"18px"}
                        placeholder="100 ton"
                        width="30%"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount((e.target.value))}
                    />
                    <Button
                        onClick={async () => {donate(toNano(donationAmount!))}}
                        ml={"auto"}
                        rounded={"18px"}
                        bgColor={"black"}
                        color={"white"}
                        width={"60%"}
                        colorScheme="teal"
                        
                    >
                        Donate
                    </Button>
                </Flex>


            </Flex>

        </Box>}
        
        <CardList />
        </>
    );
}
