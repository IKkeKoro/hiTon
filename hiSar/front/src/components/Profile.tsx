import { Address } from "ton-core";
import { useJettonContract } from "../hooks/useJettonContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { Box, Text, VStack, HStack, Button as ChakraButton, Flex, Input, Link } from "@chakra-ui/react";
import { useState } from "react";

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

    transition: "transform 0.3s, filter 0.3s",
    background: "white",
    backgroundSize: "200% 200%",
    _hover: {
      transform: "scale(1.03)",
    },
    marginBottom: "24px",
  };
export function Profile() {
    const { wallet } = useTonConnect();
    const { balance,  subscribe, claim, changeInviter } = useJettonContract();
    const [menuValue, setMenuValue] = useState("");
    const [inviter, setInviter] = useState("");
    return (
        <Box height={"full"}  >
            <VStack alignItems="stretch" height="100%" maxHeight="100%">
                <Box
                 {...cardStyles} maxHeight={"10%"}  display="flex" justifyContent="center" alignItems="center"
                >
                    <Text fontSize="lg" fontWeight="bold">Profile</Text>
                    {/* <Text fontSize="sm">{formattedAddress}</Text> */}
                </Box>
                <Box {...cardStyles}
                >
                    <Flex direction="column" justifyContent="space-between" height="100%">
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'}>Jetton Balance: </Text> <span>{balance} </span>
                        </Box>
                        <Box display="flex" justifyContent="space-between">   
                            <Text fontWeight={'bold'}>TON Balance: </Text> <span>{balance} </span>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'}>Projects: </Text> <span>{3} </span>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'}>Donations: </Text> <span>{2} </span>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'}>Total Income: </Text> <span>{1} </span>
                        </Box>
                    </Flex>
                </Box>
                <HStack {...cardStyles}>
                    
                    <Flex direction="column" alignItems="stretch" >
                    <Box position="relative" spaceY={"20px"}>
                    <Flex direction="column" alignItems="stretch" spaceY={"15px"} >
                        <Link href={`/my-twa/createproject/`}>
                        <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Create Project</ChakraButton>
                        </Link>
                        <Link href={`/my-twa/createdonation/`}>
                        <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Create Donation</ChakraButton>
                        </Link>
                    </Flex>
                            <Flex spaceX={"40px"}>

                                <ChakraButton
                                    minWidth="160px"
                                    borderRadius="18px"
                                    bg="black"
                                    color="white"
                                    colorScheme="teal"
                                    _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                                    transition="all 0.2s"
                                    ml="auto"
                                    onClick={() => subscribe(BigInt(menuValue))}
                                >
                                    Subscribe
                                </ChakraButton>
                                <Box>
                                    <Input
                                        value={menuValue}
                                        onChange={(e) => setMenuValue(e.target.value)}
                                        placeholder="lvl"
                                        mr="2"
                                        rounded={"16px"}
                                    />
                                </Box>
                            </Flex>
                            <Flex spaceX={"40px"}>
                                <ChakraButton minWidth="160px" borderRadius="18px" bg="black" color="white" colorScheme="teal" onClick={() => claim()} _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Claim Jettons</ChakraButton>
                                <Box mt={"0px"}>
                                    <Text>0 to claim</Text>
                                </Box>
                            </Flex>
                            <Flex spaceX={"40px"}>
                                <ChakraButton minWidth="160px" borderRadius="18px" bg="black" color="white" colorScheme="teal" onClick={() => claim()} _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Claim pool income</ChakraButton>
                                <Box mt={"0px"}>
                                    <Text>0 tons to claim</Text>
                                </Box>
                            </Flex>
                            

                                <ChakraButton
                                    minWidth="160px"
                                    borderRadius="18px"
                                    bg="black"
                                    color="white"
                                    colorScheme="teal"
                                    _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                                    transition="all 0.2s"
                                    ml="auto"
                                    onClick={() => changeInviter(Address.parse(inviter))}
                                >
                                    Change Inviter
                                </ChakraButton>
                                <Box>
                                    <Input
                                        value={inviter}
                                        onChange={(e) => setInviter(e.target.value)}
                                        placeholder="inviter address"
                                        mr="2"
                                        rounded={"16px"}
                                    />
                                </Box>
                          
                        </Box>
                    </Flex>
                   
                </HStack>
            </VStack>
        </Box>
    );
}
