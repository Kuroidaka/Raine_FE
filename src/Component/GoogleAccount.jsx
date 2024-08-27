import styled from "styled-components";
import Button from "./Button";

const UserProfileCard = (p) => {
  const { user, unlink } = p;

  return (
    <Wrapper>
      <Avatar src={user?.picture} alt={user.email} />
      <Content>
        <Name>{user.email}</Name>
        <Platforms>Google</Platforms>
      </Content>
      <Button title="Unlink account" onClick={unlink}/>
    </Wrapper>
  );
};

export default UserProfileCard;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const Content = styled.div`
  flex-grow: 1;
`;

const Name = styled.div`
  font-size: 1.5rem;
  color: #1d1d1d;
  font-weight: 500;
`;

const Platforms = styled.div`
  font-size: 14px;
  color: #6c757d;
`;
