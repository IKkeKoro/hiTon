import { Address } from "ton-core";
import { useDeployerContract } from "../hooks/useDeployer";
import { useDonationContract } from "../hooks/useDonation";
import { useParams } from "react-router-dom";
import { donationsData} from "./data";
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
export type DonationData = {
    donated: bigint;
    deployer: Address;
    id: bigint;
    owner: Address;
    data: {
        title: string;
        description: string;
        image: string;
        link: string;
    };
}
export function DetailedDonation() {

    const { id:idS } = useParams<{ id: string }>();
    const id = BigInt(idS!);

    const donationDatas = donationsData;
    const [donationAmount, setDonationAmount] = useState<number>(0);
    const [donationData, setDonationData] = useState<DonationData | null>();
    const {
        getDonationAddress,
    } = useDeployerContract();
    const { getDonationData,donate } = useDonationContract(id);
    const address = getDonationAddress(id);
    
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
    const fetchDonationData = async () => {
        const data = await getDonationData();
        const object = {
            donated: data!.donated,
            deployer: data!.deployer,
            id: data!.id,
            owner: data!.owner,
            data: {
                title: data!.data.title,
                description: data!.data.description,
                image: data!.data.image,
                link: data!.data.link,
            },
        }
        setDonationData(object);
    };

    useEffect(() => {
        fetchDonationData();


        if(donationData?.owner == null || undefined){

            fetchDonationData();  
            console.log(donationData);         
        }
    }, []);

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = "https://st3.depositphotos.com/5434018/37745/i/450/depositphotos_377454872-stock-photo-snow-white-felt-background-frost.jpg";
    };

    return (
        <Box {...cardStyles}>
            <Flex direction="column" height="100%">
                <Image
                    borderRadius={'18px'}
                    src={donationDatas[Number(id)]!.data.image == null ? "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg" : donationDatas[Number(id)]!.data.image}
                    alt="Donation Image"
                    width="100%"
                    height="auto"
                    onError={handleImageError}
                />
                <Heading as="h3" size="lg" mt="4" fontWeight={'bold'}>{donationDatas[Number(id)]!.data.title}</Heading>
                <Text mt="2" >{donationDatas[Number(id)]!.data.description}</Text>
                <Flex mt="4" justify="space-between">
                    <Text fontWeight={'bold'}>Owner: </Text> <span style={{ marginLeft: 'auto' }}>{`${donationDatas[Number(id)]!.owner.toString().slice(0,4)}...${donationDatas[Number(id)]!.owner.toString().slice(-4)}`}</span>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight={'bold'} >Total Donated: </Text> <span style={{ marginLeft: 'auto' }}>{donationDatas[Number(id)]!.donated.toString()}</span>
                </Flex>
                <Flex mt="4" justify="space-between" align="center">
                    <Input
                        rounded={"18px"}
                        placeholder="100 ton"
                        width="30%"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Number(e.target.value))}
                    />
                    <Button
                        onClick={async () => {donate(BigInt(donationAmount!))}}
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
        </Box>
    );
}
