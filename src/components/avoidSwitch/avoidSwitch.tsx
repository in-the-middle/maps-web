import React, { useState } from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'
import Switch from '@material-ui/core/Switch'

type SearchInputProps = {
  title: string
  enabled: boolean
  onPress: Function
}

export default function AvoidSwitch({
  title,
  enabled,
  onPress,
}: SearchInputProps) {
  const [isEnabled, setIsEnabled] = useState(enabled ? false : true)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(!isEnabled)
    onPress()
  }

  const BlueSwitch = withStyles({
    switchBase: {
      color: blue[300],
      '&$checked': {
        color: blue[500],
      },
      '&$checked + $track': {
        backgroundColor: blue[500],
      },
    },
    checked: {},
    track: {},
  })(Switch)

  return (
    <Container>
      <TextContainer>
        <Text>{title}</Text>
      </TextContainer>
      <SwitchContainer>
        <BlueSwitch
          checked={isEnabled}
          onChange={handleChange}
          name="checked"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </SwitchContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const Text = styled.div`
  flex: 1;
  font-size: 20px;
  line-height: 50px;
`

const SwitchContainer = styled.div`
  width: 50px;
  margin-right: 10px;
  display: flex;
  align-items: center;
`
