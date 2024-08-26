import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import Loading from './Loading';
import { AuthContext } from '../Context/Auth.context';
import authenApi from '../api/authen.api';

const AutoRedirect = (p) => {
  const { children } = p;
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useContext(AuthContext)

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
    return <Loading minsize="35px" />;
  }

  if (isVerified) {
    return <Navigate to="/planner" replace />;
  }

  return children;
};

export default AutoRedirect;