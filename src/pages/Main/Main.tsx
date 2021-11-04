import React from 'react'
import Map from 'components/Map/Map'

function Main(props: any) {
  const {
    user,
    handleResponse,
    handleUser,
    handleRefreshToken,
    removeRefreshToken,
    response,
  } = props
  return (
    <div>
      <Map
        user={user}
        handleResponse={handleResponse}
        handleUser={handleUser}
        handleRefreshToken={handleRefreshToken}
        removeRefreshToken={removeRefreshToken}
        response={response}
      />
    </div>
  )
}

export default Main
