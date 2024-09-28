import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DefaultLayout from "../Layout/default";
import paths from "./path";
import AutoRedirect from "../Component/AutoRedirect";

// const Login = lazy(() => import("../Page/Authen/Login"));
import Login from "../Page/Authen/Login";
import HomeLayout from "../Layout/HomeLayout";
import OverlayDimLoading from "../Component/Overlay";
const Planner = lazy(() => import("../Page/Planner/Planner"));
const NoPage = lazy(() => import("../Page/NoPage"));
const Setting = lazy(() => import("../Page/Setting/Setting"));
const ChatPage = lazy(() => import("../Page/Chat"));
// const NewChat = lazy(() => import("../Page/Chat/NewChat"));
const VideoChat = lazy(() => import("../Page/VideoChat"));
const StreamTest = lazy(() => import("../Page/Test/Stream"));
const PhotoCapture = lazy(() => import("../Page/Test/Video"));
const AudioPreview = lazy(() => import("../Page/Test/PreviewAudio"));



const getDashboardChildrenRoutes = async () => {

  // eslint-disable-next-line react/prop-types
  const SuspenseWrapper = ({ children }) => (<Suspense fallback={ <OverlayDimLoading />}>{children}</Suspense>);

  const childrenRoutes = [
    { page: "planner", path: paths.planner, element: <SuspenseWrapper><Planner /></SuspenseWrapper> },
    { page: "chat", path: paths.chat, element: <SuspenseWrapper><ChatPage /></SuspenseWrapper> },
    { page: "chat", path: `${paths.chat}/:id`, element: <SuspenseWrapper><ChatPage /></SuspenseWrapper> },
    { page: "videoChat", path: paths.videoChat, element: <SuspenseWrapper><VideoChat /></SuspenseWrapper> },
    { page: "videoChat", path: `${paths.videoChat}/:id`, element: <SuspenseWrapper><VideoChat /></SuspenseWrapper> },
    { page: "setting", path: paths.setting, element: <SuspenseWrapper><Setting /></SuspenseWrapper> },
    { page: "setting", path: `${paths.setting}/:name`, element: <SuspenseWrapper><Setting /></SuspenseWrapper> },
    { page: "test", path: paths.test, element: <SuspenseWrapper><StreamTest /></SuspenseWrapper> },
    { page: "test", path: paths.testCam, element: <SuspenseWrapper><PhotoCapture /></SuspenseWrapper> },
    { page: "test", path: paths.testAudio, element: <SuspenseWrapper><AudioPreview /></SuspenseWrapper> },
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
              element: <DefaultLayout />,
              children:
              
              dashboardChildrenRoutes.length > 0 
              ? dashboardChildrenRoutes 
              : [{ index: true, element: <Navigate to={paths.login} /> }],
            },
            {
              path: paths.noPage,
              element: (
                <Suspense fallback={<OverlayDimLoading />}>
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

  return routes ? <RouterProvider router={routes} /> : <OverlayDimLoading />;
};

export default RouterWrapper;
