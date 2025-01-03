import { useContext } from "react";
import styled from "styled-components";
import ConversationContext from "../../../context/conversation.context";
// import ConversationContext from "../../../context/Conversation.Context";

const Menu = (p) => {
    const { conID, close } = p

    const { deleteConversation } = useContext(ConversationContext);

    const handleDelete = async (e) => {
        e.stopPropagation();
        console.log('delete', conID);
        close()
        await deleteConversation(conID)
    }

    return(
    <div>
        <Dropdown>
            <div className="dropdown">
                <ul>
                    <li>
                        <Icon><i className="fa-solid fa-pen"></i></Icon>
                        <p>Rename</p>
                    </li>
                    <li onClick={handleDelete}>
                        <Icon><i className="fa-regular fa-trash-can"></i></Icon>
                        <p>Delete</p>
                    </li>
                </ul>
            </div> 
        </Dropdown>
    </div>
  );
}

const Dropdown = styled.div`
    width: 160px;
    padding: 10px;
    border-radius: 10px;
    background-color: #313131;
    z-index: 1000;
    // margin-top: 64px;
    // margin-left: -10px;
    .dropdown{
        
        ul {
            li {
                display: flex;
                align-items: center;
                border-radius: 5px;
                padding: 0px 10px;
                cursor: pointer;
                &:hover {
                    background-color: #4d4d4d;
                }
                p {
                    margin-left: 10px;
                    color: white;
                    font-size: 15px;
                }
            }
        }
    }
`

const Icon = styled.i`
    font-size: 20px;
`

export default Menu;



