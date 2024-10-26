// import { getAndDownloadWebmFileFromBlobUrl } from "../../util";

const VideoRecorder = () => {
  const onClick = () => {
    const blobUrl =
      "blob:https://localhost:5173/a505b957-42a6-411d-9dff-be10b6c202a3";

    // getAndDownloadWebmFileFromBlobUrl(blobUrl, "my-video.webm")
    //   .then((file) => {
    //     console.log("Successfully downloaded the file:", file);
    //   })
    //   .catch((error) => {
    //     console.error("Error occurred:", error);
    //   });
  };
  return (
    <div>
      <button onClick={onClick}>Download</button>
    </div>
  );
};

export default VideoRecorder;
