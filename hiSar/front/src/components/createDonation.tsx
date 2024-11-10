import {
  Box,
  Flex,
  Button,
  Text,
  Image,
  Center,
  
} from "@chakra-ui/react";
import { useState } from "react";

import { useDeployerContract } from "../hooks/useDeployer";
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
import { Input } from "@chakra-ui/react"

export function CreateDonation() {


    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const [projectImageUrl, setProjectImageUrl] = useState('');



    const {  createDonation } = useDeployerContract();


    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      event.currentTarget.src = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg";
    };

    return (
      <>
        <Flex >
        
              <Box   {...cardStyles} spaceY="12px" bg="white" color="black"  mt={"6"}>
              <Center>
                <Image rounded={'18px'} src={projectImageUrl} alt="Project" onError={handleImageError} />
              </Center>
                <Input rounded={'18px'} type="text"  placeholder="Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                <Input rounded={'18px'} type="text" placeholder="Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
                <Input rounded={'18px'} type="text" placeholder="Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                <Input rounded={'18px'} type="text" placeholder="Image URL" value={projectImageUrl} onChange={(e) => setProjectImageUrl(e.target.value)} />
                <ProjectCard />
                <Button 
                  color={"white"} 
                  bgColor={"black"} 
                  rounded={'18px'}
                  onClick={() => createDonation(
                    projectTitle,
                    projectDescription,
                    projectImageUrl,
                    projectLink
                )}
                style={{ float: 'right' }}
                >
                Create Donation
                </Button>
           
            </Box>
        </Flex>
      </>
    );
    
function ProjectCard() {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text fontSize={'2xl'}>{projectTitle}</Text>
      <Text>{projectDescription}</Text>
    </Flex>
  );
}

}