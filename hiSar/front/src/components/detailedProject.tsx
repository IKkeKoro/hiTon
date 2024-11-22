import { Address, toNano } from "ton-core";
import { useJettonContract } from "../hooks/useJettonContract";
import { useDeployerContract } from "../hooks/useDeployer";
import { useProjectContract } from "../hooks/useProject";
import { useTonConnect } from "../hooks/useTonConnect";
import { useParams } from "react-router-dom";
import { projectData } from "./data";
import { fromNano } from "ton-core";
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
import { useEvent } from "../hooks/useEvent";
import { useProjectEvent } from "../hooks/useProjectEvent";
import { useUserData } from "../hooks/useUserData";

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

const data = [
{
  data: []
},
{
  data: []
},
{
  data: []
},
{
  data: []
}
]


export function DetailedProject() {
    const { id:idS } = useParams<{ id: string }>();
    const id = BigInt(idS!);
    const { withdraw } = useUserData(id);
    const { invest } = useProjectContract(id);
    const {transfer} = useJettonContract()
    const [data, setData] = useState<any>(null);
    const [values, setValues] = useState<any>([0n,0n, 0n, 0n, 0n]);
    const [view, setView] = useState<any>(0);
    const [events, setEvents] = useState<any>(data);
    useEffect(() => {
        async function fetchData() {
            const eventData = await useEvent();
            setData(eventData.projects[Number(id)]);
            const projectEventData = await useProjectEvent(eventData.projects[Number(id)].address);
            setValues([projectEventData.stage,projectEventData.amount[0], projectEventData.amount[1], projectEventData.amount[2], projectEventData.amount[3]]);
            const events = [projectEventData.voted, projectEventData.invested, projectEventData.income, projectEventData.withdrawn];
            setEvents(events)

        }
        fetchData();
    }, []);
    const {
        getProjectAddress,
    } = useDeployerContract();



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


    
    function CardList() {
        
      return (
          <>
                  <Flex mt="4" justify="space-between">
                    <Button
                      onClick={() => setView(0)}
                      bgColor={"black"}
                      color="white"
                      rounded="18px"
                      width="30%"
                    >
                      Voted
                    </Button>
                    <Button
                      onClick={() => setView(1)}
                      bgColor={"black"}
                      color="white"
                      rounded="18px"
                      width="30%"
                    >
                      Invested
                    </Button>
                    <Button
                      onClick={() => setView(2)}
                      bgColor={"black"}
                      color="white"
                      rounded="18px"
                      width="30%"
                    >
                      Withdrawn
                    </Button>
                  </Flex>


              { events  ? 
              <Box mt="4" {...cardStyles} minH={'auto'}>
                  <Text as="h4" size="md" mb="2" color="gray.700" > {view === 0 ? "Voted" : view === 1 ? "Invested" : "Withdrawn"} ({events[view].length}) </Text>
                  {/* <Heading as="h4" size="md" mb="2" color="gray.700" minH={'140px'}>Donations ({events[view]?.data.length})</Heading> */}

                  {events[view].map((_, index: number) => (

                      <Flex key={index} justify="space-between" align="center" mt="2">

                            <Box borderWidth="1px" borderRadius="18px" p="2" boxShadow="md" width={"full"} textAlign="center">
                            <Text fontSize={"14px"}>From: <Link color={"blue.400"} href={`https://testnet.tonviewer.com/${events[view][index].from.toString()}`}>{`${events[view][index].from.toString().slice(0, 4)}...${events[view][index].from.toString().slice(-4)}`}</Link></Text>
                                <Text fontSize={"14px"}>Amount: {fromNano(events[view][index].amount)} {view === 0 ? " Vots" : " Ton"}</Text>
              
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
        {data === null ? <div>Loading...</div> :  
        <Box {...cardStyles}>
            <Flex direction="column" height="100%" spaceY={"20px"}>
                <Image
                    borderRadius={'18px'}
                    src={data!.data.image}
                    alt="Project Image"
                    width="100%"
                    height="auto"
                    onError={handleImageError}
                />
                <Flex justify="space-between" align="center">
                <Heading as="h3" size="lg" mt="4">{data!.data.title}</Heading>
                <Link mt="4" href="https://project-website.com">
                    <Button color={"white"} bgColor={"black"} rounded={"full"} ml="auto" maxW="full">
                        <Image
                            borderRadius={'18px'}
                            src="https://static.vecteezy.com/system/resources/previews/015/337/689/non_2x/web-icon-web-sign-free-png.png"
                            alt="Website Icon"
                            w={"20px"}
                            height="20px"
              
                        />
                      Site
                    </Button>
                </Link>
                </Flex>
                <Box borderBottom="1px solid" borderColor="gray.200" mt="2" />
                <Text mt="2">{data!.data.description}</Text>

                <Flex mt="4" justify="space-between">
                <Text fontWeight={'bold'} color="gray.700">Status: </Text>
          
          <Button
          width="60px"
          height="12px"
          borderRadius="50%"
          bgColor={(() => {
            switch (values[0]) {
            case BigInt(0):
              return "rgba(255, 0, 0, 0.5)"; // Red
            case BigInt(1):
              return "rgba(255, 0, 0, 0.4)"; // Yellow
            case BigInt(2):
              return "rgba(255, 165, 0, 0.6)"; // Orange
            case BigInt(3):
              return "rgba(0, 128, 0, 0.4)"; // Green
            default:
              return "transparent";
            }
          })()}
          >
          <span>
          {(() => {
            switch (values[0]) {
            case BigInt(0):
              return "Not Active";
            case BigInt(1):
              return "Vote";
            case BigInt(2):
              return "Invest";
            case BigInt(3):
              return "Active";
            default:
              return "Unknown";
            }
          })()}
          </span>
          </Button>
        </Flex>

                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold" color="gray.700">Invested: </Text>
                    <Text  color="gray.500" ml="auto">{fromNano(values[2]).toString()} / {fromNano(data!.required).toString()}  tons</Text>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold" color="gray.700">Voted: </Text>
                    <Text  color="gray.500" ml="auto">{fromNano(values[1]).toString()}  / {(fromNano(data!.required* 20n)).toString()} vots</Text>
                </Flex>

                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold" color="gray.700">Owner: </Text>
                    <Link   href={`https://testnet.tonviewer.com/${data!.owner.toString()}`}>
                    
                    <Text color={"blue.400"} ml="auto">{`${data!.owner.toString().slice(0, 4)}...${data!.owner.toString().slice(-4)}`}</Text>
                    </Link>
                </Flex>
                <Flex mt="2" justify="space-between">
                    <Text fontWeight="bold" color="gray.700">Contract: </Text>
                    <Link   href={`https://testnet.tonviewer.com/${data!.address.toString()}`}>
                    
                    <Text color={"blue.400"} ml="auto">{`${data!.address.toString().slice(0, 4)}...${data!.address.toString().slice(-4)}`}</Text>
                    </Link>
                </Flex>
                <Flex mt="4" justify="space-between" align="center">
                    <Input
                        rounded={"18px"}
                        placeholder="100"
                        width="40%"
                        value={donationAmount}
                        visibility={Number(values[0]) === 0 || Number(values[0]) === 3  ? "hidden" : "visible"}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            if (Number(values[0]) === 1) {
                                transfer(toNano(donationAmount), data!.address.toString()); 
                            } else if (Number(values[0]) === 2) {
                                invest(toNano(donationAmount));
                            } else if (Number(values[0]) === 3) {
                                withdraw()
                            } 
                        }}
                        ml={"auto"}
                        rounded={"18px"}
                        bgColor={Number(values[0]) === 0 ? "gray" : "black"}
                        color={"white"}
                        width={"48%"}
                        colorScheme="teal"
                        visibility={Number(values[0]) === 0 ? "hidden" : "visible"}
                    >   
                        {Number(values[0]) === 1 ? "Vote" : Number(values[0]) === 2 ? "Invest" : Number(values[0]) === 3 ? "Claim" : "Donate"}
                    </Button>
                </Flex>

                
            </Flex>

        </Box>}
        <CardList/>
    </>  
  );
    
}
