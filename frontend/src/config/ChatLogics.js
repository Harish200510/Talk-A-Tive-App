export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2 || !loggedUser) return "Unknown User";

  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length < 2 || !loggedUser) return "Unknown User";

  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return i === messages.length - 1 && messages[i].sender._id !== userId;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // If next message is from the same sender and not current user → indent
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 33;
  }

  // If next message is from a different sender OR it's the last message → align to avatar
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ) {
    return 0; // ✅ ensures last msg stays near avatar
  }

  // Messages from current user → align to right
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
