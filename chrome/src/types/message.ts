export type Message = {
  type: "timer:start" | "timer:pause" | "timer:reset" | "timer:getState";
  payload?: Record<string, number>;
};
