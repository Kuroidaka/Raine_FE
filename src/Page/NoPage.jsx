import styled from "styled-components";
import YetiComponent from "./YetiComponent";

const NoPage = () => {
    return ( 
    <Container>
        <YetiComponent />
    </Container>);
}
 
export default NoPage;

const Container = styled.div`
    z-index: 100000;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`