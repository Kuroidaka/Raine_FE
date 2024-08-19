import { createContext, useState, useEffect } from 'react';
import authenApi from '../api/authen.api';
import { useNavigate } from 'react-router';

export const AuthContext = createContext(null);

export const AuthProvider = (p) => {
  const { children } = p
  const [isLoad, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTokenData = async () => {
      console.log("check token")
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        logOut();
        return;
      }

      try {
        await authenApi.verifyToken();
      } catch (err) {
        console.error('Token verification failed:', err);
        logOut();
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate("/login")
    // setRole({});
    // setPermissionList([]);
  };

  const value = {
    logOut,
    // role,
    // permissionList,
    isLoad,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};