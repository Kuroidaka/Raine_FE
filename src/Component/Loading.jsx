import styled from 'styled-components'

const Loading = () => {
  return (
    <Container>
      <div className="a" style={{"--n": 5}}>
        <div className="dot" style={{"--i": 0}}></div>
        <div className="dot" style={{"--i": 1}}></div>
        <div className="dot" style={{"--i": 2}}></div>
        <div className="dot" style={{"--i": 3}}></div>
        <div className="dot" style={{"--i": 4}}></div>
      </div>
    </Container>
  )
}

export default Loading

const Container = styled.div`
width: 100%;
display: flex;
justify-content: center;
align-items: center;
  #btn--yp {
  box-sizing: content-box;
  position: fixed;
  z-index: 9;
  bottom: 1em;
  right: 1em;
  border: solid 1em transparent;
  width: 4.625em;
  height: 3.25em;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/2017/icon-yp.svg) 50%/cover content-box;
  font: 16px/1.25 trebuchet ms, sans-serif;
  text-indent: 200vw;
  text-shadow: none;
  filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0);
  transition: 0.5s;
  white-space: nowrap;
}
#btn--yp:before {
  box-sizing: inherit;
  position: absolute;
  left: 0;
  bottom: 100%;
  margin: 1em -0.5em;
  padding: 0.5em;
  width: 100%;
  border-radius: 5px;
  background: #e8e0e0;
  color: #000;
  text-align: center;
  text-decoration: none;
  text-indent: 0vw;
  white-space: normal;
  animation: float 1s ease-in-out infinite alternate;
  content: attr(data-txt);
}
#btn--yp:hover, #btn--yp:focus {
  outline: none;
  filter: grayscale(0) drop-shadow(0 0 1px crimson);
}

@keyframes float {
  to {
    transform: translateY(0.75em);
  }
}
  color: #ccc;
  text-align: center;


.dot {
  background: #000000;
}
.dot, .dot:after {
  display: inline-block;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  animation: a 1.5s calc(((var(--i) + var(--o, 0))/var(--n) - 1)*1.5s) infinite;
}
.dot:after {
  --o: 1;
  background: currentcolor;
  content: "";
}

@keyframes a {
  0%, 50% {
    transform: scale(0);
  }
}
`