import styled from "styled-components";
import { Icon } from "../../assets/icon";
import { useContext, useCallback, useMemo } from "react";
import { VscTools } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router";
import DeviceContext from "../../Context/Device.context";
import Appearance from "./Appearance";
import AISetting from "./AISetting/AI";
import Loading from "../../Component/Loading";
import { Suspense } from "react";

const dataItem = [
  {
    icon: <Icon.background />,
    name: "appearance",
    title: "Hiển thị",
    component: <Appearance />,
  },
  {
    icon: <VscTools />,
    name: "ai",
    title: "AI Setting",
    component: <AISetting />,
  },
];

const Setting = () => {
  const { name } = useParams();
  const { device } = useContext(DeviceContext);
  const navigate = useNavigate();

  const handleChooseItem = useCallback((name) => {
    navigate(`/setting/${name}`);
  }, [navigate]);

  const selectedComponent = useMemo(() => {
    const selectedItem = dataItem.find((item) => item.name === name);
    return selectedItem ? selectedItem.component : null;
  }, [name]);

  return (
    <Container>
      <BoxContent>
        <MenuList>
          {dataItem.map((item, idx) => (
            <MenuItem
              key={idx}
              className={`pointer-cursor ${name === item.name ? "active" : ""}`}
              onClick={() => handleChooseItem(item.name)}
            >
              {item.icon}
              {device === "desktop" && <span>{item.title}</span>}
            </MenuItem>
          ))}
        </MenuList>
        <ContentWrapper>
          <Suspense fallback={<LoadingSettingWrap><Loading /></LoadingSettingWrap>}>{selectedComponent}</Suspense>
        </ContentWrapper>
      </BoxContent>
    </Container>
  );
};

export default Setting;

const Container = styled.div `
    display: flex;
`;

const BoxContent = styled.div `
    @media screen and (min-width: 769px) {
        margin: 15px;
        border: 1px solid #cfcfcf;
        border-radius: 10px;
    }
    height: 90dvh;
    width: 100%;
    background-color: #fdfdfd;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    display: flex;
    overflow: hidden;
`;

const MenuList = styled.ul `
    list-style: none;
    @media screen and (min-width: 769px) {
        width: 20%;
        padding: 28px 10px;
    }
    @media screen and (max-width: 768px) {
        width: 13%;
        margin: 10px;
    }
    height: 100%;
`;

const ContentWrapper = styled.div `
  overflow-y: scroll;
    @media screen and (min-width: 769px) {
        width: 80%;
    }
    @media screen and (max-width: 768px) {
        width: 100%;
    }
  border-left: 1px solid #cfcfcf;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
`;

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    border-radius: 10px;
    
    @media screen and (min-width: 769px) {
        padding: 6px 11px;
    }
    @media screen and (max-width: 768px) {
        padding: 10px;
    }

    svg {
        font-size: 3rem;
    }

    span {
        margin-left: 20px;
        font-size: 1.3rem;
        font-weight: 600;
    }

    &.active {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        background: var(--main-gradient);

        svg {
            color: #ffffff;
        }
        span { 
            color: #ffffff;
            font-weight: 900;
        }
    }
`;

const LoadingSettingWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`