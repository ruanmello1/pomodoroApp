import React from "react";
import { secondsToMinutes } from "../utils/seconds-to-minute";

interface Props {
  mainTime: number;
}

export function Timer(props: Props): JSX.Element {
  return  (
    <div className="timer">{secondsToMinutes(props.mainTime)}</div>
  )
}
