import styled from "styled-components";
import ToolSettings from "./Tool.jsx";
import LinkAccountSetting from "./LinkGoogle.jsx";

const AISetting = () => {
    return (
        <Container>
            <TitleWrapper>
                <h2>Tùy chỉnh Raine</h2>
            </TitleWrapper>

            <ToolSettings />
            <LinkAccountSetting />
        </Container>
    );
}



export default AISetting;

const Container = styled.div`
    width: 100%;
    height: 100%;

    --title-height: 5%;
    --preview-height: 35%;
    --content-height: 55%;
`

const TitleWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: var(--title-height);


    h2 {
        @media screen and (min-width: 769px) {
            font-size: 15px;
        }
        @media screen and (max-width: 768px) {
            font-size: 12px;
        }
        font-size: 25px;
        font-weight: 900;
        color: var(--black-text);
    }
`