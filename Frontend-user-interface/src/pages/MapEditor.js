import "../styles/MapEditor.css";

import React, { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { Box, Radio, RadioGroup, FormControl, FormControlLabel, InputLabel, MenuItem,
    Select, Typography, Slider, Grid, Button } from "@mui/material";
import DrawIcon from '@mui/icons-material/Draw';
import InterestsIcon from '@mui/icons-material/Interests';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";

const useMapForKonva = (map) => {
    const [image] = useImage(map);
    return image;
}

const MapEditor = () => {
    const { state } = useLocation();
    const map = useMapForKonva(state);

    const [stageSize, setStageSize] = useState("500x500");

    const [open, setOpen] = useState(false);
    const [mapName, setMapName] = useState('');

    const [tool, setTool] = useState('pen');
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [shapeType, setShapeType] = useState('');
    const [drawingShape, setDrawingShape] = useState(null);
    const [lineWidth, setLineWidth] = useState(2);
    const [eraserWidth, setEraserWidth] = useState(2);

    const isDrawing = useRef(false);
    const layerRef = useRef(null);

    // Convertir la taille de la scène en un objet lorsque vous en avez besoin
    const stageSizeObject = {
        width: Number(stageSize.split('x')[0]),
        height: Number(stageSize.split('x')[1])
    };

    const handleSizeChange = (event) => {
        setStageSize(event.target.value);
    };

    const handleShapeClick = (index) => {
        if (tool === 'eraser' && isDrawing.current) {
            setShapes(prevShapes => prevShapes.filter((shape, i) => i !== index));
        }
    };

    const saveAsPng = () => {
        // Obtenez une référence à votre scène Konva
        const stage = layerRef.current.getStage();
        // Convertissez le contenu de la scène en une URL de données PNG
        const dataUrl = stage.toDataURL();
        // Créez un nouvel élément de lien
        const link = document.createElement('a');
        // Définissez l'URL de données comme href du lien
        link.href = dataUrl;
        // Définissez l'attribut de téléchargement du lien pour définir le nom du fichier de l'image téléchargée
        link.download = mapName + '.png';
        // Déclenchez un clic sur le lien pour commencer le téléchargement
        link.click();
      };

    const handleMouseDown = (e) => {
        const point = e.target.getStage().getPointerPosition();

        if (tool === 'pen' || tool === 'eraser') {

            isDrawing.current = true;
            setLines([...lines, { tool, points: [point.x, point.y] }])
        } else if (tool === 'shape') {

            isDrawing.current = true;
            let shape;
            if (shapeType === 'rectangle') {
                shape = { type: 'Rect', x: point.x, y: point.y, width: 0, height: 0, stroke: 'red' };
            } else if (shapeType === 'circle') {
                shape = { type: 'Circle', x: point.x, y: point.y, radius: 0, stroke: 'red' };
            } else if (shapeType === 'straightLine') {
                shape = { type: 'Line', points: [point.x, point.y, point.x, point.y], stroke: 'red' };
            }
        
            if (shape) {
            setDrawingShape(shape);
            }
        }
    };
    
    const handleMouseMove = (e) => {
        // Ne pas dessiner si on n'est pas en mode dessin
        if (!isDrawing.current) return;
        const point = e.target.getStage().getPointerPosition();
    
        // Dessiner en fonction de l'outil sélectionné
        if (tool === 'pen' || tool === 'eraser') {
            let lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([point.x, point.y]);
    
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        } else if (tool === 'shape') {
            // Dessiner la forme sélectionnée
            let shape = { ...drawingShape };

            if (shapeType === 'rectangle') {
                shape.width = point.x - shape.x;
                shape.height = point.y - shape.y;
            } else if (shapeType === 'circle') {
                shape.radius = Math.sqrt(Math.pow(point.x - shape.x, 2) + Math.pow(point.y - shape.y, 2));
            } else if (shapeType === 'straightLine') {
                shape.points = [shape.points[0], shape.points[1], point.x, point.y];
            }
          
            setDrawingShape(shape);
        }
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
        if (drawingShape) {
          setShapes(prevShapes => [...prevShapes, drawingShape]);
          setDrawingShape(null);
        }
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
                            <MenuItem value="500x500">Petite</MenuItem>
                            <MenuItem value="800x800">Moyenne</MenuItem>
                            <MenuItem value="1000x1000">Grande</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box className="radio-tools">
                    <FormControl component="fieldset">
                        <RadioGroup value={tool} onChange={(e) => { setTool(prevTool => prevTool === e.target.value ? null : e.target.value); }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControlLabel value="pen" control={<Radio />} label={<><span>Pinceau </span><DrawIcon /></>} />
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
                                    <FormControlLabel value="shape" control={<Radio />} label={<><span>Formes </span><InterestsIcon /></>} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ width: 300 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="shape-select-label">Choix de la forme</InputLabel>
                                        <Select
                                            labelId="shape-select-label"
                                            id="shape-select"
                                            value={shapeType}
                                            label="Choix de la forme"
                                            onChange={(e) => setShapeType(e.target.value)}
                                        >
                                            <MenuItem value="rectangle">Rectangle</MenuItem>
                                            <MenuItem value="circle">Cercle</MenuItem>
                                            <MenuItem value="straightLine">Ligne droite</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControlLabel value="eraser" control={<Radio />} label={<><span>Gomme </span><BackspaceIcon /></>} />
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
                <Box className="map-save-button">
                    <Button onClick={() => setOpen(true)} variant="contained">
                        Enregister
                    </Button>
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Enregistrer la carte</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Veuillez entrer le nom de la carte.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nom de la carte"
                                type="text"
                                fullWidth
                                value={mapName}
                                onChange={e => setMapName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={saveAsPng}>
                                Enregistrer
                            </Button>
                        </DialogActions>
                    </Dialog>
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
                <Layer ref={layerRef}>
                    {/* Dessin en fonction de l'outil sélectionné */}
                    {lines.map((line, i) => (
                        <Line key={i} points={line.points} stroke="#df4b26" strokeWidth={ line.tool === 'eraser' ? eraserWidth : lineWidth } tension={0.5} lineCap="round" globalCompositeOperation={ line.tool === 'eraser' ? 'destination-out' : 'source-over' } />
                    ))}
                    {shapes.map((shape, i) => {
                        if (shape.type === 'Rect') {
                            return <Rect key={i} {...shape} onMouseEnter={() => handleShapeClick(i)} />;
                        } else if (shape.type === 'Circle') {
                            return <Circle key={i} {...shape} onMouseEnter={() => handleShapeClick(i)} />;
                        } else if (shape.type === 'straightLine') {
                            return <Line key={i} {...shape} onMouseEnter={() => handleShapeClick(i)} />;
                        } else {
                            return null
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    )
}

export default MapEditor;