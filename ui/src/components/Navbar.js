import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";

export default function NavbarComponent() {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Kaiyo Deployment Center</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Select Cluster" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Cluster 1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Cluster 2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Cluster 3</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                         <Nav.Link onClick={() => console.log("click")}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
