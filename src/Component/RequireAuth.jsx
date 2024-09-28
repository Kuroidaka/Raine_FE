import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';
import authenApi from '../api/authen.api';

const RequireAuth = (p) => {
  const { children } = p
  const token = localStorage.getItem('token');
  const { logOut,
    setUserData,
    setLoading
  } = useContext(AuthContext)

  useEffect(() => {
    const fetchTokenData = async () => {
      console.log("check token");
      if (!token) {
        setLoading(false);
        logOut();
        return;
      }

      try {
        const [user, googleUser] = await Promise.all([
          authenApi.verifyToken(),
          authenApi.verifyGoogleToken(),
        ]);

        setUserData({ ...user, googleUser });
      } catch (err) {
        console.error("Token verification failed:", err);
        logOut();
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [token]);

  if (!token) {
      // If the user is not authenticated, redirect to the login page
      return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;