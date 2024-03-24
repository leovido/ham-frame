import { getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";
import { MintsQueryArgs, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import { zdk } from "../../zora";

const verifyOwnerOfCollection = async (address: string, tokenId: string) => {
  const args: MintsQueryArgs = {
    where: {
      tokens: [
        {
          address,
          tokenId
        }
      ]
    },
    networks: [
      {
        network: ZDKNetwork.Zora,
        chain: ZDKChain.ZoraMainnet
      }
    ],
    pagination: {
      limit: 1
    },
    includeFullDetails: false
  }

  const response = await zdk.mints(args)

  const ownerAddress = response.mints.nodes.map((value) => {
    return value.mint.originatorAddress
  })
  return ownerAddress[0] ?? ""
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const frameMessage = await getFrameMessage(body, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  const url = body.untrustedData.url
  const parsedUrl = new URL(url);

  const params = new URLSearchParams(parsedUrl.search) || ''

  // Get the values of "address" and "id" parameters
  const address = params.get('address').replace(/"/g, ''); // Removes quotes
  const tokenId = params.get('tokenId').replace(/"/g, ''); // Removes quotes

  const ownerAddress = await verifyOwnerOfCollection(address, tokenId)

  const allAdresses = [frameMessage.requesterCustodyAddress, ...frameMessage.requesterVerifiedAddresses]

  const isOwner = allAdresses.includes(ownerAddress)

  if (isOwner) {
    const args: MintsQueryArgs = {
      where: {
        tokens: [
          {
            address,
            tokenId
          }
        ]
      },
      networks: [
        {
          network: ZDKNetwork.Zora,
          chain: ZDKChain.ZoraMainnet
        }
      ],
      pagination: {
        limit: 1
      },
      includeFullDetails: false
    }

    const response = await zdk.mints(args)

    const imageURLTrimmed = response.mints.nodes.map((node) => {
      return node.token?.image?.url?.replace("ipfs://", "") ?? ""
    })

    const imgUrl = `https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2F${imageURLTrimmed[0]}&w=1920&q=75`

    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <title>Raffle</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${imgUrl}" />
              <meta property="fc:frame:button:1" content="Find winner" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:button:1:target" content="/frames/routeOther" />
          </head>
      </html>
    `);
  } else {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <title>Raffle</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://imgs.search.brave.com/6LkN95g5zVyPNoZrT8MIhoeSFruM5xemAIxNX_kpK1I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzAxL2Ix/L2ZmLzAxYjFmZjU5/MmY5ZjEzZjEzZDg5/ZTE1NDdlNmE5YWYy/LmpwZw" />
              <meta property="fc:frame:button:1" content="Wait..." />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:button:1:target" content="/frames/routeOther" />
          </head>
      </html>
    `);
  }

}
