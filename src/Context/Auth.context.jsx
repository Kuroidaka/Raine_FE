import { createContext, useState, useEffect } from 'react';
import authenApi from '../api/authen.api';
import { useNavigate } from 'react-router';
import { decodeToken } from '../Util';

export const AuthContext = createContext(null);

export const AuthProvider = (p) => {
  const { children } = p
  const [isLoad, setLoading] = useState(true);
  const [userData, setUserData] = useState({})
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
        const data = await authenApi.verifyToken();
        setUserData(data)
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
    userData,
    // role,
    // permissionList,
    isLoad,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};