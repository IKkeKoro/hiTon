import { Address } from "ton-core";
import { useJettonContract } from "../hooks/useJettonContract";
import { useDeployerContract } from "../hooks/useDeployer";
import { useProjectContract } from "../hooks/useProject";
import { useTonConnect } from "../hooks/useTonConnect";
import { useParams } from "react-router-dom";
import { projectData } from "./data";
import {
    Box,
    Flex,
    Button,
    Text as ChakraText,
    Image,
    Input,
    Heading,
    Link,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Text = (props: any) => (
    <ChakraText 
        fontSize="md" 
        color="gray.700" 
        lineHeight="tall" 
        fontWeight="normal" 
        {...props} 
    />
);
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
  const projectsData = projectData
export function DetailedProject() {
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const { id:idS } = useParams<{ id: string }>();
    const id = BigInt(idS!);
    const {wallet } = useTonConnect();
    const fetchCards = async () => {
        const data = await getProjectData(BigInt(id));
        setProjectData(data);
        console.log(projectData);
      };
      
      useEffect(() => {
              
        fetchCards()
        if(projectData == null || undefined){  
          fetchCards()
        }
      
      }, []);
      const { getProjectData, invest } = useProjectContract(BigInt(id));


    const {
        getProjectAddress,
    } = useDeployerContract();
    const {transfer} = useJettonContract()


    const address = getProjectAddress(id);
    const [donationAmount, setDonationAmount] = useState("");
    const cardStyles = {
        borderWidth: "0.2px",
        borderRadius: "36px",
        overflow: "hidden",
        p: "6",
        boxShadow: "lg",
        bg: "white",
        color: "black",
        width: "360px",
        height: "100%",
        minHeight: "540px",
        transition: "transform 0.3s, filter 0.3s",
        background: "white",
        backgroundSize: "200% 200%",
        _hover: {
          transform: "scale(1.03)",
        },
        marginBottom: "24px",
      };


    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = "https://st3.depositphotos.com/5434018/37745/i/450/depositphotos_377454872-stock-photo-snow-white-felt-background-frost.jpg";
    };

    return (
        <Box {...cardStyles}>
            <Flex direction="column" height="100%" spaceY={"20px"}>
                <Image
                    borderRadius={'18px'}
                    src={projectsData[Number(id)]!.data.image}
                    alt="Project Image"
                    width="100%"
                    height="auto"
                    onError={handleImageError}
                />
                <Heading as="h3" size="lg" mt="4">{projectsData[Number(id)]!.data.title}</Heading>
                <Text mt="2">Description of the project goes here.</Text>
                <Flex mt="4" justify="space-between">
                    <Text fontWeight="bold">Stage: </Text> <span style={{ marginLeft: 'auto' }}>{projectsData[Number(id)]!.id.toString()}</span>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold">Invested: </Text><span style={{ marginLeft: 'auto' }}>{projectsData[Number(id)]!.invested.toString()} tons</span>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold">Voted:  </Text><span style={{ marginLeft: 'auto' }}>{projectsData[Number(id)]!.voted.toString()} vots</span>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold">Requirement: </Text> <span style={{ marginLeft: 'auto' }}>{projectsData[Number(id)]!.required.toString()} tons</span>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold">Owner: </Text> <span style={{ marginLeft: 'auto' }}>{`${projectsData[Number(id)]!.owner.toString().slice(0,4)}...${projectsData[Number(id)]!.owner.toString().slice(-4)}`}</span>
                </Flex>
                <Flex mt="4" justify="space-between" align="center">
                    <Input
                        rounded={"18px"}
                        placeholder="100 ton"
                        width="40%"
                        value={donationAmount}
                        visibility={Number(projectsData[Number(id)]!.id) === 0 || Number(projectsData[Number(id)]!.id) === 3  ? "hidden" : "visible"}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            if (Number(projectsData[Number(id)]!.id) === 1) {
                                transfer(Address.parse(wallet!), BigInt(donationAmount)); 
                            } else if (Number(projectsData[Number(id)]!.id) === 2) {
                                invest(BigInt(donationAmount));
                            } else if (Number(projectsData[Number(id)]!.id) === 3) {
                                // withdraw(Address.parse(wallet!))
                            } 
                        }}
                        ml={"auto"}
                        rounded={"18px"}
                        bgColor={Number(projectsData[Number(id)]!.id) === 0 ? "gray" : "black"}
                        color={"white"}
                        width={"48%"}
                        colorScheme="teal"
                        visibility={Number(projectsData[Number(id)]!.id) === 0 ? "hidden" : "visible"}
                    >   
                        {Number(projectsData[Number(id)]!.id) === 1 ? "Vote" : Number(projectsData[Number(id)]!.id) === 2 ? "Invest" : Number(projectsData[Number(id)]!.id) === 3 ? "Claim" : "Donate"}
                    </Button>
                </Flex>
                <Link mt="4" href="https://project-website.com">
                    <Button color={"white"} bgColor={"black"} rounded={"18px"} ml="auto">
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
