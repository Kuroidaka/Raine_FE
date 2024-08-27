import { createContext, useState, useEffect } from "react";
import authenApi from "../api/authen.api";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { API_BASE_URL, PREFIX } from "../config";

export const AuthContext = createContext(null);

export const AuthProvider = (p) => {
  const { children } = p;
  const [isLoad, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [storedToken, setStoredToken] = useState(localStorage.getItem("token"))
  useEffect(() => {
    const fetchTokenData = async () => {
      console.log("check token");

      if (!storedToken) {
        setLoading(false);
        logOut();
        return;
      }

      try {
        const user = await authenApi.verifyToken().catch((error) => {
          console.error("User token verification failed:", error);
          return null;
        });
  
        // If no user, exit early and log out
        if (!user) {
          logOut();
          return;
        }
  
        // Verify the Google token only if the user token is valid
        let googleUser = null;
        try {
          googleUser = await authenApi.verifyGoogleToken();
        } catch (error) {
          console.log("No linked Gmail account or Google token verification failed:", error);
        }
  
        // Combine user and Google user data
        const finalUser = { ...user, ...googleUser };
  
        setUserData(finalUser);
        setStoredToken(localStorage.getItem("token"))
      } catch (err) {
        console.error("Token verification failed:", err);
        logOut();
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [storedToken]);

  const regenerateToken = async () => {
    try {
      const { token }  = await authenApi.regenerateToken()
      localStorage.setItem('token', token);
      
      setStoredToken(token)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const linkGoogleAccount = () => {
    try {
      if (userData?.id) {
        const popup = window.open(
          `${API_BASE_URL}${PREFIX}google/link-gmail?userId=${userData.id}`,
          'googleLinkWindow',
          'width=400,height=500'
        );
  
        const checkPopupClosedInterval = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkPopupClosedInterval);
            // Once the popup is closed, trigger token regeneration
            await regenerateToken();
          }
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const unlinkGoogleAccount = async () => {
    try {
      await authenApi.unlinkGoogle()
      await regenerateToken()

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logOut = () => {
    localStorage.removeItem("token");
    window.history.pushState(null, "", "/login");
    // setRole({});
    // setPermissionList([]);
  };

  const value = {
    logOut,
    userData,
    setUserData,
    // role,
    // permissionList,
    isLoad,
    setLoading,
    linkGoogleAccount,
    unlinkGoogleAccount
  };

  if (!storedToken) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
