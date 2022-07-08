import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../pusherClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user } = req.body;
    const response = await pusher.trigger("chat", "user-remove-update-event", {
      user: user,
    });

    res.status(200).send("User Removed");
  }
}
