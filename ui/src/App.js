import React, {useEffect} from "react";
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import CreateWorkspace from "./components/CreateWorkspace";
import ViewService from "./components/ViewService";
import NavBar from "./components/NavBar";
import Workspace from "./components/Workspace";
import Service from "./components/Service";
import Secret from "./components/Secret";
import Deployment from "./components/Deployment";
import {useParams} from "react-router";

function RenderMain() {
    let {type} = useParams();
    const renderSwitch = (type) => {
        switch (type) {
            case 'workspace':
                return <Workspace/>;
            case 'service':
                return <Service/>;
            case 'secret':
                return <Secret/>;
            case 'deployment':
                return <Deployment/>;
            default:
                return <div/>;
        }
    }
    return (
        <div>
            {renderSwitch(type)}
        </div>
    )
}


function App() {

    useEffect(() => {

    }, []);

    const appBar = () => {
        console.log(window.location.href.split("/"))
        let location = window.location.href.split("/")[window.location.href.split("/").length - 1];
        if (location === "login") return <div/>
        else if (location !== "workspace" && location !== "service" && location !== "secret" && location !== "deployment") {
            return <div/>
        }
        return <NavBar/>
    }
    return (
        <div>
            <Router>
                {appBar()}
                <Switch>
                    <Route exact path={"/"}>
                        <Redirect to={"/workspace"}/>
                    </Route>
                    <Route exact path={"/login"}>
                        <Login/>
                    </Route>
                    <Route exact path={"/workspaces/create"}>
                        <CreateWorkspace/>
                    </Route>
                    <Route exact path={"/services/:id"}>
                        <ViewService/>
                    </Route>
                    <Route exact path={"/:type"}>
                        <RenderMain/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
