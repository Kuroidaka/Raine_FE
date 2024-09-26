import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ClipboardFileReader = (p) => {
  const { handleUploadFile } = p

  useEffect(() => {
    const handlePaste = async (event) => {
      if (event.clipboardData && event.clipboardData.items) {
        const items = event.clipboardData.items;

        // Check if the clipboard contains files
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind === 'file') {
            const fileFromClipboard = items[i].getAsFile();
            console.log(fileFromClipboard)
            handleUploadFile(fileFromClipboard)
            return;
          }
        }
        toast.error('No file found in clipboard');
      }
    };

    // Add the paste event listener
    window.addEventListener('paste', handlePaste);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return <></>
};

export default ClipboardFileReader;
