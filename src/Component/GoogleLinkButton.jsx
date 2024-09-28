import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import authenApi from "../api/authen.api";
import { API_BASE_URL, PREFIX } from "../config";
import { AuthContext } from "../context/Auth.context";

const GoogleLinkButton = () => {
  const { userData , linkGoogleAccount} = useContext(AuthContext);
  console.log("userData", userData);
  // const handleLinkGoogle = async () => {
  //   if (userData?.id) {
  //     window.open(
  //       `${API_BASE_URL}${PREFIX}google/link-gmail?userId=${userData.id}`
  //     );
  //   }
  // };

  return (
    <BtnWrapper>
      <Button onClick={linkGoogleAccount}>
        <FcGoogle></FcGoogle>
        Connect with Google
      </Button>
    </BtnWrapper>
  );
};

export default GoogleLinkButton;

// Styled Components
const BtnWrapper = styled.div`
  text-decoration: none;
  max-width: 20rem;
  width: auto;
`;

const Button = styled.button`
  border: none;
  padding: 10px 20px;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background-color: #ebf3ff;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #90b5f6;
  }
`;
