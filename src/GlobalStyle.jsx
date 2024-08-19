import { createGlobalStyle } from "styled-components";
import myCursor from './assets/cursor/Labrador_Retriever.cur';
const variants = [...Array(50).keys()].map(i => i + 1); // generates an array [1, 2, ..., 50]


const GlobalStyles = createGlobalStyle`
    :root {
        --sidebar-wt: 60px;
        --header-ht: 60px;
        --main-gradient: linear-gradient(118deg,rgba(30, 30, 30 ,1),rgba(30, 30, 30 ,.7));
        --second-color: #FDBD3E;
        --third-color: #9c9c9c;

        --modal-header: 65px;
        --white-text: #ffff;
        --black-text: #1e1e1e;
        --skeleton-first: #FFFFFF;
        --skeleton-second: #E7EDF1;

        /* size */
        --16px: 1rem;
        --24px: 1.5rem;
        --32px: 2rem;
        --250px: 16.6rem;
        --300px: 18.75rem;
    }
    
    *, *:before, *:after {
        -webkit-box-sizing: border-box!important;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 0;
        margin: 0;

        @media screen and (min-width: 769px) {
            font-size: 1.3rem;          
        }
        @media screen and (max-width: 768px) {
            font-size: 1.6rem;
        }
    }
    html {
        font-size: 62.5%;
        width: 100%;
        line-height: 1.5;
        letter-spacing: .01rem;
        cursor: ${`url(${myCursor}), auto`}!important;
        height: -webkit-fill-available;
    }
    body {
        ::-webkit-scrollbar{
            width: 0px;
        }
        color: #626262;
        text-rendering: optimizeSpeed;
        background-color: #FCFCFC;
        font-family: Montserrat,Helvetica,Arial,sans-serif;
        font-weight: 400;
        min-height: -webkit-fill-available;
    }
    a {
        color: var(--text-color);
        text-decoration: none;
    }
    pre {
        white-space:pre-wrap;
    }

    .select-none {
        -webkit-user-select: none!important;
        -moz-user-select: none!important;
        -ms-user-select: none!important;
        user-select: none!important;
    }

    .text-center {
        text-align: center!important;
    }
    
    .text-dark {
        color: var(--black-text)!important;
    }

    .text-white {
        color: var(--white-text)!important;
    }

    .line-through {
        text-decoration: line-through!important;
    }

    .blur{
        opacity: .6!important;
    }

    .wrap-text {
        word-wrap: break-word;
        white-space: pre-wrap;
    }

    @-moz-document url-prefix() {
        .wrap-text {
            white-space: -moz-pre-wrap;
        }
    }
    .col3 {
        width: 33.333333%;
        height: 100%;
    }

    ${variants.map(variant => `
    .ml-${variant} {
      margin-left: ${variant}px!important;
    }

    .mb-${variant} {
      margin-bottom: ${variant}px!important;
    }

    .mt-${variant} {
      margin-top: ${variant}px!important;
    }

    .mr-${variant} {
      margin-right: ${variant}px!important;
    }
    
    .pl-${variant} {
      padding-left: ${variant}px!important;
    }

    .pb-${variant} {
      padding-bottom: ${variant}px!important;
    }

    .pt-${variant} {
      padding-top: ${variant}px!important;
    }

    .pr-${variant} {
      padding-right: ${variant}px!important;
    }

  `)}
    .pointer-cursor {
        cursor: ${`url(${myCursor}), auto`}!important;
    }
`

export default GlobalStyles;