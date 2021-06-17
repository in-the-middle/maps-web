import React from 'react'
import 'components/ConfirmButton/ConfirmButton.css'

interface ConfirmButtonProps {
  onClick: Function
}

function ConfirmButton(Props: ConfirmButtonProps) {
  return (
    <div className="test">
      <button className="test-b" onClick={Props.onClick()}>
        Test
      </button>
    </div>
  )
}

export default ConfirmButton
