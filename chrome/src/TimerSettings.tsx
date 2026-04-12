import { useEffect, useState } from "react";

interface TimerSettingsProps {
  setPeriod: (period: number) => void;
  periodSeconds: number;
}

function splitSeconds(totalSeconds: number) {
  const safeTotal = Math.max(Math.floor(totalSeconds), 0);
  const hours = Math.floor(safeTotal / 3600);
  const minutes = Math.floor((safeTotal % 3600) / 60);
  const seconds = safeTotal % 60;
  return { hours, minutes, seconds };
}

function TimerSettings(props: TimerSettingsProps) {
  let [time, setTime] = useState(() => splitSeconds(props.periodSeconds));

  useEffect(() => {
    setTime(splitSeconds(props.periodSeconds));
  }, [props.periodSeconds]);

  function getSeconds() {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  }

  function verifyPositiveNumericInput(input: string) {
    const value = Number(input);
    return value < 0 || Number.isNaN(value) ? 0 : Math.floor(value);
  }

  return (
    <>
      <div className="grid w-full max-w-full grid-cols-3 gap-2">
        <label className="flex min-w-0 flex-col gap-1 text-left">
          <span className="text-xs text-tropic-green/80">Hours</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="w-full min-w-0 rounded-md border border-tropic-green/25 bg-white px-2 py-1 text-sm text-tropic-green outline-none focus:border-tropic-orange"
            value={time.hours}
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                hours: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-left">
          <span className="text-xs text-tropic-green/80">Minutes</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="w-full min-w-0 rounded-md border border-tropic-green/25 bg-white px-2 py-1 text-sm text-tropic-green outline-none focus:border-tropic-orange"
            value={time.minutes}
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                minutes: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-left">
          <span className="text-xs text-tropic-green/80">Seconds</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="w-full min-w-0 rounded-md border border-tropic-green/25 bg-white px-2 py-1 text-sm text-tropic-green outline-none focus:border-tropic-orange"
            value={time.seconds}
            onBlur={() => props.setPeriod(getSeconds())}
            onChange={(e) =>
              setTime({
                ...time,
                seconds: verifyPositiveNumericInput(e.target.value),
              })
            }
          />
        </label>
      </div>
    </>
  );
}

export { TimerSettings };
