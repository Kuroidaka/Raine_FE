import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import Loading from './Loading';
import authenApi from '../api/authen.api';
import OverlayDimLoading from './Overlay';

const AutoRedirect = (p) => {
  const { children } = p;
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token") 
  useEffect(() => {
    if (token) {
        authenApi.verifyToken(token)
        .then(() => {
          setIsVerified(true);
        })
        .catch(() => {
          setIsVerified(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    // Optionally return a loading indicator while checking
    return <OverlayDimLoading /> 
  }

  if (isVerified) {
    return <Navigate to="/planner" replace />;
  }

  return children;
};

export default AutoRedirect;