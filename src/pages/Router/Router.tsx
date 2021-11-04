import React, { useContext, createContext, useState, useEffect } from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { useCookies } from 'react-cookie'

import authService from 'components/apiDeclaration/apiDeclaration'

import LoginPage from 'pages/Login/Login'
import SignupPage from 'pages/Signup/Signup'
import MainPage from 'pages/Main/Main'
import ResetPasswordPage from 'pages/ResetPassword/ResetPassword'
import TermsPage from 'pages/Terms/Terms'

import decode from 'jwt-decode'

export default function Router() {
  const [user, setUser] = useState(null)
  const [response, setResponse] = useState<any>(null)
  const [cookies, setCookie, removeCookie] = useCookies(['refreshToken'])

  useEffect(() => {
    console.log(cookies.refreshToken)
    /* const response = authService.refreshToken({
      body: cookies.refreshToken,
    })
    console.log(response) */
  }, [])

  const handleUser = (user: any) => {
    setUser(user)
  }

  const handleRefreshToken = (token: any) => {
    setCookie('refreshToken', token)
  }

  const handleResponse = (res: any) => {
    setResponse(res)
    console.log(res)
  }

  const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    console.log(accessToken)
    console.log(refreshToken)

    if (!response.accessToken || !response.refreshToken) {
      return false
    }

    try {
      // { exp: 12903819203 }
      const tokenInfo: any = decode(response.accessToken.token)
      console.log(tokenInfo)

      if (tokenInfo.exp < new Date().getTime() / 1000) {
        return false
      }
    } catch (e) {
      return false
    }

    return true
  }

  const PrivateRoute = ({ children, user }: any) => {
    return (
      <Route
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          )
        }
      />
    )
  }

  return (
    <BrowserRouter>
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
        <PrivateRoute path="/" user={user}>
          <MainPage user={user} />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

const PublicRoute = ({ children, user }: any) => {
  return (
    <Route
      render={({ location }) =>
        true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
