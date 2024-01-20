import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import { useCallState } from "./CallProvider";
import { useSharedState } from "./useSharedState";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { callObject, displayName } = useCallState();
  const { sharedState, setSharedState } = useSharedState({
    initialValues: {
      chatHistory: [],
    },
    broadcast: false,
  });
  const [drawerState, setDrawerState] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const handleNewMessage = useCallback(
    (e) => {
      if (!e?.data?.type) return;
      const participants = callObject.participants();
      const sender = participants[e.fromId].user_name
        ? participants[e.fromId].user_name
        : "Guest";

      setSharedState((values) => {
        return {
          ...values,
          chatHistory: [
            ...values.chatHistory,
            // nanoid - we use it to generate unique ID string
            {
              sender,
              senderID: e.fromId,
              message: e.data.message,
              type: e.data.type,
              id: nanoid(),
            },
          ],
        };
      });

      setHasNewMessages(true);
    },
    [callObject, setSharedState]
  );

  const sendMessage = useCallback(
    (message, type = "text") => {
      if (!callObject) return;

      callObject.sendAppMessage({ message, type }, "*");

      const participants = callObject.participants();
      // Get the sender (local participant) name
      const sender = participants.local.user_name
        ? participants.local.user_name
        : "Guest";
      const senderID = participants.local.user_id;

      // console.log("💬 Sending app message", {
      //   sender,
      //   senderID,
      //   message,
      //   type,
      //   id: nanoid(),
      // });

      // Update shared state chat history
      return setSharedState((values) => ({
        ...values,
        chatHistory: [
          ...values.chatHistory,
          // nanoid - we use it to generate unique ID string
          { sender, senderID, message, type, id: nanoid() },
        ],
      }));
    },
    [callObject, setSharedState]
  );

  useEffect(() => {
    if (!callObject) return;

    console.log(`💬 Chat provider listening for app messages`);

    callObject.on("app-message", handleNewMessage);

    return () => callObject.off("app-message", handleNewMessage);
  }, [callObject, handleNewMessage]);

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        chatHistory: sharedState.chatHistory,
        hasNewMessages,
        setHasNewMessages,
        drawerState,
        setDrawerState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node,
};

export const useChat = () => useContext(ChatContext);
