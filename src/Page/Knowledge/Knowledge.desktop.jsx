import styled from "styled-components";
import myCursor from '../../assets/cursor/Labrador_Retriever.cur';

export const KnowLedgeStyled = styled.div`
  position: relative;
  width: 100%;
  height: 100%; 
  user-select: none; 
  cursor: default;
`;

export const KnowLedgeBlockStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  ${props => props.device === "desktop" ? `
    width: 100%;
    height: 100%;
    display: grid; 
    grid-template: 3% 90% / 3% 69% 25%;
  ` : `
    display: flex; 
    width: 100%;
    min-height: 100svh; 
    flex-direction: column; 
    padding-left: 5%; 
    padding-right: 5%; 
    padding-bottom: 5%;
    gap: calc((3vw + 3vh)/2);
  `}
`;

export const PodcastBlock = styled.div`
  ${props => props.device === "desktop" ? `
    grid-area: 2/2/3/3; 
    height: 95%; 
  ` : `
    min-width: 93vw;
  `}
`;

export const QuoteBlock = styled.div`
  ${props => props.device === "desktop" ? `
      height: 100%;
      grid-area: 2/3/3/4;
      display: flex;
      flex-direction: column;
  ` : `
      min-height: calc((75vh + 75vw)/2);
      height: auto;
  `}
`;

export const CommunityBlockTitle = styled.h2`
  letter-spacing: calc((.1vw+.1vh)/2);
  font-size: 2.5rem;
  ${props => props.device === "desktop" ? `
       b {
          height: 10%;
          font-size: calc((4vw + 4vh)/2);
          color: black;
        }
   ` : `
   b {
          height: 15%;
          font-size: calc((7vw + 7vh)/2);
          color: black;
        }
  `}
`;

export const CommunityBlockContent = styled.div`
  overflow: hidden;
  color: #404040;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
  background-color: white;
  border-radius: calc((1.5vw + 1.5vh)/2);
  display: flex; 
  flex-direction: column;
  justify-content: center; 
  align-items: start;
  ${props => props.device === "desktop" ? `
      height: 15%;
      blockquote {
      padding: calc((1.3vw + 1.5vh)/2);
      font-size: calc((1.16vw + 1.5vh)/2);
     }
     cite {
       font-size: calc((1.16vw + 1.5vh)/2);
       color: #9b9a9a;
     }
   ` : `
    height: 20%;
    blockquote {
      padding: calc((1.3vw + 1.5vh)/2);
      font-size: calc((1.85vw + 1.85vh)/2);
     }
     cite {
       font-size: calc((1.16vw + 1.5vh)/2);
       color: #9b9a9a;
     }
    `}
  margin-bottom: 4%;
`;

export const TipTitle = styled.h2`
  font-size: 2.5rem;
  letter-spacing: calc((.1vw+.1vh)/2);
  ${props => props.device === "desktop" ? `
    height: 11%;
    b {
    color: black;
    font-size: calc((4vw + 4vh)/2);
    }    
  ` : `
    height: 15%;
    b {
      color: black;
      font-size: calc((7vw + 7vh)/2);
    }
  `}
`;

export const TipBlock = styled.div`
  ${props => props.device === "desktop" ? `
     height: 38.65%;
  ` : `
    height: 30vh; 
  `}
  overflow: hidden;
  display: grid;
  grid-template: 100% / 50% 50%;
  border: 1.5px solid #000;
  border-radius: calc((1.5vw + 1.5vh)/2);
  background-color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  &:hover {

    cursor: ${`url(${myCursor}), auto`};
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  }
`;

export const TipParagraph = styled.div`
  background-color: white;
  grid-area: 1/1/2/2;
  padding: calc((1.3vw + 1.5vh)/2);
  ${props => props.device === "desktop" ? `
  b {
    font-size: calc((1.5vw + 1.5vh)/2);
    color: black;
  }
  p {
    font-size: calc((1.16vw + 2vh)/2);
  }
  cite {
    font-size: calc((1.16vw + 1.5vh)/2);
  }
  ` : `
  b {
    font-size: calc((2vw + 2vh)/2);
    color: black;
  }
  p {
    font-size: calc((2vw + 2vh)/2);
  }
  cite {
    font-size: calc((1.16vw + 1.5vh)/2);
  }
  `}
  
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  overflow: hidden;
  height: 90%;
`;

export const TipImage = styled.div`
  background-color: white;
  img {
    height: 80%;
    width: 80%;
    border-radius: calc((1.5vw + 1.5vh)/2);
    box-shadow: 0 5px 10px rgba(0,0,0,1);
  }
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: 1/2/2/3;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
`;

export const WisdomBlockTitle = styled.h2`
  font-size: 2.5rem;
  letter-spacing: calc((.1vw+.1vh)/2);
  ${props => props.device === "desktop" ? `
    height: 9.5%;
    b {
      color: black;
      font-size: calc((4vw + 4vh)/2);
    }
    ` : `
    height: 15%;
    b {
      color: black;
      font-size: calc((7vw + 7vh)/2);
    }
  `}
`;

export const WisdomBlockContent = styled.div`
  --animate-duration: 2s;
  ${props => props.device === "desktop" ? `
    height: 10%;
    blockquote {
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 25px;
      padding-right: 25px;
      font-size: calc((1.16vw + 1.5vh)/2);
      color: #625d5d;
    }
    cite {
      font-size: calc((1.25vw + 1vh)/2);
      color: #9b9a9a;
    }
    ` : `
    height: 9%;
    blockquote {
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 25px;
      padding-right: 25px;
      font-size: calc((2.5vw + 2.5vh)/2);
      color: #625d5d;
    }
    cite {
      font-size: calc((1.75vw + 1.75vh)/2);
      color: #9b9a9a;
    }
  `}
  margin-bottom: 2%;
`;



export const PodcastBlockTitle = styled.h1`
  --animate-duration: 1s;
  font-size: 4rem;
  letter-spacing: calc((.1vw+.1vh)/2);
  ${props => props.device === "desktop" ? ` 
    height: 9%;
    b{
      color: black;
      font-size: calc((4vw + 4vh)/2);
    }
  ` : `
    min-height: 7vh;
    height: auto;
    margin: 1%;
    b{
      height: 100%;
      display: flex; 
      align-items: center;
      color: black;
      font-size: calc((7vw + 7vh)/2);
    }
  `}
`;

export const StyledPodcastCard = styled.div`
    display: flex;
    width: 48%;
    height: 120px;
    padding: 10px;
    justify-content: space-between;
    background-color: antiquewhite;
    border-radius: 10px;
`;

export const PodcastCardId = styled.p`
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 10%;
`;

export const PodcastCardList = styled.div`
  height: 100%;
  width: 100%;
  gap:10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: calc((2vw + 2vh)/2);
  border: 2px solid #cbcbcb;
  padding: calc((1vw + 1vh)/2);
  overflow-y: hidden;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const PodcastEmptyList = styled.p`
  height: 100%;
  width: 100%;
  border-radius: calc((2vw + 2vh)/2);
  font-size: calc((1.75vw + 1.75vh)/2);
  border: 2px solid #cbcbcb;
  display: flex; 
  justify-content: center; 
  align-items: center;
  font-style: italic;
  font-weight: bold;
`



export const PodcastThumbnails = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: no-wrap;
    width: 20%;
  
    img {
      width: 100%;
      border-radius: 10px;
    }
    svg {
      width: 100%;
      border-radius: 10px;
    }
  &:hover {
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const PodcastTitle = styled.div`
  color: black;
  display: flex;
  justify-content: start;
  align-items: flex-end;
  p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    cursor: ${`url(${myCursor}), auto`}!important;
  }
  width: 100%;
`;

export const PodcastLength = styled.p`
  grid-area: 2/3/3/4;
  font-size: calc((1.25vw + 1.25vh)/2);
  display: flex;
  color: gray;
  justify-content: start;
  align-items: flex-start;
  overflow: hidden;
  &:hover{
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const PodcastOption = styled.div`
  display: flex;

`;

export const PodcastMore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    font-size:  calc((2.25vw + 2.25vh)/2);
    color: black;
    &:hover{
      cursor: ${`url(${myCursor}), auto`}!important;
      color: rgb(30,215,96);
    }
  }
`;

export const PodcastDownload = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    font-size: calc((2.25vw + 2.25vh)/2);
    color: black;
    &:hover{
      cursor: ${`url(${myCursor}), auto`}!important;
    }
  }
`

export const PodcastAdd = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    font-size:  calc((2.25vw + 2.25vh)/2);
    &:hover{
      cursor: ${`url(${myCursor}), auto`}!important;
    }
  }
  .iconLove {
    color: black;
  }
  .iconCheck{
    color: rgb(30,215,96);
  }
`;

export const StyledPodcastCardMore = styled.div`
  --animate-duration: 0.2s;
  position: absolute; 
  right: calc((0.5vw + 0.5vh)/2);
  width: calc((18vw + 18vh)/2);
  height: calc((22vw + 22vh)/2);
  background-color: rgb(40,40,40);
  z-index: 4;
  display: flex; 
  padding: 0.75%;
  flex-direction: column;
  justify-content: space-around; 
  border-radius: calc((0.5vw + 0.5vh)/2); 
  p{
    color: rgb(234,234,234);
    font-size:  calc((1.25vw + 1.25vh)/2);
  }
  svg{
    color: rgb(234,234,234);
    font-size:  calc((1.75vw + 1.75vh)/2);
  }
  .moreOption{
    height: 25%;
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    border-radius: calc((0.2vw + 0.2vh)/2); 
    padding: 5%;
    transition: all 0.3s ease; 
    &:hover{
      background-color: rgb(62,62,62);
      cursor: ${`url(${myCursor}), auto`}!important;
    }
  }
  .addToPlaylist{
  }
  .addToQueue{
  }
  .download{
  }
  .share{
    border-top: 2px solid rgb(75,75,75);
  }

  .playlistList{
    height: 100%; 
    width: 100%;
    padding: 3%;
    margin-bottom: 2%;
    display:flex; 
    flex-direction: column;
    .playlistListTitle{
      border-bottom: 2px solid rgb(75,75,75);
      height: auto;
      .backToMoreButton{
        height: calc((3vw + 3vh)/2);
        display: flex; 
        align-items: center;
        svg{
          color: rgb(234,234,234);
          font-size: calc((1.5vw + 1.5vh)/2);
          &:hover{
            cursor: ${`url(${myCursor}), auto`}!important;
          }
        }
      }
      .findPlaylistInput{
        height: calc((2.5vw + 2.5vh)/2);
        display: flex; 
        align-items: center;
        background-color: rgb(62,62,62);
        border-radius: calc((0.2vw + 0.2vh)/2); 
        padding-left: 5%;
        svg{
          font-size:  calc((1.5vw + 1.5vh)/2);
          margin-right: 3%;
        }
        input{
          border: none;
          outline: none;
          color: rgb(234,234,234);
          font-size:  calc((1.25vw + 1.25vh)/2);
          height: 100%; 
          width: 100%; 
          background-color: rgb(62,62,62);
        }
      }
      .playlistCreate{
        margin-top : 1%;
        height: calc((3vw + 3vh)/2);
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        border-radius: calc((0.2vw + 0.2vh)/2); 
        padding: 5%;
        transition: all 0.3s ease; 
        &:hover{
          background-color: rgb(62,62,62);
          cursor: ${`url(${myCursor}), auto`}!important;
        }
      }
      .createInput{
        border-radius: calc((0.2vw + 0.2vh)/2); 
        margin-top: 1%;
        height: calc((2.25vw + 2.25vh)/2);
        display: flex; 
        align-items: center;
        justify-content: space-between;
        background-color: rgb(62,62,62);
        input{
          border: none;
          outline: none;
          height: 100%; 
          width: 100%;
          color: rgb(234,234,234);
          font-size:  calc((1.25vw + 1.25vh)/2);
          background-color: rgb(62,62,62);
          padding-left: 3%;
        }
        svg{
          font-size:  calc((1.5vw + 1.5vh)/2);
          margin-right: 3%;
          &:hover{
            cursor: ${`url(${myCursor}), auto`}!important;
          }
        }
      }
    }
    .playlistListContent{
      flex-grow: 1; 
      padding-right: 2%;
      margin-top: 2%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgb(35, 35, 35);
        border-radius: 100px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 100px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      .listName{
        border-radius: calc((0.2vw + 0.2vh)/2); 
        margin-top: 2%;
        padding-left: 7%;
        height: calc((2.75vw + 2.75vh)/2);
        display: flex; 
        align-items: center;
        transition: all 0.3s ease; 
        &:hover{
          cursor: ${`url(${myCursor}), auto`}!important;
       
          background-color: rgb(62,62,62);
        }
      }
    }
  }
`

export const StyledPodcastList = styled.div`  
  display: grid;
  ${props => props.device === "desktop" ? `
    height: 94%;
    width: 88%;
    grid-template: 9% 5.5% auto / 100%;
  ` : `
    height: 60vh;
    width: 96%;
    grid-template: 9% 9% auto / 100%;
  `}
  z-index: 0;
`;

export const PodcastListType = styled.div`
  grid-area: 1/1/2/2;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 100%;
  &:hover {
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const PodcastArrange = styled.div`
  position: relative;
  grid-area: 2/1/3/2;
  display: grid;
  grid-template: 100% / 5% 45% 48% 2%;
`;

export const PodcastArrangeTitleIcon = styled.div`
  grid-area: 1/1/2/2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .iconList {
    ${props => props.device === "desktop" ? `
    font-size: calc((1.5vw + 1.5vh)/2);
   ` : `
     font-size: calc((2vw + 2vh)/2);
   `
  } 
    color: black;
  }
  height: 90%;
  &:hover{
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const PodcastArrangeTitle = styled.p`
  grid-area: 1/2/2/3;  
  display: flex;
  justify-content: flex-start;
  align-items: center;
  ${props => props.device === "desktop" ? `
     font-size: calc((1.2vw + 1.2vh)/2);
   ` : `
     font-size: calc((2vw + 2vh)/2);
   `
  } 
  color: black;
  font-weight: 700;
  &:hover{
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const SortBy = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-area: 1/3/2/4;
  p{
    font-weight: bold;
    color: black;
    ${props => props.device === "desktop" ? `
      font-size: calc((1.25vw + 1.25vh)/2);
    ` : `
      font-size: calc((2vw + 2vh)/2);
   `
  } 
    &:hover {
      cursor: ${`url(${myCursor}), auto`}!important;
    }
  }
`;

export const SortByIcon = styled.div`
  grid-area: 1/4/2/5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95%;
  .iconArrowDown {
    ${props => props.device === "desktop" ? `
      font-size: calc((1.25vw + 1.25vh)/2);
    ` : `
      font-size: calc((2vw + 2vh)/2);
   `}
  }
`;

export const PodcastArrangeList = styled.ul`
  background-color: black;
  position: absolute;
  top: calc((2.6vw + 2.6vh)/2);
  right: 0;
  z-index: 4;
  list-style: none;
  border-radius: calc((1.5vw + 1.5vh)/2);
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;

export const PodcastArrangeListElement = styled.li`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc((1vw + 1.5vh)/2);
  color: white;
  border-radius: calc((1.5vw + 1.5vh)/2);
  &:hover {
    background-color: black;
    color: white;
    cursor: ${`url(${myCursor}), auto`}!important;
  }
  padding-top: calc((1vw + 1vh)/2);
  padding-bottom: calc((1vw + 1vh)/2);
  padding-left: calc((2vw + 2vh)/2);
  padding-right: calc((2vw + 2vh)/2);
`;

export const PodcastListTypeElement = styled.p`
  height: 70%;
  width: auto;
  ${props => props.device === "desktop" ? `
        min-width: 10.5%;
        font-size: calc((1.3vw + 1.3vh)/2);
      ` : `
        min-width: 20%;
        font-size: calc((1.8vw + 1.8vh)/2);
      `
  } 
  border-radius: calc((1.5vw + 1.5vh)/2);
  color: white;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1.1%;
  margin-right: 1.1%;
  transform-origin: center;

  letter-spacing: calc((0.05vw + 0.05vh)/2);
  transition: transform 0.3s ease; 
  &:hover {
    transition: color 0.3s ease;
    color: rgb(4 228 84);
    transform: scale(1.1);
    cursor: ${`url(${myCursor}), auto`}!important;
  }
`;

export const PodcastShareStyled = styled.div`
  --animate-duration: 0.2s;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display:flex;
  justify-content: center;
  align-items: center;
`;

export const PodcastShareBlock = styled.div`
  width: calc((48vw + 48vh)/2);
  height: calc((43vw + 43vh)/2);
  display: grid;
  grid-template: 
    8% auto 5% 11% 11% /
    100%;
  gap: calc((0.5vw + 0.5vh)/2);
  background: linear-gradient(to bottom, rgb(61,61,58), rgb(18,18,18));
  padding: 1% 1.5%;
  border-radius: calc((1.5vw + 1.5vh)/2);
  box-shadow: 10px 10px 20px rgb(61 59 59 / 71%);
`;

export const PodcastShareBlockTitle = styled.div`
  grid-area: 1/1/2/2;
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  color: rgb(255,255,255);

  p {
    font-size: calc((1.5vw + 1.5vh)/2);
    font-weight: bold;

  }

  .shareBlockIcon {
    display: flex; 
    justify-content: center; 
    align-items: center;
    background-color: white; 
    border-radius: 50%;
    padding: 1%;

    .blockIconX {
      font-size: calc((1vw + 1vh)/2);
      transform-origin: center;
      color: black;
    }

    &:hover {
      .blockIconX{
        color: red;
      }
      color: red;
      cursor: ${`url(${myCursor}), auto`}!important;
      transform: scale(1.1);
      transition: all 0.3s ease;
    }
  }
`;

export const PodcastShareBlockContent = styled.div`
  grid-area: 2/1/2/2;
  background: linear-gradient(to bottom, rgb(160,160,152), rgb(82,82,77));
  border-radius: calc((1.5vw + 1.5vh)/2);
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 1);
  display: grid; 
  grid-template: 100% / 50% 50%;
  width: 100%; 
  height: 100%;

  .blockContentImage {
    grid-area: 1/1/2/2;
    display: flex; 
    justify-content: center; 
    align-items: center;

    img {
      width: calc((18vw + 18vh)/2);
      height: calc((18vw + 18vh)/2);
      border-radius: calc((2.5vw + 2.5vh)/2);
      box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  
    }
  }

  .blockContentInfoContainer {
    grid-area: 1/2/2/3;
    display: flex;
    justify-content: center; 
    align-items: center;
    color: black;
    margin-right: 5%;
    color: white; 

    .blockContentInfo {
      width: 100%;
      height: calc((18vw + 18vh)/2);
      
      .contentInfoTitle {
        height: 41%;
        display: flex; 
        align-items: end;
        font-weight: bold;
        overflow: hidden;

        p {
          font-size: calc((2.25vw + 2.25vh)/2);
          white-space: nowrap;
      
          width: max-content; 
        }

        @keyframes slide {
          -100% { transform: translateX(100%);}
          100% { transform: translateX(-100%);}
        }

        .running-text {
          animation: slide 90s linear infinite;
        } 

        &:hover {
          text-decoration: underline;
          cursor: ${`url(${myCursor}), auto`}!important;
        }
      }

      .contentInfoAuthor {
        height: 14.5%;
        font-size: calc((1.5vw + 1.5vh)/2);
/*         color: #000000bf; */
        font-weight: bold;
    
      }

      .contentInfoLength {
        height: 14.5%;
        font-size: calc((1.25vw + 1.25vh)/2);
/*         color: #000000bf; */
        font-weight: bold;
    
      }

      .contentInfoButton {
        height: 30%;
        display: flex; 
        justify-content: end;
        align-items: end; 
        
        p {
          background-color: white; 
          color:  #000000bf;;
          font-weight: bold;
          height: calc((3vw + 3vh)/2);
          width: calc((8.75vw + 8.75vh)/2);
          border-radius: calc((1.1vw + 1.1vh)/2);
          display: flex; ;
          justify-content: center; 
          align-items: center;
          font-size: calc((1vw + 1vh)/2);
          transform-origin: center;
          box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
          
          &:hover {
            transition: all 0.3s ease;
            transform: scale(1.05);
            color: black;
            cursor: ${`url(${myCursor}), auto`}!important;
          }
        }
      }
    }
  }
`;

export const PodcastShareSendto = styled.p`
  grid-area: 3/1/4/2;
  width: 100%; 
  height: 100%;
  color: rgb(163,163,163); 
  font-size: calc((1vw + 1vh)/2);
  font-weight: bold;
  display: flex;
  align-items: flex-end;
`;

export const PodcastShareBlockSocial = styled.div`
  grid-area: 4/1/5/2;
  display: flex; 
  justify-content: flex-start;
  align-items: flex-start;
  
  .blockSocial {
    width: calc((3.15vw + 3.15vh)/2);
    height: calc((3.15vw + 3.15vh)/2);
    margin-right: 1.2%;
    margin-left: 1.2%;
    transform-origin: center;
    
    &:hover{
      cursor: ${`url(${myCursor}), auto`}!important;
      transition: all 0.3s ease;
      transform: scale(1.2);
    }

  }
`;

export const PodcastShareCopyButton = styled.div`
  grid-area: 5/1/6/2;
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background-color: #212121; 
  border-radius: calc((1.5vw + 1.5vh)/2);
  
  p {
    width: 85%; 
    line-height: 100%;
    padding-left: 3%;
    font-size: calc((1.5vw + 1.5vh)/2);
    overflow: hidden; 
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    width: calc((4.5vw + 4.5vh)/2);
    height: calc((2.3vw + 2.3vh)/2);
    font-size: calc((0.75vw + 0.75vh)/2);
    font-weight: bold;
    border-radius: calc((1vw + 1vh)/2);
    border: none;
    background-color: rgb(30,215,96); 
    transition: all 0.1s ease;
    transform-origin: center;
    
    &:hover{
      cursor: ${`url(${myCursor}), auto`}!important;
      transform: scale(1.05);
    }
    margin-right: 1%;
  }
`;

export const PodcastInfoStyled = styled.div`
  --animate-duration: 0.2s;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display:flex;
  justify-content: center;
  align-items: center;
`

export const PodcastInfoBlock = styled.div`
  height: calc((50vw + 50vh)/2);
  width: calc((70vw + 70vh)/2);
  display: grid; 
  grid-template: 35% 65% / 100%;  
  border-radius: calc((1vw + 1vh)/2);
  position: relative;
  .closeButton{
    background-color: white; 
    width: calc((2vw + 2vh)/2);
    height: calc((2vw + 2vh)/2);
    display: flex; 
    justify-content: center; 
    align-items: center;
    position: absolute; 
    top: calc((1.5vw + 1.5vh)/2);
    right: calc((1.5vw + 1.5vh)/2);
    border-radius: 50%;
    transform-origin: center;
    .close{
      font-size: calc((1vw + 1vh)/2);
      color: black;
      transform-origin: center;
    }
    &:hover{
      transform: scale(1.1);
      cursor: ${`url(${myCursor}), auto`}!important; 
      transition: all 0.3s ease;
      .close{
        color: red;
      }
    }
  }
`
export const PodcastInfoBlockTitle = styled.div`
  grid-area: 1/1/2/2;
  display: grid; 
  grid-template: 100%/ 25% 75%;
  padding-bottom: 2%;
  padding-right: 2%;
  background: linear-gradient(to bottom, rgb(160,160,152), rgb(82,82,77));
  border-top-left-radius: calc((1vw + 1vh)/2);
  border-top-right-radius: calc((1vw + 1vh)/2); 
  .infoThumbnail{
    grid-area: 1/1/2/2;
    display: flex; 
    justify-content: center; 
    align-items: end; 
    img{
      width: calc((12.75vw + 12.75vh)/2);
      height: calc((12.75vw + 12.75vh)/2); 
      border-radius: calc((1vw + 1vh)/2);
    }
  }
  .infoTitle{
    grid-area: 1/2/2/3;
    display: flex; 
    flex-direction: column;
    justify-content: end; 
    .title{
    font-size: calc((2vw + 2vh)/2);
    font-weight: bold; 
    color: white;
    }
    .author{
    font-size: calc((1.5vw + 1.5vh)/2);
    color: white;
    font-weight: bold; 
    }
  }
 `
export const PodcastInfoBlockDescription = styled.div`
 grid-area: 2/1/3/2;
 background: linear-gradient(to bottom, rgb(61,61,58), rgb(18,18,18));
 padding-top: 2%;
 padding-bottom: 4%;
 padding-left: 2%;
 padding-right: 2%;
 display: grid; 
 grid-template: 8% 15% 12% 65% / 100%;
 border-bottom-left-radius: calc((1vw + 1vh)/2);
 border-bottom-right-radius: calc((1vw + 1vh)/2);
 
 .dateAndTime {
   grid-area: 1/1/2/2;
   display: flex; 
   
   .date {
     font-size: calc((1.25vw + 1.25vh)/2);
     color: rgb(193,193,193);
   }
   
   .dot {
     color: transparent;
   }
   
   .time {
     font-size: calc((1.25vw + 1.25vh)/2);
     color: rgb(193,193,193);
   }
   
 
 }
 
 .descriptionButton {
   grid-area: 2/1/3/2;
   display: flex; 
   align-items: center;
   
   .playButton {
     width: calc((4vw + 4vh)/2);
     height: calc((4vw + 4vh)/2); 
     padding-left: calc((0.25vw + 0.25vh)/2);
     background-color: white; 
     display: flex; 
     justify-content: center; 
     align-items: center; 
     border-radius: 50%;
     transform-origin: center;
     margin-right: calc((1.25vw + 1.25vh)/2);
     
     .play {
       font-size: calc((3vw + 3vh)/2);
       color: black;
     }

     .pause{
       font-size: calc((3vw + 3vh)/2);
       color: black;
     }
     
     &:hover {
       cursor: ${`url(${myCursor}), auto`}!important;
       transform: scale(1.1);
       transition: all 0.3s ease; 
     }
   }
   
   .downloadButton {
     width: calc((2vw + 2vh)/2);
     height: calc((2vw + 2vh)/2);
     border: 2.5px solid rgb(167,167,167);
     border-radius: 50%;
     display: flex; 
     justify-content: center; 
     align-items: center;
     transform-origin: center;
     margin-right: calc((1.25vw + 1.25vh)/2);
     
     .download {
       font-size: calc((1vw + 1vh)/2);
       color: rgb(167,167,167);
     }
     
     &:hover {
       transition: all 0.3s ease;     
       cursor: ${`url(${myCursor}), auto`}!important;
       transform: scale(1.1);
       border-color: white;
       .download{
        color: white;
       }
     }
   }

   .loveButton{
    width: calc((2vw + 2vh)/2);
    height: calc((2vw + 2vh)/2);
    border: 2.5px solid rgb(167,167,167);
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    transform-origin: center;
  
    .love{
      font-size: calc((1.25vw + 1.25vh)/2);
      color: rgb(167,167,167);
    }

    .unLove{
      font-size: calc((1.25vw + 1.25vh)/2);
      color: rgb(30,215,96);
    }

    &:hover{
      transition: all 0.3s ease;     
      cursor: ${`url(${myCursor}), auto`}!important;
      transform: scale(1.1);
      border-color: white;
      .love{
        color: white;
      }
      .unLove{
        color: rgb(30,215,96);
      }
    }
   }
 }
 .descriptionTitle{
  grid-area: 3/1/4/2;
  display: flex; 
  align-items: end; 
  margin-bottom: calc((1vw + 1vh)/2);
  p{
    color: white; 
    font-size: calc((1.25vw + 1.25vh)/2);
    font-weight: bold;
    border-bottom: 3px solid rgb(30,215,96);

  }
 }
 .descriptionContent{
  grid-area: 4/1/5/2;
  padding-left: 1%;
  padding-right: 2%;
  white-space: normal;
  p{
    width: 100%; 
    text-align: justify;
    color: rgb(174,174,174);
    font-size: calc((1.3vw + 1.3vh)/2);

    line-height: calc((2.25vw + 2.25vh)/2);
    white-space: normal;
  }
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgb(35, 35, 35);
    border-radius: 100px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 100px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
 }
`
export const StyledPodcastPlaylist = styled.div`
 --animate-duration: 0.8s;
 position: absolute; 
 top: 0; 
 left: 0; 
 width: 100%; 
 min-height: 100%;
 height: auto;
 padding-left: 2%;
 padding-right: 2%;
 padding-top: 1%; 
 padding-bottom: 1%;
 z-index: 6; 
 background-color: white ;
 user-select: none; 
`
export const PodcastPlaylistBackButton = styled.div`
 width: 100%;
 height: calc((4vw + 4vh)/2); 
 display: flex; 
 flex-direction: row;
 align-items: center;
 transform-origin: center;
 transition: all 0.3s ease;
 svg{
  color: gray;
  font-size: calc((2vw + 2vh)/2);
 }
 p{
  color: gray;
  font-size: calc((1.5vw + 1.5vh)/2);
 }
 &:hover{
  transform: scale(1.005);
  svg{
    color: black;
  }
  p{
    color: black;
  }
  cursor: ${`url(${myCursor}), auto`}!important;
 }
`
export const PodcastPlaylistTitle = styled.div`
 height: calc((6vw + 6vh)/2);
 display: flex; 
 align-items: center;
 justify-content: space-between; 
 .playListTitle{
   display: flex; 
   p{
    font-size: calc((3vw + 3vh)/2);
    color: black;
    font-weight: bold; 
   }
   .titleIcon{
   display: flex; 
    align-items: center;
    svg{
      font-size: calc((3vw + 3vh)/2);
      color: black;
    }
   }
 }
   .titleSearch{
    width: 15%;  
   height: 50%; 
   border: 2px solid grey; 
   border-radius: calc((3vw + 3vh)/2);
   display: flex; 
   align-items: center;
   justify-content: end; 
  .titleSearchIcon{
    width: 15%; 
    height: 100%;  
    display: flex; 
    justify-content: center; 
    align-items: center; 
    svg{ 
      font-size: calc((1.25vw + 1.25vh)/2);
     }
  }
  input{
    height: 100%;
    width: 85%;
    outline: none; 
    border: none; 
    height: 100%;
    border-top-right-radius: calc((3vw + 3vh)/2);
    border-bottom-right-radius: calc((3vw + 3vh)/2);
    font-size: calc((1.25vw + 1.25vh)/2); 
  }
 }
`
export const PodcastPlaylistType = styled.div`
  height: calc((7vw + 7vh)/2);
  display: flex; 
  flex-direction: row;
  align-items: center;
  padding-left: 2%; 
  color: black;
  font-weight: bold;
  p{
      font-size: calc((2vw + 2vh)/2);
    }
  .listTypeIcon{
    display: flex; 
    align-items: start;
    margin-right: 0.5%;
    margin-left: 0.5%;
    svg{
    font-size: calc((2vw + 2vh)/2);
    }
    .addPlaylistIcon{
      &:hover{
        cursor: ${`url(${myCursor}), auto`}!important;
        color: gray;
      }
    }
  }
`

export const PodcastPlayListContent = styled.div`
  display: flex;
  gap: calc((2vw + 2vh)/2);
  flex-wrap: wrap;
  overflow: hidden;
  width: 93vw; 
  padding-left: 1%;
  margin: 0;
`
export const PodcastPlaylistBlockStyled = styled.div`
  width: calc((21vw + 21vh)/2); 
  height: calc((30vw + 30vh)/2); 
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: calc((1vw + 1vh)/2);
  background-color:  rgb(235, 235, 235);
  display: flex;
  flex-direction: column;
  align-items: center;
  .playListBlockImage{
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc((21vw + 21vh)/2); 
    height: calc((21vw + 21vh)/2); 
    .playListBlockImageBlock{
      position: relative;
      box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
      border-radius: calc((1vw + 1vh)/2);
      background-size: cover;
      width: calc((18vw + 18vh)/2); 
      height: calc((18vw + 18vh)/2); 
      .playListBlockImageShowButton{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0; 
        left: 0; 
        border-radius: calc((1vw + 1vh)/2);
        width: calc((18vw + 18vh)/2); 
        height: calc((18vw + 18vh)/2); 
        transition: all 0.5s ease;
        .button{
          --animate-duration: 0.25s;
          box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
          border-radius: calc((3vw + 3vh)/2);
          margin: 3%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          color: #6e6e6e;
          border-radius: calc((2vw + 2vh)/2);
          font-size: calc((1.1vw + 1.1vh)/2);
          font-weight: bold;
          width: calc((10vw + 10vh)/2); 
          height: calc((3vw + 3vh)/2); 
          transition: all 0.3s ease;
          &:hover{
            box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
          }
        }
        .showButton{
          &:hover{
            color: black;
          }
        }
        .deleteButton{
          &:hover{
            color: red;
          }
        }
      }
    }
  }
  .playListBlockInfo{
    height: calc(calc((30vw + 30vh)/2) - calc((21vw + 21vh)/2)); 
    width: calc((18vw + 18vh)/2); 
    .infoTitle{
      height: calc((calc((30vw + 30vh)/2) - calc((21vw + 21vh)/2)) * 0.2);
      margin-bottom: 1%;
      display: flex;
      align-items: center;
      p{
        font-size: calc((1.5vw + 1.5vh)/2); 
        color: black;
      }
      .titleName{
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: bold;
        font-size: calc((1.5vw + 1.5vh)/2); 
      }
      .titleInputBlock{
        width: 70%;
        display: flex;
        flex-direction: row;
        input{
          width: 70%;
          outline: none;
          border: none;
          background-color: rgb(235, 235, 235);
          font-size: calc((1.5vw + 1.5vh)/2); 
          font-weight: bold;
        }
        p{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30%;
          font-size: calc((1vw + 1vh)/2); 
        }
      }
      .titleNumberPodcast{
        display: flex;
        align-items: center;
        justify-content: end;
        width: 30%; 
        font-size: calc((0.9vw + 0.9vh)/2); 
      }
    }
    .infoDescription{
      height: 60%;
      display: flex;
      align-items: center;
      p{
        color: black;
        max-height: 100%; 
        font-size: calc((1vw + 1vh)/2); 
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; 
        -webkit-box-orient: vertical;
      }
    }
  }
  &:hover{
    cursor: ${`url(${myCursor}), auto`}!important;
    background-color: rgb(210, 210, 210);
    .playListBlockImage .playListBlockImageBlock .playListBlockImageShowButton{
      background-color: rgba(0, 0, 0, 0.5);
    }
    .playListBlockInfo .titleInputBlock input{
      background-color: rgb(210, 210, 210);
    }
  }
`

export const PodcastShowPlaylistStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: white;
  z-index: 7;  
  .closeIcon{
    z-index: 8;
    position: absolute;
    top: 1%;
    right: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: calc((2.5vw + 2.5vh)/2); 
    height: calc((2.5vw + 2.5vh)/2); 
    border-radius: 50%;
    &:hover{
      cursor: pointer;
      svg{
        color: red;
      }
    }
  }
`
export const PodcastShowPlayllistHeaderStyled = styled.div`
    width: 100%;
    height: 40vh;
    background: linear-gradient(to bottom, rgb(160,160,152), rgb(82,82,77));
    display: flex;
    margin-bottom: 1%;
    padding-bottom: 2%;
    .headerImage{
      width: 25%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      img{
        width: calc((22vw + 22vh)/2); 
        height: calc((22vw + 22vh)/2); 
      }
    }
    .headerInfo{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 70%;
      p{
        font-size:  calc((1.5vw + 1.5vh)/2); 
        color: white;
      }
      .child2{
        font-size: calc((8vw + 8vh)/2); 
        font-weight: bold;
      }
      .child3{
        font-size:  calc((1.25vw + 1.25vh)/2); 
      }
    }
`