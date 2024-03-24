import { kv } from "@vercel/kv";
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


  const initialFrame = (
    <FrameContainer
      postUrl="/raffle/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="flex flex-col justify-center items-center" style={{ backgroundColor: "#01153B", width: "100%", height: "100%", paddingLeft: 16, paddingRight: 16, textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 500 }}>
          <>
            <div tw="flex flex-col">
              <div tw="flex flex-col justify-center">
                <p style={{ color: "#F4D35E", fontSize: 50 }}>{"The raffle includes users that have minted the selected NFT from a collection."}</p>
                <p style={{ color: "#F4D35E", fontSize: 50 }}>{"The end date is the limit you set as the creator"}</p>
              </div>
            </div>
          </>
        </div>
      </FrameImage>
      <FrameInput text={"Raffle end date, i.e. 25/04/2024"} />
      <FrameButton>{"Raffle me!"}</FrameButton>
    </FrameContainer >
  );

  return (
    <div>
      {initialFrame}
    </div>
  );
}
