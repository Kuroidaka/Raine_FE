import { useState, useEffect } from "react";
import { File1, Image, Delete, AttachFile, Send } from "../../../assets/Icons/index";

const InputCom = (p) => {
    const { filesImages, uploadFileImg, setFilesImages, handleSend } = p;
    const [inputValue, setInputValue] = useState('');
    const [isComposing, setIsComposing] = useState(false); // New state to track IME composing

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendButtonClick = () => {
        if (inputValue !== '') {
            handleSend(inputValue);
            setInputValue('');
        }
    };

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            document.getElementById('myTextarea').style.height = 'auto';
            handleSendButtonClick();
        } else if (e.key === 'Enter' && e.shiftKey) {
            setInputValue(prevValue => `${prevValue}\n`);
        }
    };

    const handleDeleteImgFile = (id) => {
        const updatedFiles = filesImages.filter(file => file.id !== id);
        setFilesImages(updatedFiles);
    };

    useEffect(() => {
        const textarea = document.getElementById('myTextarea');
        textarea.addEventListener('compositionstart', () => setIsComposing(true));
        textarea.addEventListener('compositionend', () => setIsComposing(false));
        textarea.addEventListener('input', autoResize);

        function autoResize() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        }

        return () => {
            textarea.removeEventListener('compositionstart', () => setIsComposing(true));
            textarea.removeEventListener('compositionend', () => setIsComposing(false));
            textarea.removeEventListener('input', autoResize);
        };
    }, []);

    return (
        <div className="Input_content">
            <div className="File_area">
                {filesImages.map((file, idx) => (
                    <div className="file_container" key={idx}>
                        <div className="file_info">
                            {file.type === 'file' ? <File1 /> : <Image />}
                            <p className="file_name">{file.name}</p>
                        </div>
                        <div id="Delete_icon" onClick={() => handleDeleteImgFile(file.id)}>
                            <Delete />
                        </div>
                    </div>
                ))}
            </div>
            <div className="Input_area">
                {/* <label className="attach-btn-wrapper" htmlFor="img_file-Input">
                    <span><AttachFile /></span>
                    <input
                        type="file"
                        id="img_file-Input"
                        accept=".jpg,.png,.jpeg,.webp,.heic"
                        style={{ display: 'none' }}
                        onChange={(e) => uploadFileImg(e)}
                        multiple
                    />
                </label> */}
                <textarea
                    className="Input_text"
                    rows="1"
                    id="myTextarea"
                    placeholder="Input your prompt..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleEnterKeyPress}
                />
                {/* Uncomment below for send button functionality */}
                {/* <span id="send_button" onClick={handleSendButtonClick}>
                    <Send />
                </span> */}
            </div>
        </div>
    );
}

export default InputCom;
