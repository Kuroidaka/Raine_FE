import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const AiProgress = (p) => {
  const { progress} = p;
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    if (progress) {
      setLetters(progress.split("")); // Split the text into characters
    }
    else {
      setLetters([])
    }
  }, [progress]);


  return (
    <AiProgressContainer>
      <div className="letter-holder">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="letter"
            style={{ animationDelay: `${0.12 + index * 0.1}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span> // Display spaces correctly
        ))}
      </div>
    </AiProgressContainer>
  );
};

export default AiProgress;

const loadingF = keyframes`
  0% {
    opacity: 0.5;
    color: #ffffff;
  }
  100% {
    opacity: 1;
    color: #878787;
  }
`;

const AiProgressContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 5px;
  text-align: center;
  height: 5%;



  .letter-holder {
    padding: 10px;
    font-weight: 800;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .letter {
    opacity: 0.5;
    color: #ffffff;
    animation-name: ${loadingF};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`;
