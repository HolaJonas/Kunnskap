interface TimerVisualProps {
  toggleIsRunning: () => void;
  time: number;
}

function leadingZero(number: number) {
  return number > 9 ? number : `0${number}`;
}

function convertSecondsToHMS(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
}

function TimerVisual(props: TimerVisualProps) {
  return (
    <>
      <div className="rounded-full w-20 h-20 bg-amber-400 justify-center flex items-center">
        <div
          className="bg-white rounded-full w-14 h-14 flex items-center justify-center"
          onClick={() => props.toggleIsRunning()}
        >
          <div className="text-center">{convertSecondsToHMS(props.time)}</div>
        </div>
      </div>
    </>
  );
}

export { TimerVisual };
