import React, { useRef, useState, useEffect, useContext } from 'react';
import { PodcastShowPlaylistStyled } from "../Knowledge.desktop";
import PodcastCard from "./PodcastCard";
import { KnowledgeContext } from "../Knowledge";
import PodcastShowPlayllistHeader from './PodcastShowPlaylistHeader';
import { podcastsData, podcastsType, podcastsArrangeData } from "../Knowledge.data";
import PodcastShowPlaylistCard from './PodcastShowPlaylistCard';
import { ANIMATIONS } from "../utils/animationConstants";
import { Icon } from '../../../assets/icon';
const PodcastShowPlaylist = () => {
  const { FADE_IN } = ANIMATIONS;
  const {
    setIsPodcastPlaylistDisplay,
    setIsPodcastShowPlaylistDisplay,
    podcastPlaylistShowData,
  } = useContext(KnowledgeContext);
  const handleCloseClick = () => {
    setIsPodcastShowPlaylistDisplay(false);
    setIsPodcastPlaylistDisplay(true);
  }
  return (
    <PodcastShowPlaylistStyled className={`${FADE_IN}`}>
      <div className="closeIcon" onClick={handleCloseClick}>
        <Icon.x></Icon.x>
      </div>
      <PodcastShowPlayllistHeader
        podcastPlaylistShowData={podcastPlaylistShowData}
      >
      </PodcastShowPlayllistHeader>
      <PodcastShowPlaylistCard
        title="hehe"
        episodes={podcastsData}
      ></PodcastShowPlaylistCard>
    </PodcastShowPlaylistStyled>
  )
}

export default PodcastShowPlaylist; 