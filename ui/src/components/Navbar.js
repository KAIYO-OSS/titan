import React, {useEffect} from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useHistory} from "react-router";

export default function NavbarComponent() {

    const history = useHistory();

    useEffect(() => {

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
