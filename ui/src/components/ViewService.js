import React, {useState} from "react";
import {Button, PageHeader} from "antd";
import {useHistory} from "react-router";
import NavBar from "./NavBar";
import Editor from "@monaco-editor/react";


export default function ViewService() {
    const [current, setCurrent] = useState("service")
    const history = useHistory();

    return (
        <div>
            <NavBar currentState={setCurrent} state={current}/>
            <div style={{marginLeft: "30px", marginRight: "30px", marginTop: "30px"}}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => history.push("/")}
                    title="Service"
                    subTitle="Deploy Service"
                />
                <Editor
                    height="60vh"
                    width="50vw"
                    theme="Dawn"
                    defaultLanguage="yaml"
                    defaultValue="// some comment"
                />
                <Button type="primary">
                    Deploy Service
                </Button>
            </div>
        </div>
    )
}
