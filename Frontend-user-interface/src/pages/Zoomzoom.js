import React from "react";
import {
    TransformWrapper,
    TransformComponent,
    useControls
} from "react-zoom-pan-pinch";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {redirect} from "react-router-dom";

function Map() {
    const queryParameters = new URLSearchParams(window.location.search)
    const type = queryParameters.get("type")
    const mapid = queryParameters.get("mapid")
    const [mapUrl, setMapUrl] = useState("")
    const [published, setPublished] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchMap = (uid, mapId) => {
        fetch(`http://localhost:5000/api/map/${uid}/maps/${mapId}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("There has been a problem with your fetch operation")
            })
            .then(data => {
                setMapUrl(data.url)
                setIsLoaded(true)
                setPublished(data.published)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        setIsLoaded(true)
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchMap(uid, mapid);
            } else {
                redirect('/login');
            }
        });
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>
    } else if (!published) {
        return <div>Map is not available for viewing</div>
    } else {
        return (
            <div>
                {type === 'static' &&
                <StaticMap map_url={mapUrl}/>}
                {type === 'interactive' &&
                <p>Awaiting completion of US</p>}
            </div>
        )
    }
}

function StaticMap(...props) {
    const Controls = () => {
        const {zoomIn, zoomOut, resetTransform} = useControls();
        return (
            <>
                <button onClick={() => zoomIn()}>Zoom In</button>
                <button onClick={() => zoomOut()}>Zoom Out</button>
                <button onClick={() => resetTransform()}>Reset</button>
            </>
        );
    };
    return (
        <TransformWrapper>
            <Controls/>
            <TransformComponent>
                <img
                    src={props[0].map_url}
                    alt="test"
                    width="100%"
                />
            </TransformComponent>
        </TransformWrapper>
    );
}

export default Map;
