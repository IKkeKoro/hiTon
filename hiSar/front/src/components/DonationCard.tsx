import { Address } from "ton-core";
import { useProjectContract } from "../hooks/useProject";
import { projectData, donationsData, NewDonation } from "./data";
import { fromNano } from "ton-core";
import {
  Box,
  Flex,
  Button,
  Text as ChakraText,
  Image,
  Heading,
  Link,
  Center,
  
} from "@chakra-ui/react";

import { useColorModeValue } from "@chakra-ui/color-mode";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
const projectsData = projectData;
const donationsDatas = donationsData;
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

interface ProjectCardProps {
  id: bigint;
  onClick: () => void;
  data: NewDonation
}
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;


export function DonationCard(props: ProjectCardProps) {
  const { id, data } = props;
  const cardStyles = {
    borderWidth: "0.1px",
    borderRadius: "36px",
    overflow: "hidden",
    p: "6",
    boxShadow: "lg",
    bg: "white",
    color: "black",
    width: "320px",
    height: "100%",
    transition: "transform 0.3s, filter 0.3s",
    background: "white",
    backgroundSize: "200% 200%",
    _hover: {
      transform: "scale(1.03)",
    },
    marginBottom: "24px",
  };
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg";
  };

  return (
    <Box
      {...cardStyles}
    >
        <Flex direction="column" height="100%">
          <Image
            rounded={'18px'}
            src={data!.data.image.toString()}
            alt="Donation Image"
            width="100%"
            height="auto"
            onError={handleImageError}
          />
          <Center>
            <Heading as="h3" size="lg" mt="4">{data!.data.title.toString()}</Heading>
          </Center>
          <Box borderBottom="1px solid" borderColor="gray.200" mt="2" />
          <Box>
            <Text mt="2" color="gray.600" fontWeight="medium">{data!.data.description.toString()}</Text>
          </Box>
          <Flex mt="4" justify="space-between">
          
            <Text fontWeight={'bold'}>Owner: </Text>
            <Link color={"blue.400"}  href={`https://testnet.tonviewer.com/${data!.owner.toString()}`}>
            <span>{data!.owner.toString().slice(0, 4)}...{data!.owner.toString().slice(-4)}</span>
          </Link>
          </Flex>
          <Link mt="4" href={`/donation/${id}`}>
            <Flex justify="flex-end" align="center" width="100%">
              <Button bgColor={'black'} color={'white'} rounded={"18px"}>
                {/* <Image
                  src="https://static.vecteezy.com/system/resources/previews/015/337/689/non_2x/web-icon-web-sign-free-png.png"
                  alt="Website Icon"
                  width="20px"
                  height="20px"
                  mr="1"
                  pr="1"
                /> */}
                Read More
              </Button>
            </Flex>
          </Link>
        </Flex>
    </Box>
  );
}
