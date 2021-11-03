import React, { useState } from 'react'

import authService from 'components/apiDeclaration/apiDeclaration'
import { useHistory } from 'react-router'

import styled from 'styled-components'

export default function ResetPassword() {
  const [email, setEmail] = useState('enter your email')
  const [code, setCode] = useState('enter code')
  const [codeSended, setCodeSended] = useState(false)
  const [newPassword, setNewPassword] = useState('enter new password')
  const [error, setError] = useState<any>(null)

  const history = useHistory()

  async function sendCode(email: any) {
    console.log(email)
    var response = null
    try {
      response = await authService.sendPasswordEmail({
        queryParams: {
          email: email,
        },
      })
    } catch (e) {
      console.log(e)
    }
    if (response) setCodeSended(true)
  }

  async function handleConfirm() {
    var response = null
    try {
      response = await authService.resetPassword({
        queryParams: {
          email: email,
          emailCode: code,
          newPassword: newPassword,
        },
      })
      if (response === 'PASSWORD_CHANGED') history.push('/')
      else setError(response)
    } catch (e) {
      console.log(e)
    }
    console.log(response)
  }

  return (
    <Container>
      <Content>
        {!codeSended ? (
          <div>
            <CustomInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmail('')}
            ></CustomInput>
            <CustomButton onClick={() => sendCode(email)}>
              send code
            </CustomButton>
          </div>
        ) : (
          <div>
            <CustomInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onFocus={() => setCode('')}
            ></CustomInput>
            <CustomInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setNewPassword('')}
            ></CustomInput>
            <CustomButton onClick={() => handleConfirm()}>confirm</CustomButton>
            {error ? (
              <ErrorMessage>
                {error === 'WRONG_CODE' ? 'Wrong code' : 'Weak password'}
              </ErrorMessage>
            ) : null}
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
  width: 100%;
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
  border-radius: 8px;
  color: rgba(75, 128, 207, 1);
  width: 40%;
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

const ErrorMessage = styled.p``
