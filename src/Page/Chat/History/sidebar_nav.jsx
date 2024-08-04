import Tippy from '@tippyjs/react/headless';
import { followCursor } from 'tippy.js';
import Menu from "./Dropdown";
import { useState } from 'react';

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
    <li className={ `conversation ${selectedID == conversation.id ? `selected` : ""}`} 
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
                    <i className="fas fa-ellipsis-h"/>
                </div>
            </div>
        </Tippy>

    </li>  
    );
}
 
export default SidebarNav;