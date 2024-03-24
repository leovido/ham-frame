// https://degen.tips/api/airdrop2/tip-allowance?fid=203666
import { kv } from "@vercel/kv";
import { MintsQueryArgs, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { zdk } from "../zora";
import Image from 'next/image'

type State = {
  endDate: string;
  winner: string;
};

export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody);

  const initialState = { endDate: "", winner: "" };

  const reducer: FrameReducer<State> = (state, action) => {
    return {
      winner: "",
      endDate: action.postBody?.untrustedData.inputText ?? ""
    };
  };

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  if (frameMessage) {
    const {
      isValid,
      buttonIndex,
      inputText,
      castId,
      requesterFid,
      casterFollowsRequester,
      requesterFollowsCaster,
      likedCast,
      recastedCast,
      requesterVerifiedAddresses,
      requesterUserData,
    } = frameMessage;

    console.log("info: frameMessage is:", frameMessage);
  }

  const initialFrame = (
    <FrameContainer
      postUrl="/degen-tip/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      {frameMessage ?
        <>
          <FrameImage src={imgUrl} aspectRatio="1:1"></FrameImage>
          <FrameInput text={"Your $DEGEN tip"} /></> :
        <FrameImage>
          <div tw="flex flex-col">
            <p>NFT owners raffle</p>
          </div>
          <div tw="flex flex-col">
            <p>Users participate</p>
          </div>
        </FrameImage>
      }
      <FrameInput text="e.g. 02/24/2024 09:00 UTC"></FrameInput>
      <FrameButton>{"Check"}</FrameButton>
    </FrameContainer >
  );

  return (
    <div>
      {initialFrame}
    </div>
  );
}
