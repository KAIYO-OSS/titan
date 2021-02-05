import React from "react";
import 'antd/dist/antd.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";

function App() {
  return (
    <Router>
      <Route exact path={"/login"}>
        <Login />
      </Route>
        <Route exact path={"/"}>
            <Landing />
        </Route>
    </Router>
  );
}

export default App;
