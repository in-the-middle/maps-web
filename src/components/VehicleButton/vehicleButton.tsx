import React from 'react'
import styled from 'styled-components'

import Car from 'assets/icons/Interface/car.svg'
import Bike from 'assets/icons/Interface/bike.svg'
import Public from 'assets/icons/Interface/public.svg'
import Walking from 'assets/icons/Interface/walking.svg'

type SearchInputProps = {
  onPress: Function
  icon: string
}

export default function vehicleButton({ onPress, icon }: SearchInputProps) {
  return (
    <Container onClick={() => onPress()}>
      <>
        {icon === 'car' ? <img src={Car} alt={''}></img> : null}
        {icon === 'bike' ? <img src={Bike} alt={''}></img> : null}
        {icon === 'walking' ? <img src={Walking} alt={''}></img> : null}
        {icon === 'public' ? <img src={Public} alt={''}></img> : null}
      </>
    </Container>
  )
}

const Container = styled.button`
  height: 50px;
  display: flex;
  align-self: center;
  flex-direction: row;
  margin-left: 7.5px;
  margin-right: 7.5px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  border: 0px;

  :hover {
    background: rgba(200, 245, 200, 0.9);
    cursor: pointer;
  }
`
