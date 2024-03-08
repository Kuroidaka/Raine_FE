// React related imports
import React from "react";
import { useState } from "react";

// Component imports
import {
  StyledPodcastCard,
  PodcastCardId,
  PodcastThumbnails,
  PodcastTitle,
  PodcastLength,
  PodcastOption,
  PodcastDownload,
  PodcastAdd,
  PodcastMore,
} from "../Knowledge.desktop";
import PodcastCardMore from "./PodcastCardMore";

// Asset imports
import { Icon } from "../../../assets/icon";
import { ANIMATIONS } from "../utils/animationConstants";
import Tippy from "@tippyjs/react/headless";
import styled from "styled-components";

const PodcastCard = ({
  id,
  order,
  title,
  author,
  thumbnail,
  length,
  url,
  description,
  date,
  downloadUrl,
  cardId,
  playlist,
  setCardId,
  isHoverId,
  setIsHoverId,
  isPlayingId,
  setIsPlayingId,
  podcastsDataFilter,
  setPodcastsDataFilter,
  setIsFavourite,
  podcastStatus,
  setPodcastStatus,
  setIsPodcastShareDisplay,
  setPodcastShare,
  setIsPodcastInfoDisplay,
  setPodcastInfo,
  isPodcastMoreDisplay,
  setIsPodcastMoreDisplay,
  isDisplayAddPlaylist,
  setIsDisplayAddPlaylist,
  podcastCardAnimation,
  device,
  setIsPodcastListScroll,
}) => {
  const { FADE_IN } = ANIMATIONS;
  const [cardPosition, setCardPosition] = useState(null);
  const [showCardMore, setShowCardMore] = useState(false);
  const [isDisplayCreatePlaylist, setIsDisplayCreatePlaylist] = useState(null);
  // Event Handlers
  const handleMouseEnter = () => setIsHoverId(id);
  const handleMouseLeave = () => setIsHoverId(-1);
  const handleClick = () => setCardId(id);
  const handlePlaying = () => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
    setIsPlayingId(prev => ({
      isPlaying: prev.id !== id || !prev.isPlaying,
      id,
    }));
    console.log(device)
  }

  const handleAddClick = id => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
    const updatedData = [...podcastsDataFilter];
    const podcastToUpdate = updatedData.find(podcast => podcast.id === id);
    if (podcastToUpdate) {
      podcastToUpdate.type = [...podcastToUpdate.type, "Yêu thích"];
    }
    setPodcastsDataFilter(updatedData);
    setPodcastStatus({
      ...podcastStatus,
      [id]: { isFavourite: false, isAdded: false },
    });
    setIsFavourite({ id: id, isFavourite: false });
  };

  const handleRemoveClick = id => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
    const updatedData = [...podcastsDataFilter];
    const podcastToUpdate = updatedData.find(podcast => podcast.id === id);
    if (podcastToUpdate) {
      podcastToUpdate.type = podcastToUpdate.type.filter(type => type !== "Yêu thích");
    }
    setPodcastsDataFilter(updatedData);
    setPodcastStatus({
      ...podcastStatus,
      [id]: { isFavourite: true, isAdded: true },
    });
  };

  const handleDownloadClick = () => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
    window.open(downloadUrl);
  }

  const currentStatus = podcastStatus[id] || { isFavourite: true, isAdded: true };

  const handleInfoClick = (id, title, author, length, thumbnail, description, date, downloadUrl) => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
    setIsPodcastInfoDisplay(true);
    setPodcastInfo({ id, title, author, length, thumbnail, description, date, downloadUrl });
  };

  const handlePodcastMoreDisplay = () => {
    setIsPodcastMoreDisplay(prev => ({
      isDisplay: false,
      id
    }));
  }

  const handleMoreClick = (event) => {
    const element = event.currentTarget;
    const cardRect = element.getBoundingClientRect();
    const distanceFromBottomOfViewport = window.innerHeight - cardRect.bottom;
    const temp = distanceFromBottomOfViewport - window.innerHeight * 0.2;

    setCardPosition(temp >= window.innerHeight * 0.2 ? -(window.innerHeight * 0.03 + window.innerWidth * 0.03) : (window.innerHeight * 0.108 + window.innerWidth * 0.108));

    setIsPodcastMoreDisplay(prev => ({
      isDisplay: prev.id !== id || !prev.isDisplay,
      id
    }));
    setIsDisplayCreatePlaylist(false);
    setIsDisplayAddPlaylist(true);
    setPodcastInfo({ id, title, author, length, thumbnail, description, date, downloadUrl });
    setShowCardMore(true);
  }


  // Styles
  const cardStyled = isPlayingId.id === id ? { backgroundColor: "black", zIndex: 2 } :
    cardId === id ? { border: "2px solid black", zIndex: 3 } : {}

  const optionIconStyled = isPlayingId.id === id ? { color: "white" } :
    isHoverId === id ? { color: "var(--second-color)" } : {};

  const podcastTitleStyled = isPlayingId.id === id ? { color: "rgb(30,215,96)" } :
    isHoverId === id ? { color: "var(--second-color)" } : {};

  const podcastAuthorStyled = isPlayingId.id === id ? { color: "white" } : {};

  const podcastIdStyled = isPlayingId.id === id ? { color: "rgb(30,215,96)" } :
    isHoverId === id ? { color: "var(--second-color)" } : {};


  return (
    <>
      <StyledPodcastCard
        className={podcastCardAnimation && `${FADE_IN} `}
        tabIndex="0"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyled}
        device={device}
      >
        <PodCastInfor>
          <PodcastCardId style={podcastIdStyled} device={device}>{order}</PodcastCardId>
          <PodcastThumbnails onClick={handlePlaying} device={device}>
            {isPlayingId.id === id ? (
              isHoverId === id ? (
                isPlayingId.isPlaying ? <Icon.pause /> : <Icon.play />
              ) : isPlayingId.isPlaying ? (
                <img src="https://i.gifer.com/Nt6v.gif" alt="playing" />
              ) : (
                <Icon.play />
              )
            ) : isHoverId === id ? (
              <Icon.play />
            ) : (
              <img src={thumbnail} alt="thumbnail" />
            )}
          </PodcastThumbnails>
          <Information> 
            <PodcastTitle device={device} style={podcastTitleStyled} onClick={() => handleInfoClick(id, title, author, length, thumbnail, description, date, downloadUrl)}>
              <p>{title}</p>
            </PodcastTitle>
            <PodcastLength style={podcastAuthorStyled} onClick={() => handleInfoClick(id, title, author, length, thumbnail, description, date, downloadUrl)}>
              {`${author} | ${length}`}
            </PodcastLength>
          </Information> 
        </PodCastInfor>


        <PodcastOption>
          <PodcastDownload onClick={handlePodcastMoreDisplay} >
            <Icon.download style={optionIconStyled} onClick={handleDownloadClick}></Icon.download>
          </PodcastDownload>
          <PodcastAdd onClick={handlePodcastMoreDisplay} >
            {currentStatus.isAdded ? (
              <Icon.love style={optionIconStyled} className="iconLove" onClick={() => handleAddClick(id)} />
            ) : (
              <Icon.checkCircle style={optionIconStyled} className="iconCheck" onClick={() => handleRemoveClick(id)} />
            )}
          </PodcastAdd>
          <Tippy
            onShow={() => setIsPodcastListScroll("hidden")}
            onHide={() => setIsPodcastListScroll("scroll")}
            arrow={false}
            render={() => (
              <PodcastCardMore
                className="PodcastCardMore"
                id={id}
                title={title}
                author={author}
                length={length}
                thumbnail={thumbnail}
                url={url}
                downloadUrl={downloadUrl}
                playlist={playlist}
                cardPosition={cardPosition}
                isPodcastMoreDisplay={isPodcastMoreDisplay}
                setIsPodcastMoreDisplay={setIsPodcastMoreDisplay}
                isDisplayCreatePlaylist={isDisplayCreatePlaylist}
                isDisplayAddPlaylist={isDisplayAddPlaylist}
                setIsDisplayAddPlaylist={setIsDisplayAddPlaylist}
                setIsDisplayCreatePlaylist={setIsDisplayCreatePlaylist}
                setIsPodcastShareDisplay={setIsPodcastShareDisplay}
                setPodcastShare={setPodcastShare}
                podcastsDataFilter={podcastsDataFilter}
                setPodcastsDataFilter={setPodcastsDataFilter}
              />
            )}
            interactive={true}
            visible={isPodcastMoreDisplay.isDisplay && isPodcastMoreDisplay.id === id}
            onClickOutside={() => setIsPodcastMoreDisplay(prev => ({
              isDisplay: false,
              id,
            }))}
            offset={[20, cardPosition]}
          >
            <PodcastMore onClick={(event) => { handleMoreClick(event, id, title, author, length, thumbnail, description, date, downloadUrl) }} >
              <Icon.more style={optionIconStyled} />
            </PodcastMore>
          </Tippy>
        </PodcastOption>
      </StyledPodcastCard >
    </>
  );
};

export default PodcastCard;

const PodCastInfor = styled.div `
  width: 40%;
  display: flex;
  flex: 1;

`

const  Information = styled.div `
  width: 50%;
  flex: 1;
  padding: 10px;
`