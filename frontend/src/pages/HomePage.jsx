import React,{useEffect} from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
} from "@chakra-ui/react";

import Login from "./components/Authentication/Login.jsx";
import Signup from "./components/Authentication/Signup.jsx";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
function HomePage() {
  
  const {setUser}=ChatState()
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 50px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign={"center"}
      >
        <Text fontSize={"4xl"} fontFamily={"work sans"}>
          Talk-A-Tive
        </Text>
      </Box>

      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
