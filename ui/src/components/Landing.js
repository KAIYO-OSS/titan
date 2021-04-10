import React, {useState} from "react";
import NavBar from "./NavBar";
import Workspace from "./Workspace";
import Service from "./Service";
import Secret from "./Secret";
import Deployment from "./Deployment";


export default function Landing() {
    const [current, setCurrent] = useState("workspace")

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
                return <Workspace/>;
        }
    }
    return (
        <div>
            {/*<NavBar currentState={setCurrent} state={current}/>*/}
            <div style={{marginLeft: "30px", marginRight: "30px", marginTop: "30px"}}>
                {renderSwitch(current)}
            </div>
        </div>
    )
}
