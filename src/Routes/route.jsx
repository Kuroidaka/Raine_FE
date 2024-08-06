import { Navigate } from "react-router";

import DefaultLayout from "../Layout/default";
import { lazy, Suspense } from "react";

const Planner = lazy(() => import("../Page/Planner/Planner"));
const NoPage = lazy(() => import("../Page/NoPage"));
const Setting = lazy(() => import("../Page/Setting/Setting"));
const ChatPage = lazy(() => import("../Page/Chat"));
const CamChat = lazy(() => import("../Page/camChat/CamChat"));
const StreamTest = lazy(() => import("../Page/Test/Stream"));

import paths from "./path";
import Loading from "../Component/Loading";

export const routes = [
  {
    name: "default",
    page: <Navigate to={paths.planner} />,
    path: "*",
    exact: true,
  },
  {
    name: "planner",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <Planner />
        </Suspense>
      </DefaultLayout>
    ),
    path: paths.planner,
    exact: true,
  },
  {
    name: "chat",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <ChatPage />
        </Suspense>
      </DefaultLayout>
    ),
    path: paths.chat,
    exact: true,
  },
  {
    name: "chatID",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <ChatPage />
        </Suspense>
      </DefaultLayout>
    ),
    path: `${paths.chat}/:id`,
    exact: true,
  },
  {
    name: "videoChat",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <CamChat />
        </Suspense>
      </DefaultLayout>
    ),
    path: paths.videoChat,
    exact: true,
  },
  {
    name: "setting",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <Setting />
        </Suspense>
      </DefaultLayout>
    ),
    path: paths.setting,
    exact: false,
  },
  {
    name: "test",
    page: (
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <StreamTest />
        </Suspense>
      </DefaultLayout>
    ),
    path: paths.test,
    exact: false,
  },
  {
    name: "noPage",
    page: (
      <Suspense fallback={<Loading />}>
        <NoPage />
      </Suspense>
    ),
    path: paths.noPage,
    exact: false,
  },
];
