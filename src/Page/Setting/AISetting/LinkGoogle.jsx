import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth.context";
import GoogleLinkButton from "../../../component/GoogleLinkButton";
import UserProfileCard from "../../../component/GoogleAccount";


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
            <p>Connect a Google account for <strong>@{ggUser.username || userData.username}</strong> to easily sync your tasks and routines across devices. With this feature, all updates and changes will automatically save to your Google account, keeping everything up-to-date and accessible anytime, anywhere.</p>
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
