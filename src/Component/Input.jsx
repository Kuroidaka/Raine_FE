import styled from "styled-components";

/*
Example:
    <Input 
        name="title"
        width="80%"
        value={dataInput.title}
        onInput={handleInput}/>
*/

const Input = (p) => {
    const { id, value = "", name, onInput, onKeyDown, inputStyle, className, focusborder = "true", placeholder, plhdercolor, onBlur, autoFocus } = p

    return ( 
        <Container style={inputStyle} $focusborder ={focusborder} $plhdercolor={plhdercolor}>
            <input 
                id={id}
                value={value}
                type="text"
                name={name}
                spellCheck="false"
                placeholder={placeholder}
                onInput={onInput}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
                className={className} />
        </Container>
     );
}
 
export default Input;

const Container = styled.div`

    width: 100%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;

    input {
        background-color: transparent;
        border-radius: 5px;
        border: none;
        outline: none;
        width: 100%;
        padding: .7rem;
        height: 100%;
        font-size: 1.5rem;
        transition: all 0.3s ease-in-out;
        color: #626262;

        &:focus {
            border: ${({$focusborder}) => $focusborder === "true" ? "1px solid rgba(0, 0, 0, 0.2)!important" : "" };
            box-shadow: 0 3px 10px 0 rgba(0,0,0,.15);
        }
        &::placeholder {
            color: ${({$plhdercolor}) => $plhdercolor };
            font-size: 1.15rem;
            opacity: 1; /* Firefox */
        }

    }
`