import { kv } from "@vercel/kv";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
} from "frames.js/next/server";
import { AddressModel } from "./frames/types";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

type State = {};

const initialState: State = {} as const;

export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody);

  const signedUsers = await kv.dbsize()

  const key = `${frameMessage?.requesterFid}:${frameMessage?.requesterCustodyAddress || ''}`
  const isUserInList = await kv.get(key)

  let frame: React.ReactElement;

  const initialFrame = (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{}}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="flex flex-col justify-center items-center" style={{ backgroundColor: "#01153B", width: "100%", height: "100%", paddingLeft: 16, paddingRight: 16, textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 500 }}>
          <>
            <div tw="flex flex-col">
              <div tw="flex">
                <p className={roboto.className} style={{ color: "#F4D35E", fontSize: 50 }}>{frameMessage ? "Opt-in for ham widget (iOS only)" : "Ham widget eligibility 🍖"}</p>
              </div>
              <div tw="flex">
                <p style={{ color: "#F4D35E", fontSize: 50 }}>{frameMessage ? `${95 - signedUsers} slots left!` : ""}</p>
              </div>
            </div>
          </>
        </div>
      </FrameImage>
      <FrameButton>{frameMessage ? "Next" : "Check"}</FrameButton>
    </FrameContainer >
  );

  const allowlistFrame = (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{}}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="flex flex-col" style={{ backgroundColor: "#01153B", width: "100%", height: "100%", paddingLeft: 16, paddingRight: 16, textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 500 }}>
          <>
            <div tw="flex flex-col">
              <div tw="flex">
                <p style={{ color: "#F4D35E", fontSize: 50, textAlign: "center" }}>
                  {`Address added to allowlist.`}
                </p>
              </div>
              <div tw="flex">
                <p style={{ color: "#F4D35E", fontSize: 50, textAlign: "center" }}>
                  {frameMessage?.requesterCustodyAddress}
                </p>
              </div>
            </div>
          </>
        </div>
      </FrameImage>
      <FrameButton>Next</FrameButton>
    </FrameContainer>
  );

  if (frameMessage) {
    const { requesterFid, requesterCustodyAddress } = frameMessage;

    const uniqueId = `${requesterFid}`;

    const existingRequest =
      await kv.get<AddressModel>(uniqueId);

    if (existingRequest) {
      frame = allowlistFrame
    } else {
      await kv.set<AddressModel>(
        uniqueId,
        {
          address: requesterCustodyAddress,
          timestamp: new Date().getTime(),
        },
        { ex: 60 }
      );

      frame = initialFrame;
    }
  } else {
    if (isUserInList) {
      frame = allowlistFrame
    } else {
      frame = initialFrame;
    }
  }

  return (
    <div>
      {frame}
    </div>
  );
}
