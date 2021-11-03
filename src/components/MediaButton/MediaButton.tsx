import React from 'react'
import styled from 'styled-components'

export default function MediaButton(props: any) {
  const { value } = props
  return (
    <CustomMediaButton>
      <IconWrapper>
        <img src={props.icon} alt={''}></img>
      </IconWrapper>
      <TextWrapper> {value}</TextWrapper>
    </CustomMediaButton>
  )
}

const CustomMediaButton = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background: transparent;
  height: 45px;
  border-radius: 12px;
  box-sizing: border-box;
  border: 2px solid rgba(75, 128, 207, 1);
  color: rgba(75, 128, 207, 1);

  padding: 0 15px 0 15px;
  font-size: 20px;
  font-style: normal;
  line-height: 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IconWrapper = styled.div`
  flex: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextWrapper = styled.div`
  flex: 0.8;
`
