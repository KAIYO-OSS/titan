import React, { useEffect } from 'react';
import { Nav, Navbar } from "react-bootstrap";


export default function NavbarComponent() {

    useEffect(async () => {
        // if (parseInt(localStorage.getItem("expireAt")) > Date.now() && localStorage.getItem("token")) return
        // await auth.signInWithPopup(googleProvider).then(result => {
        //     var credential = result.credential;
        //     var token = credential.accessToken;
        //     var user = result.user;
        //     localStorage.setItem("token", token)
        //     localStorage.setItem("user", JSON.stringify(user))
        //     localStorage.setItem("expireAt", Date.now() + 6000)
        // })
    }, [])

    const logout = () => {
        // auth.signOut()
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("expireAt")
        window.location.reload()
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
