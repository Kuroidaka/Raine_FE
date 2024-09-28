import { motion } from "framer-motion";
import styled from "styled-components";
import myCursor from '../assets/cursor/Labrador_Retriever.cur';

/* 
Example:
    <Button
        title="Add"
        onClick={handleAdd}
        className="add"
        style={{background: "red"}}
    />
*/

const Button = (p) => {

    const { title="", onClick=() => {}, className="", style={}, name="", Icon } = p

    const hleClick = (e) => {
        onClick(e)
    }
    
    return (
        <Container className={className} style={style}>
            <motion.button
            style={{cursor: `url(${myCursor}), auto`}}
                name={name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={hleClick}
            >
                {Icon && <Icon />}
                {title}
            </motion.button>            
        </Container>
     );
}
 
export default Button;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    button{
        width: 150px;
        padding: 10px;
        transform: none;
        border-radius: 10px;
        border: none;
        background: var(--main-gradient);
        transform: none;
        color: white;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    svg {
        color: white;
        font-size: 3rem;
    }
`