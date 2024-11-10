import { Address } from "ton-core";
import { useDeployerContract } from "../hooks/useDeployer";
import { useProjectContract } from "../hooks/useProject";
import { projectData, donationsData } from "./data";
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
  project: boolean;
  onClick: () => void;
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



export function ProjectCard(props: ProjectCardProps) {
  const { id, project } = props;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const {
  } = useDeployerContract();
  const { getProjectData } = useProjectContract(id);
  
  const fetchCards = async () => {
    const data = await getProjectData();
    setProjectData(data);
    console.log(projectData);
  };
  
  useEffect(() => {    
    fetchCards()
    if(projectData == null || undefined){  
      fetchCards()
    }
  
  }, []);

  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #ffffff 0%, #000000 800%)",
    "linear-gradient(135deg, #101e1e 0%, #101e1e 30%)",
  );
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
      {project ? (
        <Flex direction="column" height="100%">
          <Image
            rounded={'18px'}
            src={projectsData[Number(id)]!.data.image}
            alt="Project Image"
            width="100%"
            height="auto"
            onError={handleImageError}
          />
          <Center>
            <Heading as="h3" size="lg" mt="4">{projectsData![Number(id)]!.data.title.toString()}</Heading>
          </Center>
          <Box><Text mt="2">{projectsData![Number(id)]!.data.description.toString()}</Text></Box>

          <Flex mt="4" justify="space-between">
            <Text fontWeight={'bold'}>Stage: </Text><span>{projectsData![Number(id)]!.id.toString()}</span>
          </Flex>
          <Flex mt="2" justify="space-between">
            <Text fontWeight={'bold'}>Invested: </Text><span>{projectsData![Number(id)]!.invested.toString()} tons</span>
          </Flex>
          <Flex mt="2" justify="space-between">
            <Text fontWeight={'bold'}>Voted: </Text><span>{projectsData![Number(id)]!.voted.toString()} vots</span>
          </Flex>
          <Flex mt="2" justify="space-between">
            <Text fontWeight={'bold'}>Requirement: </Text><span>{projectsData![Number(id)]!.required.toString()} ton</span>
          </Flex>
          <Flex mt="2" justify="space-between">
            <Text fontWeight={'bold'}>Owner: </Text><span>{projectsData![Number(id)]!.owner.toString().slice(0, 4)}...{projectsData![Number(id)]!.owner.toString().slice(-4)}</span>
          </Flex>
          <Flex justify="flex-end" align="center" width="100%">
            <Link mt="4" href={`/my-twa/project/${id}`}>
                <Button bgColor={'black'} color={'white'} borderRadius="18px">
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
            </Link>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column" height="100%">
          <Image
            rounded={'18px'}
            src={donationsDatas![Number(id)]!.data.image.toString()}
            alt="Donation Image"
            width="100%"
            height="auto"
            onError={handleImageError}
          />
          <Center>
            <Heading as="h3" size="lg" mt="4">{donationsDatas![Number(id)]!.data.title.toString()}</Heading>
          </Center>
          <Box>
            <Text mt="2">{donationsDatas![Number(id)]!.data.description.toString()}</Text>
          </Box>
          <Flex mt="4" justify="space-between">
            <Text fontWeight={'bold'}>Owner: </Text><span>{projectsData![Number(id)]!.owner.toString().slice(0, 4)}...{projectsData![Number(id)]!.owner.toString().slice(-4)}</span>
          </Flex>
          <Flex mt="2" justify="space-between">
            <Text fontWeight={'bold'}>Total Donated: </Text> <span>{donationsDatas![Number(id)]!.donated.toString()}</span>
          </Flex>
          <Link mt="4" href={`/my-twa/donation/${id}`}>
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
      )}
    </Box>
  );
}
