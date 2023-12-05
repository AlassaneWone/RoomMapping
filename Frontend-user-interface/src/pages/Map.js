import React from "react"

export default function Map() {
    const queryParameters = new URLSearchParams(window.location.search)
    const type = queryParameters.get("type")
    const mapid = queryParameters.get("mapid")

    return (
        <div>
            {type === 'static' &&
            <p>Type: static</p>}
            <p>Name: {mapid}</p>
        </div>
    )
}