import { getFrameMessage } from "frames.js";
import { NextRequest } from "next/server";
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const frameMessage = await getFrameMessage(body, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

}