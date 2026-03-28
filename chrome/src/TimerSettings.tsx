import { useState } from "react";

interface TimerSettingsProps {
  setPeriod: (period: number) => void;
  hide: boolean;
}

function TimerSettings(props: TimerSettingsProps) {
  let [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  function getSeconds() {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  }

  function verifyPositiveNumericInput(input: string) {
    return Number(input) < 0 || Number.isNaN(Number(input)) ? 1 : Number(input);
  }

  return (
    <>
      {!props.hide && (
        <div className="mt-2 grid w-full max-w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            className="w-full min-w-0 rounded border border-slate-300 px-2 py-1"
            value={time.hours}
            placeholder="Hours"
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                hours: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
          <input
            className="w-full min-w-0 rounded border border-slate-300 px-2 py-1"
            value={time.minutes}
            placeholder="Minutes"
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                minutes: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
          <input
            className="w-full min-w-0 rounded border border-slate-300 px-2 py-1"
            value={time.seconds}
            placeholder="Seconds"
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                seconds: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
        </div>
      )}
    </>
  );
}

export { TimerSettings };
