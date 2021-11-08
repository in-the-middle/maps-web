import React from "react";
import Map from "components/Map/Map";

function Main(props: any) {
  const {
    user,
    handleResponse,
    handleUser,
    handleRefreshToken,
    removeRefreshToken,
    response,
    setUser,
    setResponse,
    cookies,
  } = props;
  return (
    <div>
      <Map
        user={user}
        handleResponse={handleResponse}
        handleUser={handleUser}
        handleRefreshToken={handleRefreshToken}
        removeRefreshToken={removeRefreshToken}
        response={response}
        setUser={setUser}
        setResponse={setResponse}
        cookies={cookies}
      />
    </div>
  );
}

export default Main;
