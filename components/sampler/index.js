"use client";
import React, { useState, useEffect } from "react";
import ToolBar from "./components/toolbar";
import TrackList from "./components/track-list";
import PlayHead from "./components/play-head";
import { Provider } from "./hooks/useStore";
import useTimer from "./hooks/useTimer";
import useStyles from "./hooks/useStyles";
import "./sampler.scss";

function Sampler() {
  const baseBPMPerOneSecond = 60;
  const stepsPerBar = 4;
  const beatsPerBar = 2;
  const barsPerSequence = 2;
  const totalSteps = stepsPerBar * barsPerSequence;
  const totalBeats = beatsPerBar * barsPerSequence;

  const [BPM, setBPM] = useState(80);
  const [startTime, setStartTime] = useState(null);
  const [pastLapsedTime, setPastLapse] = useState(0);
  const [currentStepID, setCurrentStep] = useState(null);
  const [getNotesAreaWidthInPixels] = useStyles(totalSteps);

  const notesAreaWidthInPixels = getNotesAreaWidthInPixels(totalSteps);
  const timePerSequence = (baseBPMPerOneSecond / BPM) * 1000 * totalBeats;
  const timePerStep = timePerSequence / totalSteps;
  const isSequencePlaying = startTime !== null;
  const playerTime = useTimer(isSequencePlaying);
  const lapsedTime = isSequencePlaying
    ? Math.max(0, playerTime - startTime)
    : 0;
  const totalLapsedTime = pastLapsedTime + lapsedTime;

  useEffect(() => {
    if (isSequencePlaying) {
      setCurrentStep(Math.floor(totalLapsedTime / timePerStep) % totalSteps);
    } else {
      setCurrentStep(null);
    }
  }, [isSequencePlaying, timePerStep, totalLapsedTime, totalSteps]);

  const toolBarProps = {
    setStartTime,
    setPastLapse,
    setBPM,
    isSequencePlaying,
    startTime,
    BPM,
  };

  const playHeadProps = {
    notesAreaWidthInPixels,
    timePerSequence,
    totalLapsedTime,
  };

  const trackListProps = {
    currentStepID,
  };

  return (
    <Provider>
      <main className="sampler">
        <header className="header">
          <ToolBar {...toolBarProps} />
        </header>
        {/* <Steps count={totalSteps} /> */}
        <div className="content">
          <PlayHead {...playHeadProps} />
          <TrackList {...trackListProps} />
        </div>
      </main>
    </Provider>
  );
}

export default Sampler;
