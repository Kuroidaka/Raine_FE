import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DefaultLayout from "../Layout/default";
import paths from "./path";
import Loading from "../Component/Loading";
import AutoRedirect from "../Component/AutoRedirect";

// const Login = lazy(() => import("../Page/Authen/Login"));
import Login from "../Page/Authen/Login";
import HomeLayout from "../Layout/HomeLayout";
import { AuthProvider } from "../Context/Auth.context";
const Planner = lazy(() => import("../Page/Planner/Planner"));
const NoPage = lazy(() => import("../Page/NoPage"));
const Setting = lazy(() => import("../Page/Setting/Setting"));
const ChatPage = lazy(() => import("../Page/Chat"));
const VideoChat = lazy(() => import("../Page/VideoChat"));
const StreamTest = lazy(() => import("../Page/Test/Stream"));
const PhotoCapture = lazy(() => import("../Page/Test/Video"));
const AudioPreview = lazy(() => import("../Page/Test/PreviewAudio"));

const getDashboardChildrenRoutes = async () => {
  const childrenRoutes = [
    { page: "planner", path: paths.planner, element: <Planner /> },
    { page: "chat", path: paths.chat, element: <ChatPage /> },
    { page: "chat", path: `${paths.chat}/:id`, element: <ChatPage /> },
    { page: "videoChat", path: paths.videoChat, element: <VideoChat /> },
    { page: "setting", path: paths.setting, element: <Setting /> },
    { page: "setting", path: `${paths.setting}/:name`, element: <Setting /> },
    { page: "test", path: paths.test, element: <StreamTest /> },
    { page: "test", path: paths.testCam, element: <PhotoCapture /> },
    { page: "test", path: paths.testAudio, element: <AudioPreview /> },
  ];

  return childrenRoutes;
};

const RouterWrapper = () => {
  const [routes, setRoutes] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      const dashboardChildrenRoutes = await getDashboardChildrenRoutes();
      const routerConfig = [
        {
          path: '/',
          element: <HomeLayout />,
          errorElement: <>error occur</>,
          children: [
            {
              index: true,
              path: paths.login,
              element: (
                <AutoRedirect>
                  <Login />
                </AutoRedirect>
              ),
            },
            {
              path: '/',
              element: (
                <Suspense fallback={<Loading />}>
                  <AuthProvider>
                    <DefaultLayout />
                  </AuthProvider>
                </Suspense>
              ),
              children: dashboardChildrenRoutes.length > 0 
              ? dashboardChildrenRoutes 
              : [{ index: true, element: <Navigate to={paths.login} /> }],
            },
            {
              path: paths.noPage,
              element: (
                <Suspense fallback={<Loading />}>
                  <NoPage />
                </Suspense>
              ),
            },
            {
              path: '*',
              element: <Navigate to={paths.login} />,
            },
          ],
        },
      ];
      setRoutes(createBrowserRouter(routerConfig));
    };

    fetchRoutes();

  }, []);

  return routes ? <RouterProvider router={routes} /> : <Loading />;
};

export default RouterWrapper;
