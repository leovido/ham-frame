import { getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";
import { zdk } from '../../zora'
import { MintsQueryArgs, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";

export async function POST(req: NextRequest) {

  const body = await req.json();

  const frameMessage = await getFrameMessage(body, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (!frameMessage.inputText) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <title>Raffle</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeihod7ajntqhyibybkgnrlmgifhcjar45ra3ct4jimfmaokpokz5zu&w=1080&q=75" />
              <meta property="fc:frame:button:1" content="Try again" />
              <meta property="fc:frame:button:1:action" content="post_redirect" />
              <meta property="fc:frame:post_url" content="${process.env.BASE_URL}/api/end" />
          </head>
      </html>
    `);
  }

  const formattedDateString = frameMessage.inputText.split('/').reverse().join('-');
  // Create a date object
  const date = new Date(formattedDateString);
  // Convert the date object to an epoch timestamp (in milliseconds)
  const epoch = date.getTime();
  // If you need the epoch time in seconds, divide by 1000
  const epochInSeconds = epoch / 1000;

  const args: MintsQueryArgs = {
    where: {
      tokens: [
        {
          address: "0xad1b11ad7943cc2f68e71d7b6616043409e79b34",
          tokenId: "15"
        }
      ]
    },
    networks: [
      {
        network: ZDKNetwork.Zora,
        chain: ZDKChain.ZoraMainnet
      }
    ],
    filter: {
      timeFilter: {
        endDatetime: epochInSeconds
      }
    },
    pagination: {
      limit: 200
    },
    includeFullDetails: false
  }

  const response = await zdk.mints(args)

  const imageURLTrimmed = response.mints.nodes.map((node) => {
    return node.token?.image?.url?.replace("ipfs://", "") ?? ""
  })

  const addresses = response.mints.nodes.map((node) => {

    return node.mint.toAddress
  });
  var winner = addresses[Math.floor(Math.random() * addresses.length)];

  console.warn(winner, 'winner here')

  try {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <title>Raffle</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2F${imageURLTrimmed[0]}&w=1920&q=75" />
              <meta property="fc:frame:button:1" content="${winner}" />
              <meta property="fc:frame:button:1:action" content="post_redirect" />
              <meta property="fc:frame:post_url" content="${process.env.BASE_URL}/api/end" />
          </head>
      </html>
    `);
  } catch (e) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <title>Ham widget - iOS opt-in</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2F${imageURLTrimmed}&w=1920&q=75" />
              <meta property="fc:frame:button:1" content="Visit dividoge.com" />
              <meta property="fc:frame:button:1:action" content="post_redirect" />
              <meta property="fc:frame:button:2" content="Share in /lp" />
              <meta property="fc:frame:button:2:action" content="post_redirect" />
              <meta property="fc:frame:post_url" content="${process.env.BASE_URL}/api/end" />
          </head>
      </html>
      `);
  }
}