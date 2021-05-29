import React from 'react';
import NavbarComponent from "./Navbar";
import View from "./View";
import {withRouter} from "react-router";

export function Landing() {

    return (
        <div style={{backgroundColor : 'white', minHeight : '100vh'}}>
            <NavbarComponent />
            <View />
        </div>
    );
}

export default withRouter(Landing);
