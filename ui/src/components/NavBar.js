import React, {useEffect, useState} from "react";
import {Button, Menu} from 'antd';
import {useHistory} from "react-router";


export default function NavBar(props) {
    const [current, setCurrent] = useState("workspace")
    const history = useHistory();
    useEffect(() => {
        if (localStorage.getItem("x-kaiyo-token") === null) {
            history.push("/login")
        }
    }, [])

    const handleClick = (e) => {
        setCurrent(e.key);
        props.currentState(e.key)
    }
    const logout = () => {
        localStorage.removeItem("x-kaiyo-token");
        history.push("/login")
    }

    return (
        <div>
            <Menu theme="dark" className="sw-menu" style={{}} onClick={handleClick} selectedKeys={[current]} mode="horizontal">

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