interface TimerVisualProps {
  toggleIsRunning: () => void;
  time: number;
}

function TimerVisual(props: TimerVisualProps) {
  return (
    <>
      <div className="rounded-full w-20 h-20 bg-amber-400 justify-center flex items-center">
        <div
          className="bg-white rounded-full w-14 h-14 flex items-center justify-center"
          onClick={() => props.toggleIsRunning()}
        >
          <div className="text-center">{props.time}</div>
        </div>
      </div>
    </>
  );
}

export { TimerVisual };
