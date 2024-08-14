import { Icon } from "../../assets/icon";
import { Img } from "../../assets/svg/index"
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DeviceContext from "../../Context/Device.context";
import paths from "../../Routes/path";
import Overlay from "./Overlay";
import myCursor from "../../assets/cursor/Labrador_Retriever.cur";

const menuItems = [
    { name: "task", label: 'Tác vụ', icon: Icon.task, link: paths.planner },
    { name: "setting", label: 'Cài đặt', icon: Icon.setting, link: paths.setting },
    { name: "chat", label: 'Raine', icon: Icon.setting, link: paths.chat },
];

const Sidebar = (p) => {
    const { isopen, toggle, isOpenOvelay, setIsOpenOverlay } = p



    const menuSetting = menuItems.find(item => item.name === "setting")


    const { device } = useContext(DeviceContext)

    const SideStyle = {
        open: () => ({
            width: device === "desktop" ? "var(--300px)" : "var(--250px)",
            transition: {
                type: 'spring',
            }
        }),
        closed: {
            width: device === "desktop" ? 'var(--sidebar-wt)' : "0px",
            transition: {
                delay: 0.2,
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        }
    };

    // const hdleClickOverLay = () => {
    //     setIsOpenOverlay(false)
    //     toggle(false)

    // }

    const [select, setSelect] = useState("")

    const handleSelect = (link) => {
        setSelect(link)
    }

    useEffect(() => {
        setSelect(window.location.pathname)
    }, []);

    return (
        <>
            <SideCon
                initial={"closed"}
                animate={isopen ? 'open' : 'closed'}
                variants={SideStyle}
                onMouseEnter={toggle(true)} onMouseLeave={toggle(false)}>
                <div className="logo">
                    <LogoWrapper>
                        <Img.logo />
                    </LogoWrapper>
                </div>

                <SidebarMenu>
                    {menuItems.map((menuItem, idx) => {
                    const contained = select.includes(menuItem.link)
                    if(menuItem.name !== "setting")
                    return (
                        <SidebarMenuItem key={idx}
                            onClick={() => handleSelect(menuItem.link)}
                            className={contained && 'active'}
                            whileHover={{
                                x: "5px",
                                transition: {
                                    duration: 1,
                                    type: "spring"
                                }
                            }} >
                            <SidebarLink to={menuItem.link}>
                                {<div className="icon-wrapper">
                                    <menuItem.icon className="icon" />
                                </div>}
                                {/*  this may cause broken UI in item in sidebar when font-size change */}
                                <motion.span initial={{ opacity: 0, width: 0, height: 0 }}
                                    animate={isopen ? { opacity: 1, marginLeft: "23px", width: "100%", height: "25px" } : { opacity: 0, width: 0, height: 0 }}
                                    transition={{ duration: .2 }}
                                >{menuItem.label}</motion.span>
                            </SidebarLink>
                        </SidebarMenuItem>
                    )})}

                     <SidebarMenuItemSetting
                        onClick={() => handleSelect(menuSetting.link)}
                        className={select === menuSetting.link && 'active'}
                        whileHover={{
                            x: "5px",
                            transition: {
                                duration: 1,
                                type: "spring"
                            }
                        }} >
                        
                        <SidebarLink to={menuSetting.link}>
                            {<div className="icon-wrapper">
                                <menuSetting.icon className="icon" />
                            </div>}
                            {/*  this may cause broken UI in item in sidebar when font-size change */}
                            <motion.span initial={{ opacity: 0, width: 0, height: 0 }}
                                animate={isopen ? { opacity: 1, marginLeft: "23px", width: "100%", height: "25px" } : { opacity: 0, width: 0, height: 0 }}
                                transition={{ duration: .2 }}
                            >{menuSetting.label}</motion.span>
                        </SidebarLink>
                    </SidebarMenuItemSetting>
                </SidebarMenu>
            </SideCon>
            <Overlay
                onClick={toggle(false)}
                isOpen={isOpenOvelay}
                setIsOpen={setIsOpenOverlay}
                zIndex={"1000"}
            />
        </>
    )
}

export default Sidebar


const SideCon = styled(motion.div)`
    z-index: 1001;
    overflow: hidden;
    position: absolute;
    top: 0;
    height: 100dvh;
    max-width: 375px;
    background-color: #FFFFFF;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;

    .logo{
        width: 100%;
        height: 50px;
        background-color: aliceblue;
    }
`

const SidebarMenu = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    margin: 0;
    overflow: hidden;
    position: relative;
    height: 92%;
`;

const LogoWrapper = styled.div `
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 85%;
        padding-top: 10px;
        max-width: 70px;
    }
`

const SidebarMenuItem = styled(motion.div)`
    
    a {
        cursor: url(${myCursor}), auto;
    }
  &.active{
    border-radius: 10px!important;
    z-index: 99;
    a {
        box-shadow: 0 0 10px 1px rgba(30,30,30,.7);
        color: #ffffff!important;
        background: var(--main-gradient);

    }
  }
`
const SidebarMenuItemSetting = styled(motion.div)`

    position: absolute;
    bottom: 0px;
    padding: 10px;
    right: 0;
    left: 0px;

    a {
        cursor: url(${myCursor}), auto;
    }
  &.active{
    border-radius: 10px!important;
    z-index: 99;
    a {
        box-shadow: 0 0 10px 1px rgba(30,30,30,.7);
        color: #ffffff!important;
        background: var(--main-gradient);

    }
  }

`;



const SidebarLink = styled(Link)`
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    font-size: 12.4px;
    font-weight: 600;
    position: relative;
    justify-content: flex-start;
    height: 45px;

    .icon-wrapper {
        height: 17px;
        width: 29px;
        position: relative;
        .icon {
            position: absolute;
            left: 0;
            width: 100%;
            font-size: 18px;
        }
    }

    span {
        display: flex;
        align-items: center;
        user-select: none;
    }
`;