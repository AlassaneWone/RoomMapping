import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

function Zoom() {
    const [maps, setMaps] = useState([]);
    const [selectedMap, setSelectedMap] = useState(null);
    const [fetchData, setfetchData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchMaps = (uid) => {
        fetch(`${apiUrl}/api/map/${uid}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setIsLoaded(true);
                setfetchData(data);
            })
            .catch((error) => {
                console.error("Error fetching maps:", error);
            });
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchMaps(uid);
            } else {
                redirect("/login");
            }
        });
    }, []);

    const handleDropdownChange = (event) => {
        const selectedMapId = event.target.value;
        const selectedMap = fetchData.find((map) => map.mapId === selectedMapId);
        setSelectedMap(selectedMap);
    };

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();

        return (
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
                <Form>
                    <Form.Select value={selectedMap ? selectedMap.mapId : "default"} onChange={handleDropdownChange}>
                        <option value="default">Sélectionnez une Map</option>
                        {fetchData.map((map) => (
                            <option key={map.mapId} value={map.mapId}>
                                {map.url.substring(map.url.lastIndexOf("/") + 1)}
                            </option>
                        ))}
                    </Form.Select>
                </Form>
                <Button variant="primary" onClick={() => zoomIn()}>
                    Zoom In
                </Button>{" "}
                <Button variant="secondary" onClick={() => zoomOut()}>
                    Zoom Out
                </Button>{" "}
                <Button variant="danger" onClick={() => resetTransform()}>
                    Reset
                </Button>
            </div>
        );
    };

    const containerStyle = {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
    };

    const imageStyle = {
        width: "100%",
        height: "auto",
        objectFit: "contain",
    };

    return (
        <div className="Zoomzoom" style={containerStyle}>
            <TransformWrapper defaultScale={1}>
                <TransformComponent>
                    <img
                        src={selectedMap ? selectedMap.url : ""}
                        alt={selectedMap ? selectedMap.mapName : "Veuillez sélectionner une Map"}
                        style={imageStyle}
                    />
                </TransformComponent>
                <Controls />
            </TransformWrapper>
        </div>
    );
}

export default Zoom;