// import { getFrameMessage } from "frames.js";
// import { NextRequest, NextResponse } from "next/server";
// import { kv } from "@vercel/kv";
// import { AddressModel } from "../examples/slow-request/slow-fetch/types";
// import { DEFAULT_DEBUGGER_HUB_URL } from "../debug";

// const MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS = 2 * 60; // 2 minutes

// export async function POST(req: NextRequest) {

//   const body = await req.json();

//   // verify independently
//   const frameMessage = await getFrameMessage(body, {
//     hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
//   });

//   const uniqueId = `${frameMessage.requesterFid}:${frameMessage.requesterCustodyAddress}`;

//   try {
//     const randomNumber = Math.random();

//     await kv.set<AddressModel>(
//       uniqueId,
//       {
//         data: randomNumber,
//         status: "success",
//         timestamp: new Date().getTime(),
//       },
//       { ex: MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS }
//     );

//     return new NextResponse(`
//       <!DOCTYPE html>
//       <html lang="en">
//           <head>
//               <title>Ham widget - iOS opt-in</title>
//               <meta property="fc:frame" content="vNext" />
//               <meta property="fc:frame:image" content="https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeihod7ajntqhyibybkgnrlmgifhcjar45ra3ct4jimfmaokpokz5zu&w=1080&q=75" />
//               <meta property="fc:frame:button:1" content="Visit dividoge.com" />
//               <meta property="fc:frame:button:1:action" content="post_redirect" />
//               <meta property="fc:frame:button:2" content="Share in /lp" />
//               <meta property="fc:frame:button:2:action" content="post_redirect" />
//               <meta property="fc:frame:post_url" content="${process.env.BASE_URL}/api/end" />
//           </head>
//       </html>
//     `);
//   } catch (e) {
//     await kv.set<AddressModel>(
//       uniqueId,
//       {
//         error: String(e),
//         status: "error",
//         timestamp: new Date().getTime(),
//       },
//       { ex: MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS }
//     );
//     // Handle errors
//     return NextResponse.json({ message: e }, { status: 500 });
//   }
// }
export { POST } from "frames.js/next/server";
