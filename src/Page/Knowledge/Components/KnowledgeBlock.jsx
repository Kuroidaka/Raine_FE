import React from "react";
import Wisdom from "./Wisdom";
import Tip from "./Tip";
import Community from "./Community";
import PodcastList from "./PodcasList";
import { KnowledgeContext } from "../Knowledge";
import {
  QuoteBlock, PodcastBlock, PodcastBlockTitle, KnowLedgeBlockStyled
} from "../Knowledge.desktop";
import { ANIMATIONS } from "../utils/animationConstants";
import { useContext } from "react";

const KnowLedgeBlock = ({
}) => {
  const { device } = useContext(KnowledgeContext);
  const { FADE_IN } = ANIMATIONS;
  return (
    <KnowLedgeBlockStyled
      className={`${FADE_IN}`}
      device={device}
    >
      <PodcastBlock device={device}>
        <PodcastBlockTitle device={device}>podcast series</PodcastBlockTitle>
        <PodcastList />
      </PodcastBlock>

      <QuoteBlock device={device}>
        <Community device={device} />
        <Wisdom device={device} />
        <Tip device={device} />
      </QuoteBlock>
    </KnowLedgeBlockStyled >
  );
}

export default KnowLedgeBlock;
