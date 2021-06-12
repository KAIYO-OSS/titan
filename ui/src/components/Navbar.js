import React, {useEffect} from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useHistory} from "react-router";
import {auth, googleProvider} from "../config/firebase";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function NavbarComponent() {

    const history = useHistory();

    useEffect(async () => {
        // await sleep(45000)
        if (localStorage.getItem("expireAt") > Date.now() && localStorage.getItem("token")) return
        await auth.signInWithPopup(googleProvider).then(result => {
            debugger
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("expireAt", Date.now() + 10000)
        })
    }, [])

    const logout = () => {
        history.push("/login")
    }
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">Deployment Center</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
