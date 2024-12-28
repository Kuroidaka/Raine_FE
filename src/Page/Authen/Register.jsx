import { useState, useRef, Fragment } from "react";
import styled from "styled-components";

import FaceSVG from "./face";
import authenApi from "../../api/authen.api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import OverlayDimLoading from "../../component/OverlayDimLoading";

const Register = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const checkBoxRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dataInput, setDataInput] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDataInput({
      ...dataInput,
      [name]: value,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setTimeout(() => {
      if (!showPassword) {
        passwordRef.current.type = "text";
        // spreadFingers();
      } else {
        passwordRef.current.type = "password";
        // closeFingers();
      }
    }, 100);
  };

  const svgProps = {
    emailRef,
    passwordRef,
    showPassword,
    checkBoxRef,
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(dataInput);
    const { username, password } = dataInput;
    try {
      const res = await authenApi.login(username, password);

      // Extract token from response
      const { token } = res;

      // Save token to localStorage
      if (token) {
        localStorage.setItem("token", token);
        navigate("/planner");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      <StyledForm>
        {loading && <OverlayDimLoading />}

        <div className="svgContainer">
          <div>
            <FaceSVG {...svgProps} />
          </div>
        </div>
        <div className="inputGroup inputGroup1">
          <label htmlFor="loginEmail">Username</label>
          <input
            type="text"
            name="username"
            id="loginEmail"
            ref={emailRef}
            onInput={handleInput}
          />
        </div>
        <div className="inputGroup inputGroup2">
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            name="password"
            id="loginPassword"
            ref={passwordRef}
            onInput={handleInput}
          />
        </div>

        <div className="inputGroup inputGroup3">
          <label htmlFor="loginPassword">Confirm Password</label>
          <input
            type="password"
            name="password"
            id="loginPassword"
            ref={passwordRef}
            onInput={handleInput}
          />
          <div id="showPasswordToggle">
            <label className="checkbox_wrapper" style={{display: 'none' }}>
                <span>Show</span>
                <input
                  type="checkbox"
                  ref={checkBoxRef}
                  id="showPasswordCheck"
                  onChange={handleShowPassword}
                />
              </label>

            <div
              className="backToLogin"
              onClick={() => {
                navigate("/login");
              }}
            >
              <p>Back to Login</p>
            </div>
          </div>
        </div>
        <div className="inputGroup inputGroup4">
          <button id="login" onClick={onSubmit}>
            Sign Up
          </button>
        </div>
      </StyledForm>
    </Fragment>
  );
};

export default Register;

const StyledForm = styled.form`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #ddd;
  border-radius: 0.5em;

  .svgContainer {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 1em;
    border-radius: 50%;
    pointer-events: none;

    div {
      position: relative;
      width: 100%;
      height: 0;
      overflow: hidden;
      border-radius: 50%;
      padding-bottom: 100%;
    }

    .mySVG {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: inherit;
      height: inherit;
      box-sizing: border-box;
      border: solid 2.5px #217093;
      border-radius: 50%;
    }
  }

  .inputGroup {
    margin: 0 0 2em;
    padding: 0;
    position: relative;

    .backToLogin {
      margin-top: 10px;
      p {
          color: var(--main-gradient);
          font-weight: 700;
        }
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  label {
    margin: 10px 0 12px;
    display: block;
    font-size: 1.25em;
    color: var(--main-gradient);
    font-weight: 700;
    user-select: none;
  }

  .checkbox_wrapper {
    width: 6rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    span {
      user-select: none;
    }
  }

  #loginPassword {
    display: block;
    margin: 0;
    padding: 1rem;
    background-color: #f3fafd;
    border: solid 2px var(--third-color);
    border-radius: 4px;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: 100%;
    color: #353538;
    font-weight: 600;
    transition: box-shadow 0.2s linear, border-color 0.25s ease-out;

    &:focus {
      outline: none;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      border: solid 2px var(--third-color);
    }
  }

  #showPasswordCheck {
    margin: 0.5rem;
    top: 0;
    left: 0;
    height: 0.85em;
    width: 0.85em;
    background-color: var(--third-color);
    border: solid 2px var(--third-color);
    border-radius: 3px;
    &:after {
      content: "";
      position: absolute;
      right: 0.25em;
      top: 0.025em;
      width: 0.2em;
      height: 0.5em;
      border: solid var(--third-color);
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
      visibility: hidden;
    }
  }

  input#loginEmail {
    display: block;
    margin: 0;
    padding: 1rem;
    background-color: #f3fafd;
    border: solid 2px var(--third-color);
    border-radius: 4px;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: 100%;
    color: #353538;
    font-weight: 600;
    transition: box-shadow 0.2s linear, border-color 0.25s ease-out;

    &:focus {
      outline: none;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      border: solid 2px var(--third-color);
    }
  }

  button#login {
    display: block;
    margin: 0;
    padding: 0.65em 1em 1em;
    background: var(--main-gradient);
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 65px;
    font-size: 1.55em;
    color: #fff;
    font-weight: 600;
    transition: background-color 0.2s ease-out;

    &:hover,
    &:active {
      background-color: #217093;
    }
  }
`;
