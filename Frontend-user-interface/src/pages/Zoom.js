import React from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import "../styles/Zoom.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Importez le fichier CSS de Bootstrap

function Zoom({imageUrl}) {
    // Image URL used for tests
    //imageUrl = "https://roommappingbucket.s3.eu-north-1.amazonaws.com/de_mirage-map-callouts.jpg"

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
        return (
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
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
        position: "relative", // Ajout de cette ligne pour définir le positionnement relatif
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%"
    };

    const imageStyle = {
        width: "100%",
        height: "auto",
        objectFit: "contain"
    };

    return (
        <div className="Zoomzoom" style={containerStyle}>
            <TransformWrapper defaultScale={1}>
                <TransformComponent>
                    <img src={imageUrl} alt="Image" style={imageStyle} />
                </TransformComponent>
                <Controls />
            </TransformWrapper>
        </div>
    );
}

export default Zoom;