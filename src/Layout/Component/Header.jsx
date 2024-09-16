import styled from "styled-components";
import { Icon } from "../../assets/icon";
import myCursor from '../../assets/cursor/Labrador_Retriever.cur';

const Header = (p) => {
    const { toggleSideBar } = p

    return ( 
        <Container>
            <div className="header">
                <div className="icon-wrapper" style={{cursor: `url(${myCursor}), auto`}} onClick={toggleSideBar}>
                    <Icon.menu />
                </div>
            </div>
        </Container> 
     );
}
 
export default Header;

const Container = styled.div`

    height: auto;
    width: 100vw;
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 2.3rem;
        .icon-wrapper {
            display: flex;
            padding: 0.5rem;
            justify-content: center;
            align-items: center;
            svg{
                font-size: 20px
            }
        }
    }
`

