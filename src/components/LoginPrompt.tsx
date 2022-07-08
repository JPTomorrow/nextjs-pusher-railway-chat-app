import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { router } from "@trpc/server";

const LoginPrompt = ({ className }: { className: any }) => {
  const router = useRouter();

  const [guestName, setGuestName] = useState("");
  const [showNameError, setShowNameError] = useState(false);

  const goToChat = () => {
    if (guestName === "") {
      setShowNameError(true);
      return;
    }

    router.push(`/${guestName}/chat`);
  };

  const changeGuestName = (event: any) => {
    setGuestName(event.target.value);
  };

  return (
    <div
      className={[
        className,
        "w-[40%] h-auto  rounded-2xl flex flex-col bg-neutral-700 bg-opacity-40 bg-blur-sm border-[2px] border-teal-200 shadow-xl shadow-teal-600",
      ].join(" ")}
    >
      <img
        className="h-[200px] w-[200px] mx-auto mb-2 mt-5 invert"
        src="/llama.png"
        alt="logo"
      />
      <h1 className="text-5xl text-teal-300 text-center mt-3">
        <b>llama chat</b>
      </h1>
      <h1 className="text-xl text-teal-300 text-center mt-5">LOGIN</h1>
      <input
        value={guestName}
        onChange={changeGuestName}
        className="w-[60%] mx-auto border-teal-300 border-[1px] rounded-md pl-2 mt-5 bg-transparent placeholder-teal-500 text-teal-300 outline-none"
        placeholder="Guest Name"
      />
      {showNameError ? (
        <p className="text-red-700 mx-auto mt-3">
          Please enter a valid guest name
        </p>
      ) : null}
      <button
        onClick={goToChat}
        className="mx-auto my-5 default-button border-teal-300 text-teal-300 hover:bg-teal-500 focus:bg-opacity-30 focus:bg-teal-500"
      >
        Submit
      </button>
    </div>
  );
};

export default LoginPrompt;
