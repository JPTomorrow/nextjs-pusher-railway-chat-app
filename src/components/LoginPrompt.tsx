import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { router } from "@trpc/server";

const LoginPrompt = () => {
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
    <div className="w-[40%] h-auto bg-gray-50 rounded-2xl flex flex-col">
      <h1 className="text-xl text-center mt-5">Fireside Chat</h1>
      <h1 className="text-xl text-center mt-5">LOGIN</h1>
      <input
        value={guestName}
        onChange={changeGuestName}
        className="w-[90%] mx-auto border-gray-800 border-[1px] rounded-md pl-2 mt-5"
        placeholder="Guest Name"
      />
      {showNameError ? (
        <p className="text-red-700 mx-auto mt-3">
          Please enter a valid guest name
        </p>
      ) : null}
      <button onClick={goToChat} className="mx-auto my-5 default-button">
        Submit
      </button>
    </div>
  );
};

export default LoginPrompt;
