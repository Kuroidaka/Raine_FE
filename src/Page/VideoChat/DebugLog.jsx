import styled, { css } from "styled-components";
import { transparentPixel } from "./helper";

const DebugLog = (p) => {
  const {
    imagesGridUrl,
    transcription,
    phase,
    displaydebug, setDisplayDebug
  } = p;
  return (
    <DebugContainer displaydebug={displaydebug.toString()}>
      <CloseButton onClick={() => setDisplayDebug(false)}>⛌</CloseButton>
      <div className="debug-content">
        <DebugItem>
          <div>Phase:</div>
          <p>{phase}</p>
        </DebugItem>
        <DebugItem>
          <div>Transcript:</div>
          <p>{transcription || "--"}</p>
        </DebugItem>
        <DebugImg>
          <div>Captures:</div>
          <img alt="Grid" src={imagesGridUrl || transparentPixel} />
        </DebugImg>
      </div>
    </DebugContainer>
  );
};

const DebugContainer = styled.div`
  z-index: 100000;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  padding: 8px;
  border-radius: 0.25rem;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: all 0.2s ease-in-out;
  width: 75vw;

  .debug-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    overflow-y: auto;
    padding: 10px;

    .debug-images {
      height: 100%;
    }
  }

  @media (min-width: 640px) {
    width: 33vw;
  }
  ${(props) =>
    props.displaydebug === "true"
      ? css`
          transform: translateX(0);
        `
      : css`
          transform: translateX(-100%);
        `}
`;
const CloseButton = styled.div`
  position: absolute;
  z-index: 10;
  top: 16px;
  right: 16px;
  opacity: 0.5;
  cursor: pointer;
  color: white;
`;
const DebugItem = styled.div`
  margin-bottom: 2rem;
  div {
    font-weight: 600;
    opacity: 0.5;
  }
  img {
    object-fit: contain;
    width: 100%;
    border: 1px solid #9ca3af;
  }
`;
const DebugImg = styled.div`
  margin-bottom: 2rem;
  height: 100%;

  div {
    font-weight: 600;
    opacity: 0.5;
  }
  img {
    object-fit: contain;
    width: 100%;
    border: 1px solid #9ca3af;
  }
`;

export default DebugLog;
