import React from "react";
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Route,} from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Landing from "./components/Landing";
import CreateWorkspace from "./components/CreateWorkspace";
import ViewService from "./components/ViewService";

function App() {
    return (
        <Router>
            <Route exact path={"/login"}>
                <Login/>
            </Route>
            <Route exact path={"/"}>
                <Landing/>
            </Route>
            <Route exact path={"/workspace/create"}>
                <CreateWorkspace/>
            </Route>
            <Route exact path={"/service/:id"}>
                <ViewService/>
            </Route>
        </Router>
    );
}

export default App;
