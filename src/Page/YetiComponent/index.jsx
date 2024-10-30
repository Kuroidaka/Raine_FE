// YetiComponent.js

import styled from "styled-components";
import LightSVG from "./LightSVG";
import YetiSVG from "./YetiSVG";

const YetiComponent = () => {
  
  return (
    <Container>
      <YetiSVG />
      <LightSVG />
      <div className="content">
        <h3>Hello?? Is somebody there?!?</h3>
        <p>
          We know it’s scary, but the page you’re trying to reach can’t be found.
          Perhaps it was just a bad <span>link</span> dream?
        </p>
      </div>
  </Container>
  );
};

export default YetiComponent;

const Container = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,900");

  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  background-color: #09334f;
  position: relative;
  width: 100%;
	height: 100%;

  #yetiSVG {
    width: 600px;
    height: 470px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  #lightSVG {
    width: 600px;
    height: 470px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
  }
  .content {
    padding: 5rem 3rem 0 25rem;
    position: relative;
    z-index: 10;
    font-family: "Source Sans Pro", sans-serif;
    color: #fff;
    h3 {
      margin: 0 0 0.8rem;
      font-size: 2.625rem;
      font-weight: 900;
      line-height: 120%;
    }
    p {
      font-size: 1.25rem;
      font-weight: normal;
      line-height: 150%;
      color: #d1e2ed;
      span {
        text-decoration: line-through;
      }
    }
  }
`;
