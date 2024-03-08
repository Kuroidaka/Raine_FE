// React related imports
import React, { useRef, useState, useEffect, Fragment } from "react";

// Library imports
import 'animate.css';

// Data imports
import { tipsData } from "../Knowledge.data";

// Utility or helper function imports
import { ANIMATIONS } from "../utils/animationConstants";
import random from "../utils/random";
import updateContent from "../utils/updateContent";

// Component imports
import { TipBlock, TipImage, TipParagraph, TipTitle } from "../Knowledge.desktop";


const Tip = ({ device }) => {
  const { BOUNCE_IN, BOUNCE_OUT } = ANIMATIONS;
  const maxTips = 6;
  const minTips = 0;
  const TIP_UPDATE_TIMEOUT = 1000;
  const TIP_ANIMATE_DURATION = 1000;

  const timeoutTipID = useRef(null);
  const timeoutUpdateTipID = useRef(null);
  const tipParagraphRef = useRef(null);

  const [tip, setTip] = useState(tipsData[random(maxTips, minTips)]);
  const [tipClick, setTipClick] = useState(false);
  const [isBounceInAnimated, setBounceInAnimated] = useState(false);
  const [isBounceOutAnimated, setBounceOutAnimated] = useState(false);

  useEffect(() => {
    setBounceInAnimated(false);
    setBounceOutAnimated(false);
    setBounceOutAnimated(true);
    timeoutTipID.current = setTimeout(() => {
      setBounceOutAnimated(false);
      setBounceInAnimated(true);
    }, TIP_ANIMATE_DURATION);

    return () => {
      clearTimeout(timeoutTipID.current);
    };
  }, [tipClick]);

  const handleTipBlockClick = () => {
    setTipClick(!tipClick);
    clearTimeout(timeoutUpdateTipID.current);
    timeoutUpdateTipID.current = setTimeout(() => {
      setTip(updateContent(tip, tipsData, maxTips, minTips));
    }, TIP_UPDATE_TIMEOUT);
  }

  const handleWheel = (e) => {
    tipParagraphRef.current.scrollTop += e.deltaY + e.deltaX;
    console.log(e.deltaY, e.deltaX)
  }

  return (
    <Fragment>
      <TipTitle device={device}>
        tip
      </TipTitle>
      <TipBlock
        device={device}
        className={`
          ${isBounceInAnimated ? BOUNCE_IN : ""}
          ${isBounceOutAnimated ? BOUNCE_OUT : ""}
          floatingImage
        `}
        onClick={handleTipBlockClick}
      >
        <TipParagraph
          device={device}
          ref={tipParagraphRef}
          onWheel={handleWheel}
        >
          <b>{tip.title}</b>
          <p>{tip.content}</p>
        </TipParagraph>
        <TipImage>
          <img src={tip.img} alt="life tips" />
        </TipImage>
      </TipBlock>
    </Fragment>
  );
}

export default Tip;
