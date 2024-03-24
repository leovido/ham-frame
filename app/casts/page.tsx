import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
} from "frames.js/next/server";

type State = {};

export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody);


  const initialFrame = (
    <FrameContainer
      postUrl="/casts/frames"
      pathname="/"
      state={{}}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div>Find a random winner</div>
      </FrameImage>
      <FrameInput text={"Fetch winner"} />
      <FrameButton>{"Run!"}</FrameButton>
    </FrameContainer >
  );

  return (
    <div>
      {initialFrame}
    </div>
  );
}
