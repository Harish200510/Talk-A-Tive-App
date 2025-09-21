import React, { useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChatState } from "../../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
function SideDrawer() {
  const navigate = useNavigate();

  //context API where we will get the userinfo here
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  //used for the open and close button function
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);

  //when we onclick the logout we will simply erase the useinfo and navigate to login page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    //if the searchbox is empty just show warning
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    // in try block first set the loading to true
    //set the headers in Auth put the token beacuse we added the protect in route
    //and then search the user with the api
    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setloading(false);
      setsearchResult(data);
      console.log(data);
    } catch (error) {
      setloading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setloadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      //we are going to create a new chat for this user we search for if already exost that will be returned from teh backend
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      setloading(false);
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={"center"}
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily={"Work sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name || "guest"}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* SideDrawer when we will search button */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
            <DrawerBody>
              <Box display={"flex"} pb={2}>
                <Input
                  placeholder="search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default SideDrawer;
