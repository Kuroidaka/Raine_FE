import GlobalStyles from './GlobalStyle'
import { Routes, Route } from "react-router-dom";
import { routes } from './Routes/route';
import { DeviceProvider } from "./Context/Device.context"
import { useEffect } from 'react';

import 'react-quill/dist/quill.snow.css';
import "flatpickr/dist/themes/light.css";
import "flatpickr/dist/flatpickr.css";

import myCursor from './assets/cursor/Labradoodle.cur';
import { WebSocketProvider } from './Context/socket.context';
const App = () => {


  useEffect(() => {
    document.body.style.cursor = `url(${myCursor}), auto`;
  }, []);


  return (
    <DeviceProvider>
       <WebSocketProvider>
        <GlobalStyles />
          <Routes>
            {routes.map((route, idx) => {
              return (<Route 
                        key={idx}
                        exact={route.exact}
                        path={route.path}
                        element={route.page}
                      ></Route>
                    )})}
          </Routes>
       </WebSocketProvider>
    </DeviceProvider>
  )
}

export default App
