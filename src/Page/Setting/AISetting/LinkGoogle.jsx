import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import userApi from "../../../api/user.api";
import Loading from "../../../Component/Loading";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/Auth.context";
import GoogleLinkButton from "../../../Component/GoogleLinkButton";
import UserProfileCard from "../../../Component/GoogleAccount";
import { toast } from "react-toastify";
import authenApi from "../../../api/authen.api";

const LinkAccountSetting = () => {
    const { userData, unlinkGoogleAccount } = useContext(AuthContext) || { username: '' }

    const [ggUser, setGGUser] = useState(userData)

    useEffect(() => {
      if(userData)
        setGGUser(userData)
    }, [userData]);

    // console.log("ggUser", ggUser)
    return (
        <Container>
        <TitleWrapper>
            <Title>
            <h2>Link Account</h2>
            <p>Connect a Google account for <strong>@{ggUser.username || userData.username}</strong> to sponsor maintainers with. Get recognition on GitHub for sponsorships made on Patreon when the sponsored person has linked Patreon and GitHub, too, and has a public GitHub Sponsors profile.</p>
            </Title>
        </TitleWrapper>

        <ContentWrapper>
          {ggUser.googleCredentials 
          ? <UserProfileCard user={ggUser} unlink={unlinkGoogleAccount}/>
          : <GoogleLinkButton/> 
          }
        </ContentWrapper>
        </Container>
    );
};

export default LinkAccountSetting;

const TitleWrapper = styled.div`
  margin-bottom: 20px;

`

const Title = styled.div` 
  border-bottom: max(1px, 0.0625rem) solid #cfcfcf;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;

  h2 {
    font-size: 2rem;
  }
`

const ContentWrapper = styled.div `

  /* border-color: #cfcfcf;
  border-radius: 0.375rem;
  border-style: solid;
  border-width: max(1px, 0.0625rem); */

`

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
`;
