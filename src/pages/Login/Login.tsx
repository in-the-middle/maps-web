import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import authService from 'components/apiDeclaration/apiDeclaration'
import { IconButton, InputAdornment, TextField } from '@material-ui/core'
import OutlinedInput from '@mui/material/OutlinedInput'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { GoogleLogin } from 'react-google-login'
import { GoogleAuthDTO } from 'authServiceApi'

import styled from 'styled-components'

import { AuthenticationDTO } from '../../authServiceApi/model'
import MediaButton from 'components/MediaButton/MediaButton'

import Apple from 'assets/icons/Interface/apple.svg'
import Google from 'assets/icons/Interface/google.svg'
import Facebook from 'assets/icons/Interface/facebook.svg'

export default function Login({
  handleUser,
  handleResponse,
  handleRefreshToken,
  res,
  usernamee,
}: any) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  console.log(localStorage.getItem('accessToken'))

  const history = useHistory()

  async function handleClick(username: any, password: any) {
    const user = {
      username: username,
      encryptedPassword: password,
    } as AuthenticationDTO
    var response = null
    try {
      response = await authService.authenticate({ authenticationDTO: user })
      localStorage.setItem('accessToken', response.accessToken as any)
      localStorage.setItem('refreshToken', response.refreshToken as any)
      handleResponse(response)
      handleRefreshToken(response.refreshToken?.token)
      handleUser(jwt_decode(response.accessToken?.token as any))
    } catch (e) {
      console.log(e)
    }
    if (response) history.push('/')

    console.log(response)
  }

  async function responseGoogle(response: any) {
    const request = {
      tokenId: response.tokenId,
    } as GoogleAuthDTO

    var authResponse = null
    try {
      authResponse = await authService.authenticateWithGoogle({
        googleAuthDTO: request,
      })
      handleResponse(authResponse)
      handleUser(jwt_decode(authResponse.accessToken?.token as any))
    } catch (e) {
      console.log(e)
    }
    if (authResponse) history.push('/')
  }

  return (
    <Container>
      <Content>
        <CustomGoogleLogin
          clientId="75898054002-q3s2968b0374o5jmke2bt2tupacocgjk.apps.googleusercontent.com"
          buttonText="Log in with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <CustomInput
          id="outlined-basic"
          label="login"
          variant="outlined"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
        ></CustomInput>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          style={{
            width: '100%',
            marginTop: 20,
            marginBottom: 20,
            color: '#000000',
            outline: 'none',
          }}
          classes={{ notchedOutline: 'visible' }}
          onChange={(e: any) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                edge="end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <CustomButton onClick={() => handleClick(username, password)}>
          login
        </CustomButton>
        <Info>
          or <Link onClick={() => history.push('/signup')}>sign up</Link>
        </Info>
        <Info>
          <Link onClick={() => history.push('/reset-password')}>
            reset password
          </Link>
        </Info>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: rgb(34, 193, 195);
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 0.5) 0%,
    rgba(253, 187, 45, 0.5) 100%
  );

  display: flex;
  justify-content: center;
  align-items: center;
`

const CustomInput = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`

const CustomButton = styled.button`
  border: 2px solid rgba(75, 128, 207, 1);
  background: transparent;
  height: 35px;
  border-radius: 8px;
  color: rgba(75, 128, 207, 1);
  width: 35%;
  cursor: pointer;
  font-size: 20px;
  line-height: 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;

  :hover {
    background: rgba(75, 128, 207, 0.5);
  }
`

const Content = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Info = styled.p`
  font-size: 18px;
  line-height: 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
`

const Link = styled.strong`
  cursor: pointer;
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: rgba(75, 128, 207, 1);
`

const CustomGoogleLogin = styled(GoogleLogin)`
  width: 100%;
  margin-bottom: 20px;
`
