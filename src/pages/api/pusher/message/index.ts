import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../pusherClient";

interface Message {
  id: number;
  user?: string;
  content?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, user, content } = req.body;
    const response = await pusher.trigger("chat", "message-update-event", {
      id: id,
      user: user,
      content: content,
    } as Message);

    res.status(200).send("Message Sent");
  }
}
