import React, {useEffect, useState} from "react";
import {Button, Menu} from 'antd';
import {useHistory} from "react-router";


export default function NavBar(props) {
    const history = useHistory();debugger
    console.log(props.state)
    useEffect(() => {
        if (localStorage.getItem("x-access-token") === null) {
            history.push("/login")
        }
    }, [])

    const handleClick = (e) => {
        history.push("/" + e.key)
    }
    const logout = () => {
        debugger
        localStorage.removeItem("x-access-token");
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            <Menu theme="dark" className="sw-menu" style={{}} onClick={handleClick}
                  // selectedKeys={[props.state]}
                  mode="horizontal">
                <Menu.Item key="workspace">
                    Workspace
                </Menu.Item>
                <Menu.Item key="service">
                    Services
                </Menu.Item>
                <Menu.Item key="deployment">
                    Deployments
                </Menu.Item>
                <Menu.Item key="secret">
                    Secrets
                </Menu.Item>
                <Button style={{float: "right", marginTop: "5px", marginRight: "30px"}} type={"danger"}
                        onClick={logout}>
                    Logout
                </Button>
            </Menu>
        </div>
    )
}
