import Tippy from '@tippyjs/react/headless';
import { followCursor } from 'tippy.js';
import { useState } from 'react';
import { FaEllipsisVertical } from "react-icons/fa6";

import Menu from "./Dropdown";
import styled from 'styled-components';

const SidebarNav = (p) => {
    const {
        conversation,
        selectedID,
        hdlSelCon
    } = p

    const [dropdown, setDropdown] = useState(false)
    const [dropdownParent, setDropdownParent] = useState(null)

    const handleToggleDropdown = (e) => {
        if(dropdown) {
            dropDownObj.close()
        } else {
            e.stopPropagation();
            dropDownObj.open(e)
        }
    }

    const dropDownObj = {
        open: (e) => {
            const element = e.currentTarget;
            const parentElement = element.closest('.conversation');
            parentElement.classList.add('hover-effect');
            setDropdownParent(parentElement)

            setDropdown(true)
            const conversationList = document.querySelector('.conversation-list');
            conversationList.style.overflow = 'hidden';
        },
        close: () => {
            
            dropdownParent.classList.remove('hover-effect');

            setDropdown(false)
            const conversationList = document.querySelector('.conversation-list');
            conversationList.style.overflow = 'auto';
        }
        
    }
    

    return ( 
    <NavContainer className={ `conversation ${selectedID == conversation.id ? `selected` : ""}`} 
        onClick={() => hdlSelCon(conversation.id)}>
        <div className="item">
        <p>{conversation.name}</p>
        </div>

        <Tippy
            interactive
            content="Tooltip"
            render={attrs => (
                <Menu  {...attrs} conID={conversation.id} close={dropDownObj.close}/>
            )}
            plugins={[followCursor]}
            appendTo={() => document.body}
            visible={dropdown}
            onClickOutside={() => handleToggleDropdown()}
            offset={[45, -14]}
            placement= 'right'
        >
            <div className="setting">
                <div className="gradient-overlay"></div>
                
                <div className='icon-wrapper' onClick={handleToggleDropdown}>
                    <FaEllipsisVertical></FaEllipsisVertical>
                </div>
            </div>
        </Tippy>

    </NavContainer>  
    );
}
 
export default SidebarNav;

const NavContainer = styled.li` 
    cursor: pointer;
    display: flex;
    position: relative;
    margin: 7px 0;
    height: 30px;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    .setting{
        display: none;
        height: 100%;
        align-items: center;
        position: absolute;
        right: 0;
        justify-content: center;
        width: 34%;

        .icon-wrapper {
            height: 100%;
            display: flex;
            width: 100%;
            padding-right: 10px;
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            align-items: center;
            justify-content: center;
            background: var(--selected-color);
            svg {
                background-color: transparent;
                font-size: 1.9rem;
                transition: all 0.3s ease-in-out;
            }
        }

        .gradient-overlay {
            background: linear-gradient(to right, transparent, var(--selected-color));
            width: 100%;
            height: 100%;
        }
    }
    .item {
        height: 100%;
        padding: 0px 10px;
        width: 100%;
        display: flex;
        align-items: center;
        p {
            font-size: 13px;
            transition: all 0.3s ease-in-out;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            color: #ebebeb;
        }
    }

    &.selected{
        background-color: var(--second-color);
        .item p {
            font-weight: 700;
        }
        .setting{
            display: flex;
        }
    }

    &.hover-effect {
        background-color: var(--second-color);
        
        box-sizing: border-box;
        .setting{
            display: flex;
            cursor: pointer;
        }
    }
    
    &:not(.selected):hover {
        background-color: var(--third-color);
        
        box-sizing: border-box;
        .setting{
            display: flex;
            cursor: pointer;

            .icon-wrapper {

                background: var(--third-color);
                svg {
                    background-color: transparent;
                }
            }

            .gradient-overlay {
                background: linear-gradient(to right, transparent, var(--third-color));

            }
        }
    }

`