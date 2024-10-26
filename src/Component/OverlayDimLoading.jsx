import styled from 'styled-components';
import Loading from './Loading';



const OverlayDimLoading = (p) => {
    const { isActive= true } = p
    return (
        <Overlay className={isActive ? 'active' : ''}>
            <Loading />
        </Overlay>
    );
};

export default OverlayDimLoading;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    &.active {
        opacity: 1;
        visibility: visible;
    }
`;