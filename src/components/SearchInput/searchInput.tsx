import React from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'

import SearchInput1 from 'assets/icons/Interface/searchInput1.svg'
import SearchInput2 from 'assets/icons/Interface/searchInput2.svg'

type SearchInputProps = {
  title: string
  icon: string
}

type ContainerProps = {
  isBigScreen: boolean
}

export default function SearchInput({ title, icon }: SearchInputProps) {
  const isBigScreen = useMediaQuery({ query: '(min-width: 850px)' })

  return (
    <Container isBigScreen={isBigScreen}>
      <IconContainer>
        {icon === 'first' ? (
          <img width={23} src={SearchInput1} alt={''}></img>
        ) : (
          <img width={23} src={SearchInput2} alt={''}></img>
        )}
      </IconContainer>
      <Input placeholder={title}></Input>
    </Container>
  )
}

const Container = styled.div<ContainerProps>`
  display: flex;
  height: 50px;
  width: ${(props) => (props.isBigScreen ? '375px' : '100%')};
  align-self: center;
  flex-direction: row;
  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  margin-bottom: 15px;
`

const IconContainer = styled.div`
  display: flex;
  flex: 0.15;
  height: 50px;
  justify-content: center;
  align-items: center;
`

const Input = styled.input`
  top: 0;
  flex: 0.85;
  font-size: 20px;
  font-weight: 500;
  width: 100%;
  background: rgba(245, 255, 245, 0.9);
  outline: none;
  appearance: none;
  box-shadow: none;
  border-radius: 12px;
  border: 0px;
  line-height: 50px;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ::placeholder {
    opacity: 1;
    color: black;
  }
`
