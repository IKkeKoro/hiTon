import "./App.css";
import { Flex, Box, Button as ChakraButton, Center, Link } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { TonConnectButton } from "@tonconnect/ui-react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "@twa-dev/sdk";
import { Board } from "./components/Board";
import  { useState } from "react";
import { Profile } from "./components/Profile";
import { DetailedProject } from "./components/detailedProject";
import { DetailedDonation } from "./components/detailedDonation";
import { CreateProject } from "./components/createProject";
import { CreateDonation } from "./components/createDonation";

export function App() {
  const [showBoard, setShowBoard] = useState(true);
  const color = useColorModeValue("black", "white");
  const bgGradient = useColorModeValue("linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 100%)", "linear-gradient(135deg, #303030 800%, #202020 100%)");
  return (
    <Router>
    <Box bg="rgba(255, 255, 255, 0.5)" color={color} bgImage={bgGradient} minH="100vh" p="20px" transition="background-color 0.3s ease, color 0.3s ease" style={{ backdropFilter: "blur(100px)" }}>
      <Center >
          <Flex direction="column" gap="16px">
            <Flex justify="center" gap="10px">
              {window.location.pathname !== "/" ? (
              <Link href={`/`}>
                <ChakraButton bgColor="black" color="white" borderRadius="20px">
                Show Board
                </ChakraButton>
              </Link>
              ) : (
            
                <ChakraButton bgColor="black" color="white" borderRadius="20px" onClick={() => {
                setShowBoard(!showBoard);
                }}>
                {showBoard ? "Show Profile" : "Show Board"}
                </ChakraButton>
           
              )}
              <TonConnectButton  />
              
            </Flex>
            <Routes>
              <Route path={"/createproject/"} element={<CreateProject />} />
              <Route path={"/createdonation/"} element={<CreateDonation />} />
              <Route path={"/profile/"} element={<Profile />} />
              <Route path={"/"} element={
          <Flex direction="column" align="center" spaceY={4}>
            {showBoard ? <Board /> : <Profile />}
          </Flex>
              } />
              <Route path={`/project/:id`} element={<DetailedProject />} />
              <Route path="/donation/:id" element={<DetailedDonation />} />
            </Routes>
          </Flex>
        
      </Center>
    </Box>
    </Router>
  );
}

export default App;
