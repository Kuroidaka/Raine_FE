import styled from "styled-components";
import { Icon } from "../../assets/icon";
import { useContext, useState, useCallback, useMemo } from "react";
import Appearance from "./Appearance";
import DeviceContext from "../../Context/Device.context";
import { VscTools } from "react-icons/vsc";
import Tools from "./Tools";

const Setting = () => {
    const [selectItem, setSelectItem] = useState("appearance");
    const { device } = useContext(DeviceContext);

    const dataItem = useMemo(() => [
        {
            icon: <Icon.background />,
            name: "appearance",
            title: "Hiển thị",
            component: <Appearance /> 
        },
        {
            icon: <VscTools />,
            name: "tools",
            title: "Tool",
            component: <Tools />
        },
    ], []);

    const handleChooseItem = useCallback((id) => {
        setSelectItem(id);
    }, []);

    const selectedComponent = useMemo(() => {
        const selectedItem = dataItem.find(item => item.name === selectItem);
        return selectedItem ? selectedItem.component : null;
    }, [dataItem, selectItem]);

    return (
        <Container>
            <BoxContent>
                <MenuList>
                    {dataItem.map((item, idx) => (
                        <MenuItem 
                            key={idx}
                            className={`pointer-cursor ${selectItem === item.name ? "active" : ""}`}
                            onClick={() => handleChooseItem(item.name)}
                        >
                            {item.icon}
                            {device === "desktop" && <span>{item.title}</span>}
                        </MenuItem>
                    ))}
                </MenuList>
                <ContentWrapper>
                    {selectedComponent}
                </ContentWrapper>
            </BoxContent>
        </Container>
    );
}

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
    @media screen and (min-width: 769px) {
        width: 80%;
    }
    @media screen and (max-width: 768px) {
        width: 100%;
    }
    border-left: 1px solid #cfcfcf;
    background-color: #ffffff;
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
