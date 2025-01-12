import { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DefaultLayout from "../layout/Default";
import paths from "../Routes/path";
import AutoRedirect from "../component/AutoRedirect";

import Login from "../page/Authen/Login";
import Register from "../page/Authen/Register";
import HomeLayout from "../layout/HomeLayout";
import OverlayDimLoading from "../component/OverlayDimLoading";
import NoPage from "../page/NoPage";
const Planner = lazy(() => import("../page/Planner"));
const Setting = lazy(() => import("../page/Setting"));
const ChatPage = lazy(() => import("../Page/Chat"));
// const NewChat = lazy(() => import("../Page/Chat/NewChat"));
const VideoChat = lazy(() => import("../Page/VideoChat"));
const PhotoCapture = lazy(() => import("../Page/Test/Video"));
const AudioPreview = lazy(() => import("../Page/Test/PreviewAudio"));

const getDashboardChildrenRoutes = async () => {
  // eslint-disable-next-line react/prop-types
  const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<OverlayDimLoading />}>{children}</Suspense>
  );

  const childrenRoutes = [
    {
      index: true,
      page: "planner",
      path: paths.planner,
      element: (
        <SuspenseWrapper>
          <Planner />
        </SuspenseWrapper>
      ),
    },

    {
      page: "chat",
      path: paths.chat,
      element: (
        <SuspenseWrapper>
          <ChatPage />
        </SuspenseWrapper>
      ),
    },
    {
      page: "chat",
      path: `${paths.chat}/:id`,
      element: (
        <SuspenseWrapper>
          <ChatPage />
        </SuspenseWrapper>
      ),
    },

    {
      page: "videoChat",
      path: paths.videoChat,
      element: (
        <SuspenseWrapper>
          <VideoChat />
        </SuspenseWrapper>
      ),
    },
    {
      page: "videoChat",
      path: `${paths.videoChat}/:id`,
      element: (
        <SuspenseWrapper>
          <VideoChat />
        </SuspenseWrapper>
      ),
    },

    {
      page: "setting",
      path: paths.setting,
      element: (
        <SuspenseWrapper>
          <Setting />
        </SuspenseWrapper>
      ),
    },
    {
      page: "setting",
      path: `${paths.setting}/:name`,
      element: (
        <SuspenseWrapper>
          <Setting />
        </SuspenseWrapper>
      ),
    },
    {
      page: "test",
      path: paths.testCam,
      element: (
        <SuspenseWrapper>
          <PhotoCapture />
        </SuspenseWrapper>
      ),
    },
    {
      page: "test",
      path: paths.testAudio,
      element: (
        <SuspenseWrapper>
          <AudioPreview />
        </SuspenseWrapper>
      ),
    },
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
          path: "/",
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
              path: paths.register,
              element: (
                <AutoRedirect>
                  <Register />
                </AutoRedirect>
              ),
            },
            {
              path: "/",
              element: <DefaultLayout />,
              children:
                dashboardChildrenRoutes.length > 0
                  ? [
                      { index: true, element: <Navigate to={paths.planner} /> },
                      { path: "*", element: <NoPage /> },
                      ...dashboardChildrenRoutes,
                    ]
                  : [{ index: true, element: <Navigate to={paths.login} /> }],
            },
            {
              path: "*",
              element: <NoPage />,
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
