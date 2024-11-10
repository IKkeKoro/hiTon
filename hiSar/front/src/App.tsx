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
  const bgGradient = useColorModeValue("linear-gradient(135deg, #ffffff 4000%, #000000 6%)", "linear-gradient(135deg, #ffffff 0%, #000000 100%)");
  return (
    <Router>
    <Box bg="rgba(255, 255, 255, 0.5)" color={color} bgImage={bgGradient} minH="100vh" p="20px" transition="background-color 0.3s ease, color 0.3s ease" style={{ backdropFilter: "blur(100px)" }}>
      <Center >
          <Flex direction="column" gap="16px">
            <Flex justify="center" gap="10px">
              {window.location.pathname !== "/my-twa/" ? (
              <Link href={`/my-twa/`}>
                <ChakraButton bgColor="black" color="white" borderRadius="20px">
                Show Board
                </ChakraButton>
              </Link>
              ) : (
              <Link href={`/my-twa/profile`}>
                <ChakraButton bgColor="black" color="white" borderRadius="20px" onClick={() => {
                setShowBoard(!showBoard);
                }}>
                {showBoard ? "Show Profile" : "Show Board"}
                </ChakraButton>
              </Link>
              )}
              <TonConnectButton  />
              
            </Flex>
            <Routes>
              <Route path={"/my-twa/createproject/"} element={<CreateProject />} />
              <Route path={"/my-twa/createdonation/"} element={<CreateDonation />} />
              <Route path={"/my-twa/profile/"} element={<Profile />} />
              <Route path={"/my-twa/"} element={
          <Flex direction="column" align="center" spaceY={4}>
            {showBoard ? <Board /> : <Profile />}
          </Flex>
              } />
              <Route path={`/my-twa/project/:id`} element={<DetailedProject />} />
              <Route path="/my-twa/donation/:id" element={<DetailedDonation />} />
            </Routes>
          </Flex>
        
      </Center>
    </Box>
    </Router>
  );
}

export default App;
