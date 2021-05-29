import React, {useState} from "react";
import {Input} from "antd";


export default function Search(props) {

    return (
        <div style={{backgroundColor : "#f7f7f7", minHeight : "60px", marginTop: "2px", marginBottom : "25px"}}>
            <Input style={{maxWidth : "300px", marginTop : "10px", float : "right", marginRight : "10px", minHeight : '40px'}} placeholder={props.searchText} onChange={props.onChange} />
        </div>
    )
}
