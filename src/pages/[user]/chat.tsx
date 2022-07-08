import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { trpc } from "../../utils/trpc";
import Link from "next/link";
import Pusher from "pusher-js";

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
  // const addMsg = trpc.useMutation(["chat.addMessage"]);

  // WEBSOCKET CODE
  // trpc.useSubscription(["chat.onAddMessage"], {
  //   onNext(data: Message[]) {
  //     console.log("firing subscription");
  //     if (data.length == 0) return;
  //     setMessages(data);
  //   },
  //   onError(err) {
  //     console.log("subscription error", err);
  //   },
  // });

  // PUSHER CODE

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_PUSHER_API_KEY);
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

    pusher.connection.bind("connected", () => {});

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const inputMessageChanged = (event: any) => {
    setInputMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (inputMessage === "") return;
    console.log("sending message");
    const message = {
      id: messages.length,
      user: username as string,
      content: inputMessage as string,
    };

    // push message to api/[pusher]
    await fetch("/api/pusher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then(() => console.log("message sent"))
      .catch((err) =>
        console.log("Message failed sending with the following error: \n", err)
      );

    // WEBSOCKET CODE
    // await addMsg
    //   .mutateAsync(message)
    //   .then((res) => {
    //     console.log("message sent: ", res.id);
    //   })
    //   .catch((err) => {
    //     console.log("error sending message: ", err);
    //   });

    setInputMessage("");
  };

  return (
    <>
      <div className="bg-gray-900 v-screen h-screen text-white flex">
        <div className="chat-sidebar">
          <div className="flex w-full h-auto my-2">
            <Link href="/">
              <img
                className="h-[40px] ml-2 my-2"
                src="/favicon.ico"
                alt="logo"
              />
            </Link>
            <div className="p-0 m-0 ml-3">
              <p className="p-0 m-0">Hello,</p>
              <h1 className="p-0 ml-2 m-0">{username}</h1>
            </div>
          </div>
          <h1 className="pl-3 pt-2 mb-2 border-t-[1px]">Users:</h1>
          {/* <!-- {#if !$q.loading}
			{#each users as user}
				<div className="chat-sidebar-user">{user}</div>
			{/each}
		{/if} --> */}
        </div>
        <div className="chat-message-input flex justify-start">
          <input
            onChange={inputMessageChanged}
            value={inputMessage}
            placeholder="Message..."
            className="mx-auto pl-5 py-[5px] w-[85vw] bg-transparent border-[1px] rounded-xl"
          />
          <button
            onClick={sendMessage}
            className="mr-3 ml-3 border-white default-button"
          >
            Send
          </button>
        </div>
        <div className="flex flex-col w-full h-auto overflow-auto mb-[50px] pb-[20px]">
          {
            messages.map((msg, i) => {
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
            })
            /* <!-- {#if $q.loading}
			<div>Loading...</div>
		{:else}
			{#each messages as msg}
				{#if msg.user === username}
					<div transition:fade className="your-chat-message">{msg.content}</div>
				{:else}
					<div transition:fade className="other-chat-message">{msg.content}</div>
				{/if}
			{/each}
		{/if} --> */
          }

          {/* {#each $messages as msg}
			{#if msg.user === username}
				<div transition:fade className="your-chat-message">{msg.content}</div>
			{:else}
				<div transition:fade className="other-chat-message">{msg.content}</div>
			{/if}
		{/each} */}
        </div>
      </div>
    </>
  );
};

export default Chat;
