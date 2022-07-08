import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Pusher from "pusher-js";
import { AiOutlineDoubleRight } from "react-icons/ai";

interface Message {
  id: number;
  user?: string;
  content?: string;
}

const Chat = () => {
  const { query } = useRouter();
  const username = query.user ? query.user : "INVALID USER";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [users, setUsers] = useState<string[]>([]);

  const sendMessage = async () => {
    if (inputMessage === "") return;
    const message = {
      id: messages.length,
      user: username as string,
      content: inputMessage as string,
    };

    // push message to api/[pusher]
    await fetch("/api/pusher/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }).catch((err) =>
      console.log("Message failed sending with the following error: \n", err)
    );

    setInputMessage("");
  };

  // send message on enter key pressed
  const handleEnterKey = async (e: any) => {
    if (e.key === "Enter") {
      await sendMessage();
    }
  };

  useEffect(() => {
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_API_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    var channel = pusher.subscribe("chat");

    channel.bind("message-update-event", (data: any) => {
      setMessages((prevState) => [
        ...prevState,
        { id: data.id, user: data.user, content: data.content },
      ]);
    });

    channel.bind("user-remove-update-event", (data: any) => {
      setUsers((prevState) => [...prevState.filter((u) => u !== data.user)]);
    });

    return () => {
      fetch("/api/pusher/removeuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: username }),
      }).catch((err) =>
        console.log("Message failed sending with the following error: \n", err)
      );
      pusher.unsubscribe("chat");
    };
  }, []);

  useEffect(() => {
    // set users to match any new users that have sent a message
    // THIS IS A WORKARAOUND FOR NOT HAVING DATABASE STORAGE FOR USERS
    // THE EFFECT WILL BE THAT CLIENTS ARE INFORMED OF NEW USERS WHEN
    // A NEW USER SENDS A MESSAGE
    function onlyUnique(value: string, index: number, self: string[]) {
      return self.indexOf(value) === index;
    }
    const newMessages = messages
      .map((x) => x.user as string)
      .filter(onlyUnique);
    setUsers(newMessages);
  }, [messages]);

  const inputMessageChanged = (event: any) => {
    setInputMessage(event.target.value);
  };

  return (
    <>
      <video
        autoPlay
        muted
        loop
        className="fixed bottom-0 bg-black opacity-[0.1] w-min-[100%] h-min-[100%] scale-[280%]  z-[1]"
        src="/bg.mp4"
      />
      <div className="bg-gray-900 v-screen h-screen text-white flex">
        <div className="chat-sidebar shadow-md shadow-teal-500 border-r-[1px] border-r-teal-900 z-[2]">
          <div className="bg-neutral-800 flex justify-left px-3 h-auto py-2">
            <Link href="/">
              <img
                className="h-[40px] my-2 invert"
                src="/llama.png"
                alt="logo"
              />
            </Link>
            <div className="p-0 m-0 ml-2 pt-[2px]">
              <p className="p-0 m-0 text-xl">llama chat</p>
              <h1 className="p-0 m-0 text-sm">U | {username}</h1>
            </div>
          </div>
          <h1 className="pl-3 pt-2 mb-2">Users:</h1>
          {users.map((user, i) => (
            <div key={i} className="chat-sidebar-user">
              {user}
            </div>
          ))}
        </div>
        <div className="chat-message-input flex justify-start z-[3]">
          <input
            onChange={inputMessageChanged}
            value={inputMessage}
            placeholder="Message..."
            onKeyDown={handleEnterKey}
            className="mx-auto ml-5 pl-5 placeholder-teal-600 border-neutral-500 py-[5px] w-[100vw] bg-transparent border-[1px] rounded-xl outline-none"
          />
          <button
            onClick={sendMessage}
            className="mr-3 ml-3 bg-neutral-600 border-neutral-500 default-button"
          >
            <AiOutlineDoubleRight className="text-teal-300" />
          </button>
        </div>
        <div className="flex flex-col w-full h-auto overflow-auto mb-[50px] pb-[20px]">
          {messages.map((msg, i) => {
            if (msg.user === username) {
              return (
                <div key={i} className="your-chat-message">
                  {msg.content}
                </div>
              );
            } else {
              return (
                <div key={i} className="other-chat-message">
                  {msg.content}
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default Chat;
