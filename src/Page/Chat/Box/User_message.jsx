import styled from "styled-components";
import { User } from "react-feather";
import { useContext, useEffect, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Img from "../../../assets/img";

import ImageCom from "../../../component/Image";
import MarkDown from "../../../component/MarkDownChat";
import { FadeIn } from "../../../component/Motion";
import { AuthContext } from "../../../context/Auth.context";
import VideoChatPreview from "./VideoPreview";
import { API_BASE_URL, PREFIX } from "../../../config";

const UserMsg = (p) => {
  const { text, imgList = [], videoRecord } = p;
  const { imgPlaceHolder } = Img;

  const { userData } = useContext(AuthContext) || { username: "" };
  const [user, setUser] = useState(userData);

  useEffect(() => {
    setUser(userData);
  }, [userData]);


  const scrollToBottom = () => {
    // pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    const div = document.querySelector(".list-chat");
    div.scrollTop = div.scrollHeight - div.clientHeight + 1000;
  };
  useEffect(scrollToBottom, [text]);

  return (
    <Container className="chat-msg human-chat">
      <div className="icon">
        <div className="human-icon-wrapper">
          <HumanIconWrapper user={user} />
        </div>
      </div>
      <div className="chat-content">
        <p className="chat-person">{user.username || user.email || "You"}</p>
        <div className="human-text-wrapper">
          <div className="human-text">
            {imgList.length > 0 && (
              <div className="img_list-wrapper">
                {imgList.map((img, index) => (
                  <div className="img-wrapper" key={index}>
                    <ImageCom
                      src={img.url}
                      imgPlaceHolder={imgPlaceHolder}
                      imgsize={
                        imgList.length === 1
                          ? "423px"
                          : imgList.length === 2
                          ? "250px"
                          : "171px"
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            <MarkDown text={text} />
          </div>
        </div>
        { videoRecord && <VideoPreviewWrapper>
          <VideoChatPreview id={videoRecord.id} videoSrc={`${API_BASE_URL}${PREFIX}file/stream/${videoRecord.name}?type=video`} />
        </VideoPreviewWrapper>}
      </div>
    </Container>
  );
};

const HumanIconWrapper = (p) => {
  const { user } = p;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="human-icon-wrapper">
      {imgError || !user.picture ? (
        <User className="human-icon" />
      ) : (
        <img
          src={user.picture}
          alt={user.username}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export default UserMsg;

const VideoPreviewWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
`;

const Container = styled(FadeIn)`
  width: 100%;
  display: flex;
  direction: rtl;
  .icon {
    display: flex;
    align-items: center;
    align-self: flex-start;
    .human-icon-wrapper {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 40px;
      border-radius: 50%;
      background-color: #00a5ff;
      .human-icon {
        width: 25px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .chat-content {
    margin-right: 18px;
    max-width: 80%;
    p.chat-person {
      font-size: 16px;
      margin-bottom: 7px;
      font-weight: bold;
    }
    .human-text-wrapper {
      padding: 10px;
      border-radius: 10px;
      background: #484856;
      display: inline-flex; /* Change to inline-flex */
      align-items: center;
      justify-content: center;
      width: auto; /* Make width adjust to content */
      flex-shrink: 0; /* Prevent shrinking */
      flex-basis: auto; /* Basis set to auto for flexbox */


      .human-text {
        overflow-x: scroll;
        width: 100%;
        direction: ltr;
        .img_list-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 5px;
          margin: 10px 0;
          min-width: 150px;
          .img-wrapper {
            /* max-width: 400px; */
            /* img {
                            border-radius: 10px;
                            cursor: pointer;
                            width: 100%;
                        } */
          }
        }
        pre {
          overflow-x: scroll;
        }
        img {
          width: 100%;
          max-width: 350px;
          margin: 10px 0;
          /* cursor: pointer; */
        }
        a {
          color: #00a5ff;
          text-decoration: none;
          font-weight: 500;
        }
        p {
          font-weight: 500;
        }
        ol,
        ul {
          padding: 6px 25px;
          li {
            font-size: 15px; /* Thay đổi kích thước của chữ StudyIO */
            font-weight: 500;
            margin: 10px 0;

            a {
              color: #00a5ff;
              text-decoration: none;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
`;
