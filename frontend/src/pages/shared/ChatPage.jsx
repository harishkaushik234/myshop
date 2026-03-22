import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatBox from "../../components/shared/ChatBox";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const ChatPage = () => {
  const { api, auth, socket, clearChatNotificationsForUser } = useAppContext();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    clearChatNotificationsForUser(contact._id);
    setContacts((current) =>
      current.map((entry) =>
        entry._id === contact._id ? { ...entry, unreadCount: 0 } : entry
      )
    );
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await api.get("/chat/contacts");
        setContacts(response.data);
        setSelectedContact((current) => current || null);
      } catch (error) {
        toast.error(t("loadContactsError"));
      }
    };

    loadContacts();
  }, [api]);

  useEffect(() => {
    if (!selectedContact) {
      return;
    }

    const loadConversation = async () => {
      try {
        const response = await api.get(`/chat/${selectedContact._id}`);
        setMessages(response.data);
      } catch (error) {
        toast.error(t("loadMessagesError"));
      }
    };

    loadConversation();
  }, [api, selectedContact]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleIncoming = (incoming) => {
      const senderId = incoming.sender?._id || incoming.sender;
      const receiverId = incoming.receiver?._id || incoming.receiver;
      const contactId =
        senderId === auth.user?._id
          ? receiverId
          : senderId;

      setContacts((current) => {
        const exists = current.some((contact) => contact._id === contactId);
        const next = current.map((contact) => {
          if (contact._id !== contactId) {
            return contact;
          }

          return {
            ...contact,
            unreadCount:
              senderId !== auth.user?._id ? (contact.unreadCount || 0) + 1 : contact.unreadCount || 0
          };
        });

        if (!exists && senderId !== auth.user?._id) {
          next.push({
            _id: contactId,
            name: incoming.sender?.name || "New contact",
            email: "",
            unreadCount: 1
          });
        }

        return next;
      });

      if ([senderId, receiverId].includes(selectedContact?._id)) {
        setMessages((current) => {
          if (current.some((messageItem) => messageItem._id === incoming._id)) {
            return current;
          }

          return [...current, incoming];
        });
      }
    };

    const handleConnectError = () => {
      toast.error(t("liveChatError"));
    };

    socket.on("chat:new", handleIncoming);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("chat:new", handleIncoming);
      socket.off("connect_error", handleConnectError);
    };
  }, [auth.user?._id, socket, selectedContact, t]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim() || !selectedContact) {
      toast.error(t("selectContactMessage"));
      return;
    }

    try {
      const response = await api.post("/chat", {
        receiverId: selectedContact._id,
        message
      });
      setMessages((current) => {
        if (current.some((messageItem) => messageItem._id === response.data._id)) {
          return current;
        }

        return [...current, response.data];
      });
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || t("sendMessageError"));
    }
  };

  return (
    <ChatBox
      contacts={contacts}
      selectedContact={selectedContact}
      onSelectContact={handleSelectContact}
      messages={messages}
      value={message}
      onChange={setMessage}
      onSend={sendMessage}
      currentUserId={auth.user?._id}
    />
  );
};

export default ChatPage;
