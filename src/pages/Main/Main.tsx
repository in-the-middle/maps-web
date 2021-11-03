import React from 'react'
import Map from 'components/Map/Map'

function Main(props: any) {
  const { user } = props
  return (
    <div>
      <Map user={user} />
    </div>
  )
}

export default Main
