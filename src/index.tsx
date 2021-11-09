import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "pages/Main/Main";
import Router from "pages/Router/Router";

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);
