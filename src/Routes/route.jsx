// import { Navigate } from "react-router";
// import { lazy, Suspense } from "react";

// import DefaultLayout from "../Layout/default";
// import paths from "./path";
// import Loading from "../Component/Loading";

// const Login = lazy(() => import("../Page/Authen/Login"));
// const Planner = lazy(() => import("../Page/Planner/Planner"));
// const NoPage = lazy(() => import("../Page/NoPage"));
// const Setting = lazy(() => import("../Page/Setting/Setting"));
// const ChatPage = lazy(() => import("../Page/Chat"));
// const VideoChat = lazy(() => import("../Page/VideoChat"));
// const StreamTest = lazy(() => import("../Page/Test/Stream"));
// const PhotoCapture = lazy(() => import("../Page/Test/Video"));
// const AudioPreview = lazy(() => import("../Page/Test/PreviewAudio"));

// export const routes = [
//   {
//     name: "default",
//     page: <Navigate to={paths.login} />,
//     path: "*",
//     exact: true,
//   },
//   {
//     name: "login",
//     page: (
//         <Suspense fallback={<Loading />}>
//           <Login />
//         </Suspense>
//     ),
//     path: paths.login,
//     exact: true,
//   },
//   {
//     name: "planner",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <Planner />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.planner,
//     exact: true,
//   },
//   {
//     name: "chat",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <ChatPage />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.chat,
//     exact: true,
//   },
//   {
//     name: "chatID",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <ChatPage />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: `${paths.chat}/:id`,
//     exact: true,
//   },
//   {
//     name: "videoChat",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <VideoChat />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.videoChat,
//     exact: true,
//   },
//   {
//     name: "setting",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <Setting />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.setting,
//     exact: true,
//   },
//   {
//     name: "test",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <StreamTest />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.test,
//     exact: true,
//   },
//   {
//     name: "test_cam",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <PhotoCapture />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.testCam,
//     exact: true,
//   },
//   {
//     name: "test_audio",
//     page: (
//       <DefaultLayout>
//         <Suspense fallback={<Loading />}>
//           <AudioPreview />
//         </Suspense>
//       </DefaultLayout>
//     ),
//     path: paths.testAudio,
//     exact: true,
//   },
//   {
//     name: "noPage",
//     page: (
//       <Suspense fallback={<Loading />}>
//         <NoPage />
//       </Suspense>
//     ),
//     path: paths.noPage,
//     exact: false,
//   },
// ];
