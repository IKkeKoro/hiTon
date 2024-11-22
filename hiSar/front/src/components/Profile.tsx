import { Address, fromNano } from "ton-core";
import { useJettonContract } from "../hooks/useJettonContract";
import { Box, Text, VStack, HStack, Button as ChakraButton, Flex, Input, Link } from "@chakra-ui/react";
import { useState } from "react";
import { ref } from "../hooks/addresses";

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
    const {subscribe, claim, claimPool ,changeInviter, data, member } = useJettonContract();
    const [menuValue, setMenuValue] = useState("");
    const [inviter, setInviter] = useState("");
    return (

        <Box height={"full"}  >
            <VStack alignItems="stretch" height="100%" maxHeight="100%">
                <Box
                 {...cardStyles} maxHeight={"10%"}  display="flex" justifyContent="center" alignItems="center"
                >
                    <Text fontSize="lg" fontWeight="bold" color="gray.600">Profile</Text>
                    {/* <Text fontSize="sm">{formattedAddress}</Text> */}
                </Box>
                <Box {...cardStyles}
                >
                    <Flex direction="column" justifyContent="space-between" height="100%" spaceY={"16px"}>
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'} color="gray.700">Jetton Balance: </Text> <Text color="gray.500">{fromNano(data.balance)} vots</Text>
                        </Box>
     
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'} color="gray.700">Inviter: </Text> 
                            <Link color={"blue.400"}   
                            href={`https://testnet.tonviewer.com/${member!.inviter.toString()}`}>
                            <Text >{member.inviter.toString().slice(0, 4) + "..." + member.inviter.toString().slice(-4)} </Text>
                            </Link>
                        </Box>
  
                        <Box display="flex" justifyContent="space-between">
                            <Text fontWeight={'bold'} color="gray.700">Total voted: </Text> <Text color="gray.500">{fromNano(member.totalVoted)} </Text>
                        </Box>
                        <Flex spaceX={"40px"} mt={"20px"}>

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
                                    type="number"
                                    value={menuValue}
                                    onChange={(e) => {
                                        const value = Math.max(0, Math.min(3, Number(e.target.value)));
                                        setMenuValue(value.toString());
                                    }}
                                    placeholder="lvl"
                                    mr="2"
                                    rounded={"16px"}
                                />
                            </Box>
                            </Flex>
                            
                            <Flex spaceX={"40px"}>
                                <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" onClick={() => claim()} _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Claim Jettons</ChakraButton>

                            </Flex>
                            <Flex spaceX={"40px"}>
                                <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" onClick={() => claimPool()} _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Claim pool income</ChakraButton>
        
                            </Flex>
                    </Flex>

                </Box>

                <Box justifyContent="center" alignItems="center" {...cardStyles} >
                    
                    <Flex direction="column" alignItems="stretch" >
                    <Box position="relative" spaceY={"20px"}>
                    <Flex direction="column" alignItems="stretch" spaceY={"15px"} >
                        <Link href={`/createproject/`}>
                        <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Create Project</ChakraButton>
                        </Link>
                        <Link href={`/createdonation/`}>
                        <ChakraButton minWidth="full" borderRadius="18px" bg="black" color="white" colorScheme="teal" _hover={{ boxShadow: "xl", transform: "scale(1.02)" }} transition="all 0.2s">Create Donation</ChakraButton>
                        </Link>
                    </Flex>

                           
                            { ref === member.inviter.toString() ?  (
                                               <Flex mt={"16px"} direction={"column"} spaceY={"14px"}>
                                               <ChakraButton
                                                   
                                                   minWidth="full"
                                                   borderRadius="18px"
                                                   bg="black"
                                                   color="white"
                                                   colorScheme="teal"
                                                   _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                                                   transition="all 0.2s"
                                                   mr="auto"
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
                                               </Flex>
                            ) : ( <></>)}
                          
                        </Box>
                    </Flex>
                   
                </Box>
            </VStack>
        </Box>
    );
}
