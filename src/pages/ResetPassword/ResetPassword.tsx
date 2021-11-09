import React, { useState } from "react";

import authService from "components/apiDeclaration/apiDeclaration";
import { useHistory } from "react-router";

import {
  IconButton,
  InputAdornment,
  TextField,
  Button,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import MediaQuery from "react-responsive";

import styled from "styled-components";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSended, setCodeSended] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  async function sendCode(email: any) {
    console.log(email);
    var response = null;
    try {
      response = await authService.sendPasswordEmail({
        queryParams: {
          email: email,
        },
      });
    } catch (e) {
      console.log(e);
    }
    if (response) setCodeSended(true);
  }

  async function handleConfirm() {
    var response = null;
    try {
      response = await authService.resetPassword({
        queryParams: {
          email: email,
          emailCode: code,
          newPassword: newPassword,
        },
      });
      if (response === "PASSWORD_CHANGED") history.push("/");
      else setError(response);
    } catch (e) {
      console.log(e);
    }
    console.log(response);
  }

  return (
    <Container>
      <MediaQuery minWidth={771}>
        <Content>
          {!codeSended ? (
            <div style={{ width: "100%" }}>
              <CustomInput
                id="outlined-basic"
                label="enter your email"
                variant="outlined"
                style={{ marginBottom: 20 }}
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                onFocus={() => setEmail("")}
              ></CustomInput>
              <CustomButton onClick={() => sendCode(email)}>
                send code
              </CustomButton>
            </div>
          ) : (
            <div>
              <CustomInput
                id="outlined-basic"
                label="code"
                variant="outlined"
                style={{ marginBottom: 20 }}
                value={code}
                onChange={(e: any) => setCode(e.target.value)}
              ></CustomInput>
              <FormControl
                variant="outlined"
                style={{
                  width: "100%",
                  marginBottom: 20,
                  color: "#000000",
                  outline: "none",
                }}
              >
                {!newPassword ? (
                  <InputLabel htmlFor="outlined-adornment-password">
                    new password
                  </InputLabel>
                ) : null}
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  classes={{ notchedOutline: "visible" }}
                  onChange={(e: any) => setNewPassword(e.target.value)}
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
              </FormControl>
              <CustomButton onClick={() => handleConfirm()}>
                confirm
              </CustomButton>
              {error ? (
                <ErrorMessage>
                  {error === "WRONG_CODE" ? "Wrong code" : "Weak password"}
                </ErrorMessage>
              ) : null}
            </div>
          )}
        </Content>
      </MediaQuery>
      <MediaQuery maxWidth={770}>
        <MobileContent>
          {!codeSended ? (
            <div style={{ width: "100%" }}>
              <CustomInput
                id="outlined-basic"
                label="enter your email"
                variant="outlined"
                style={{ marginBottom: 20 }}
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                onFocus={() => setEmail("")}
              ></CustomInput>
              <CustomButton onClick={() => sendCode(email)}>
                send code
              </CustomButton>
            </div>
          ) : (
            <div>
              <CustomInput
                id="outlined-basic"
                label="code"
                variant="outlined"
                style={{ marginBottom: 20 }}
                value={code}
                onChange={(e: any) => setCode(e.target.value)}
              ></CustomInput>
              <FormControl
                variant="outlined"
                style={{
                  width: "100%",
                  marginBottom: 20,
                  color: "#000000",
                  outline: "none",
                }}
              >
                {!newPassword ? (
                  <InputLabel htmlFor="outlined-adornment-password">
                    new password
                  </InputLabel>
                ) : null}
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  classes={{ notchedOutline: "visible" }}
                  onChange={(e: any) => setNewPassword(e.target.value)}
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
              </FormControl>
              <CustomButton onClick={() => handleConfirm()}>
                confirm
              </CustomButton>
              {error ? (
                <ErrorMessage>
                  {error === "WRONG_CODE" ? "Wrong code" : "Weak password"}
                </ErrorMessage>
              ) : null}
            </div>
          )}
        </MobileContent>
      </MediaQuery>
    </Container>
  );
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
`;

const CustomInput = styled(TextField)`
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
  font-family: "Montserrat", sans-serif;
  font-weight: 600;

  :focus {
    border: 3px solid black;
  }
`;

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
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  overflow: hidden;

  :hover {
    background: rgba(75, 128, 207, 0.5);
  }
`;

const Content = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MobileContent = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.p`
  cursor: pointer;
  font-size: 24px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: #eb5160;
`;
