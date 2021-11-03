import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import authService from 'components/apiDeclaration/apiDeclaration'
import jwtDecode from 'jwt-decode'

import styled from 'styled-components'

import { UserDTO } from '../../authServiceApi/model'
import MediaButton from 'components/MediaButton/MediaButton'

import { AuthenticationDTO } from '../../authServiceApi/model'

import Apple from 'assets/icons/Interface/apple.svg'
import Google from 'assets/icons/Interface/google.svg'
import Facebook from 'assets/icons/Interface/facebook.svg'

export default function Signup({
  handleUser,
  handleResponse,
  res,
  usernamee,
}: any) {
  const [username, setUsername] = useState('enter username')
  const [firstName, setFirstName] = useState('enter first name')
  const [lastName, setLastName] = useState('enter last name')
  const [password, setPassword] = useState('enter password')
  const [email, setEmail] = useState('enter email')
  const [code, setCode] = useState('')
  const [userCreated, setUserCreated] = useState(false)
  const [userID, setUserID] = useState('')
  const [error, setError] = useState<any>(null)

  const history = useHistory()

  useEffect(() => {
    console.log(userCreated)
  }, [])

  async function handleClick(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const newUser = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      encryptedPassword: password,
    } as UserDTO
    console.log(newUser)
    try {
      const response = await authService.register({ userDTO: newUser })
      console.log(response)
      if (
        response === 'EMAIL_ALREADY_EXISTS' ||
        response === 'USERNAME_ALREADY_EXISTS' ||
        response === 'WEAK_PASSWORD'
      ) {
        setError(response)
        return
      }
      if (response) setUserCreated(true)
    } catch (e) {
      console.log(e)
    }
  }

  async function resendCode() {
    try {
      const response = await authService.sendEmailCode({
        queryParams: {
          id: userID,
        },
      })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  async function confirmEmail(code: any) {
    const user = {
      username: username,
      encryptedPassword: password,
    } as AuthenticationDTO
    var response = null
    try {
      response = await authService.authenticate({ authenticationDTO: user })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
    const loggedUser: any = jwtDecode(response?.accessToken?.token as any)
    console.log(loggedUser.userId)
    setUserID(loggedUser.userId)
    const userID: string | undefined = loggedUser.userId
    console.log(code)
    try {
      response = await authService.verifyEmail({
        queryParams: {
          id: userID,
          emailCode: code,
        },
      })
      console.log(response)
      if (response === 'VERIFIED') history.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container>
      <Content>
        {!userCreated ? (
          <div>
            <CustomInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsername('')}
              placeholder="enter username"
            ></CustomInput>
            <CustomInput
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFirstName('')}
              placeholder="enter first name"
            ></CustomInput>
            <CustomInput
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setLastName('')}
              placeholder="enter last name"
            ></CustomInput>
            <CustomInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmail('')}
              placeholder="enter password"
            ></CustomInput>
            <CustomInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassword('')}
              placeholder="enter password"
            ></CustomInput>
            <CustomButton
              onClick={() =>
                handleClick(username, firstName, lastName, email, password)
              }
            >
              sign up
            </CustomButton>
            <Info>
              or <Link onClick={() => history.push('/login')}>log in</Link>
            </Info>
            {error ? (
              <ErrorMessage>
                {error.includes('EMAIL')
                  ? 'Email already exists'
                  : error.includes('USERNAME')
                  ? 'Username already exists'
                  : 'Weak password'}
              </ErrorMessage>
            ) : null}
          </div>
        ) : (
          <div>
            <CustomInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onFocus={() => setCode('')}
              placeholder="enter code"
            ></CustomInput>

            <CustomButton onClick={() => confirmEmail(code)}>ok</CustomButton>
            <CustomButton onClick={() => resendCode()}>
              resend code
            </CustomButton>
          </div>
        )}
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

const CustomInput = styled.input`
  width: 80%;
  margin-bottom: 20px;
  background: transparent;
  height: 45px;
  border-radius: 12px;
  box-sizing: border-box;
  border: 2px solid black;
  outline: none;

  padding: 0 15px 0 15px;
  font-size: 20px;
  line-height: 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;

  :focus {
    border: 3px solid black;
  }
`

const CustomButton = styled.button`
  border: 2px solid rgba(75, 128, 207, 1);
  background: transparent;
  height: 35px;
  width: 100px;
  border-radius: 8px;
  color: rgba(75, 128, 207, 1);
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

const ErrorMessage = styled.p``
