import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function ChatLoading() {
  //this is just for that line when we search we will see this
  return (
    <Stack>
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
      <Skeleton height={"45px"} />
    </Stack>
  );
}

export default ChatLoading;
