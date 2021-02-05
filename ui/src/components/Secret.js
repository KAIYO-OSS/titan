import React from "react";
import Search from "./Search";


export default function Secret() {
    return (
        <div>
            <Search onChange={() => {console.log()}} />
        </div>
    )
}