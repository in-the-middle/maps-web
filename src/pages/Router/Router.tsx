import React, { useContext, createContext, useState, useEffect } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";

import authService from "components/apiDeclaration/apiDeclaration";

import LoginPage from "pages/Login/Login";
import SignupPage from "pages/Signup/Signup";
import MainPage from "pages/Main/Main";
import ResetPasswordPage from "pages/ResetPassword/ResetPassword";
import PrivacyPage from "pages/Privacy/Privacy";
import TermsPage from "pages/Terms/Terms";

import jwt_decode from "jwt-decode";
import { RefreshTokenDTO } from "authServiceApi/model";

export default function Router() {
  const [user, setUser] = useState(null);
  const [response, setResponse] = useState<any>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);
  const [isLogged, setIsLogged] = useState(!!cookies.refreshToken);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function refreshToken() {
      setLoading(true);
      const refreshTokenDTO = {
        token: cookies.refreshToken,
      } as RefreshTokenDTO;

      if (refreshTokenDTO.token) {
        try {
          const response = await authService.refreshToken({
            refreshTokenDTO: refreshTokenDTO,
          });
          console.log(response);
          setUser(jwt_decode(response.token as any));
          setResponse(response);
          console.log(user);
        } catch (e: any) {
          console.log(e.response);
        }
      }
      setLoading(false);
    }

    refreshToken();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUser = (user: any) => {
    setUser(user);
  };

  const handleRefreshToken = (token: any) => {
    setCookie("refreshToken", token);
  };

  const removeRefreshToken = () => {
    removeCookie("refreshToken");
  };

  const handleResponse = (res: any) => {
    setResponse(res);
  };

  const checkAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken);
    console.log(refreshToken);

    if (!response.accessToken || !response.refreshToken) {
      return false;
    }

    try {
      // { exp: 12903819203 }
      const tokenInfo: any = jwt_decode(response.accessToken.token);
      console.log(tokenInfo);

      if (tokenInfo.exp < new Date().getTime() / 1000) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  };

  const PrivateRoute = ({ children, user }: any) => {
    return (
      <Route
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  };

  return (
    <BrowserRouter>
      {!loading ? (
        <Switch>
          <PublicRoute path="/signup" user={user}>
            <SignupPage />
          </PublicRoute>
          <PublicRoute path="/login" user={user}>
            <LoginPage
              handleUser={handleUser}
              handleResponse={handleResponse}
              handleRefreshToken={handleRefreshToken}
              res={response}
              usernamee={user}
            />
          </PublicRoute>
          <PublicRoute path="/reset-password" user={user}>
            <ResetPasswordPage />
          </PublicRoute>
          <PublicRoute path="/terms-and-conditions" user={user}>
            <TermsPage />
          </PublicRoute>
          <PublicRoute path="/privacy" user={user}>
            <PrivacyPage />
          </PublicRoute>
          <PrivateRoute path="/" user={user}>
            <MainPage
              response={response}
              user={user}
              cookies={cookies}
              handleUser={handleUser}
              handleResponse={handleResponse}
              handleRefreshToken={handleRefreshToken}
              removeRefreshToken={removeRefreshToken}
              setUser={setUser}
              setResponse={setResponse}
            />
          </PrivateRoute>
        </Switch>
      ) : null}
    </BrowserRouter>
  );
}

const PublicRoute = ({ children, user }: any) => {
  return (
    <Route
      render={({ location }) =>
        !user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
