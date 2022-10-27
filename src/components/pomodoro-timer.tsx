
import { configure } from "@testing-library/react";
import React, { useEffect, useState, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { secondsToTime } from "../utils/seconds-to-time";
import { Button } from "./button";
import { Timer } from "./timer";
const bellStart = require('../sounds/src_sounds_bell-start.mp3');
const bellFinish = require('../sounds/src_sounds_bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [restTime, setRestTime] = useState(0);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(new Array(props.cycles - 1).fill(true));
  const[completedCycles, setCompletedCycles] = useState(0);
  const[fullWorkingTime, setFullWorkingTime] = useState(0);
  const[numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(() => {
    setMainTime(mainTime - 1);
    if(working) setFullWorkingTime(fullWorkingTime + 1);

  }, timeCounting ? 1000 : null);

  const configureWork = useCallback(() => {
    let inputPomodoroTime = Number((document.querySelector('.changePomodoroTime') as HTMLInputElement).value);
    let inputRestTime = Number((document.querySelector('.changeRestTime') as HTMLInputElement).value);
    if(!inputPomodoroTime || inputPomodoroTime < 0) inputPomodoroTime = 25;
    if(!inputRestTime || inputRestTime < 0) inputRestTime = 5;
    setRestTime(inputRestTime * 60);

    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(inputPomodoroTime * 60);
    audioStartWorking.play();
  }, [setTimeCounting, setWorking, setResting,setMainTime, setRestTime])

  const configureRest = useCallback((long?: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if(long) {
      setMainTime(restTime * 2);
    } else {
      setMainTime(restTime);
    }

    audioStopWorking.play();
  }, [setTimeCounting, setWorking, setResting, setMainTime, restTime]);

  useEffect(() => {
    if(working) document.body.classList.add('working');
    if(resting) document.body.classList.remove('working');

    if(mainTime > 0) return;

    if(working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if(working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if(resting) configureWork();
  }, [working, resting, mainTime, configureRest, setCyclesQtdManager, configureWork, cyclesQtdManager, numberOfPomodoros, props.cycles,
  completedCycles])

  return (
    <div className="pomodoro">
      <h2>{working ? 'Trabalhe!' : 'Descanse'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button className={!working && !resting ? 'hidden' : ''} text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)}></Button>
      </div>

      <div className="divInputs">
        <div>
          <label htmlFor="qtdTempo">Tempo de Pomodoro: </label>
          <input type="number" name="qtdTempoPomodoro" className="changePomodoroTime" placeholder="25"/> minutos.
        </div>

        <div>
          <label htmlFor="qtdTempo">Tempo de Descanso: </label>
          <input type="number" name="qtdTempoRest" className="changeRestTime" placeholder="5"/> minutos.
        </div>
      </div>


      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Número de Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  )
}
