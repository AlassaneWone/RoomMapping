import "../styles/MapEditor.css";

import React, { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import { Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem,
    Select, Typography, Slider, Grid } from "@mui/material";

const useMapForKonva = (map) => {
    const [image] = useImage(map);
    return image;
}

const MapEditor = () => {
    const { state } = useLocation();
    const map = useMapForKonva(state);

    const [stageSize, setStageSize] = useState("800x800");

    const [tool, setTool] = useState('pen');
    const [lines, setLines] = useState([]);
    const [lineWidth, setLineWidth] = useState(2);
    const [eraserWidth, setEraserWidth] = useState(2);

    const isDrawing = useRef(false);

    // Convertir la taille de la scène en un objet lorsque vous en avez besoin
    const stageSizeObject = {
        width: Number(stageSize.split('x')[0]),
        height: Number(stageSize.split('x')[1])
    };

    const handleSizeChange = (event) => {
        setStageSize(event.target.value);
    };

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };
    
    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
    
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
    
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <div className="map-editor">
            <div className="tools">
                <h2 className="edit-h2">Edition de carte</h2>
                {/* Choix de la taille de la carte */}
                <Box sx={{ minWidth: 120 }} className="map-size-select">
                    <FormControl fullWidth>
                        <InputLabel id="size-select-lable">Taille de carte</InputLabel>
                        <Select
                            labelId="size-select-label"
                            id="size-select"
                            value={stageSize}
                            label="Taille de carte"
                            onChange={handleSizeChange}
                        >
                            <MenuItem value="1000x1000">Grande</MenuItem>
                            <MenuItem value="800x800">Moyenne</MenuItem>
                            <MenuItem value="500x500">Petite</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box className="radio-tools">
                    <FormControl component="fieldset">
                        <RadioGroup value={tool} onChange={(e) => { setTool(prevTool => prevTool === e.target.value ? null : e.target.value); }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControlLabel value="pen" control={<Radio />} label="Pinceau" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ width: 300 }}>
                                        <Typography id="input-slider" gutterBottom>
                                            Epaisseur du trait
                                        </Typography>
                                        <Slider valueLabelDisplay="auto" min={0} max={10} value={lineWidth} onChange={(e, newValue) => setLineWidth(newValue)}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel value="eraser" control={<Radio />} label="Gomme" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ width: 300 }}>
                                        <Typography id="input-slider" gutterBottom>
                                            Epaisseur de la gomme
                                        </Typography>
                                        <Slider valueLabelDisplay="auto" min={0} max={100} value={eraserWidth} onChange={(e, newValue) => setEraserWidth(newValue)}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Box>
            </div>
            <Stage className="konva" width={stageSizeObject.width} height={stageSizeObject.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
            >
                <Layer>
                    {/* Zone de dessin */}
                    <KonvaImage 
                        image={map}
                        width={stageSizeObject.width}
                        height={stageSizeObject.height}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={1}
                    />
                </Layer>
                <Layer>
                    {/* Dessin en fonction de l'outil sélectionné */}
                    {lines.map((line, i) => (
                        <Line key={i} points={line.points} stroke="#df4b26" strokeWidth={ line.tool === 'eraser' ? eraserWidth : lineWidth } tension={0.5} lineCap="round" globalCompositeOperation={ line.tool === 'eraser' ? 'destination-out' : 'source-over' } />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default MapEditor;