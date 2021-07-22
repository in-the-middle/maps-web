import React from 'react'
import L from 'leaflet'
import './Map.css'

interface MyInfoProps {
  onClick: Function
  visibility: any
  centerTime: Array<Number>
}

function MyInfo(Props: MyInfoProps) {
  const divRef = React.useRef(null as any)

  React.useEffect(() => {
    L.DomEvent.disableClickPropagation(divRef.current)
    L.DomEvent.disableScrollPropagation(divRef.current)
  })

  return (
    <div ref={divRef} className="zone">
      <div className="container">
        <ul className="list">
          {Props.centerTime.map((item, index) => {
            return (
              <li key={index}>
                Route {index + 1}: {Props.centerTime[index]}
              </li>
            )
          })}
        </ul>
      </div>
      <button
        className="buttonMain"
        onClick={() => Props.onClick(Props.visibility)}
      >
        Build
      </button>
    </div>
  )
}

export default MyInfo
