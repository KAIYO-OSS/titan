import React, {useState} from "react";
import {Input} from "antd";


export default function Search(props) {

    return (
        <div>
            <Input style={{maxWidth : "300px"}} placeholder="Search" onChange={props.onChange} />
        </div>
    )
}