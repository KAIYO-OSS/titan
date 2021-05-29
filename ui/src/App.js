import React from "react";
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginComponent from "./components/Login";
import Landing from "./components/landing";


function App() {

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path={"/"}>
                        <Landing/>
                    </Route>
                    <Route exact path={"/login"}>
                        <LoginComponent/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
