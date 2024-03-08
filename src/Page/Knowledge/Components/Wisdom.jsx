// React related imports
import React, { useEffect, useState } from "react";

// Component imports
import { WisdomBlockTitle, WisdomBlockContent } from "../Knowledge.desktop";

// Data and utility imports
import { wisdomsData } from "../Knowledge.data";
import random from "../utils/random";
import { ANIMATIONS } from "../utils/animationConstants";

const Wisdom = ({ device }) => {
  const { FADE_IN } = ANIMATIONS;
  const maxWisdom = 13;
  const minWisdom = 0;
  const [wisdom, setWisdom] = useState(wisdomsData[random(maxWisdom, minWisdom)])
  useEffect(() => {
    setWisdom(wisdomsData[random(maxWisdom, minWisdom)]);
  }, []);

  return (
    <>
      <WisdomBlockTitle device={device} className={``}>
        wisdom
      </WisdomBlockTitle>
      <WisdomBlockContent device={device} className={`${FADE_IN}`}>
        <blockquote>
          {wisdom.content}
          <br></br>
          <cite>
            — {wisdom.author}
          </cite>
        </blockquote>
      </WisdomBlockContent>
    </>
  );
}

export default Wisdom;
