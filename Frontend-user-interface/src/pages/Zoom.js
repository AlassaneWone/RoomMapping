import React from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import "../styles/Zoom.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Importez le fichier CSS de Bootstrap

function Zoom({ imageUrl }) {
    // Image URL used for tests
    // imageUrl = "https://roommappingbucket.s3.eu-north-1.amazonaws.com/de_mirage-map-callouts.jpg"

    return (
        <div className="Zoomzoom">
            <TransformWrapper defaultScale={1}>
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <TransformComponent>
                            <img src={imageUrl} alt="Image" />
                        </TransformComponent>
                        <div className="controls">
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
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default Zoom;