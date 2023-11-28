import "../styles/MapEditor.css";

import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import { Box, Radio, RadioGroup, FormControl, FormControlLabel, InputLabel, MenuItem,
    Select, Typography, Slider, Grid, Button, Alert, CircularProgress } from "@mui/material";
import DrawIcon from '@mui/icons-material/Draw';
import InterestsIcon from '@mui/icons-material/Interests';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";

const useMapForKonva = (map) => {
    const [image] = useImage(map);
    return image;
}

const MapEditor = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const map = useMapForKonva(state);

    const [stageSize, setStageSize] = useState("500x500");

    const [open, setOpen] = useState(false);
    const [mapName, setMapName] = useState('');
    const [mapNameError, setMapNameError] = useState(null);
    const [animLoading, setAnimLoading] = useState(false);

    const [tool, setTool] = useState('pen');

    const [lines, setLines] = useState([]);
    const [lineColor, setLineColor] = useState('#df4b26');
    const [lineWidth, setLineWidth] = useState(2);

    const [eraserWidth, setEraserWidth] = useState(30);

    const [shapes, setShapes] = useState([]);
    const [shapeType, setShapeType] = useState('');
    const [drawingShape, setDrawingShape] = useState(null);
    const [shapeColor, setShapeColor] = useState('#df4b26');
    
    const [text, setText] = useState([]);
    const [textSize, setTextSize] = useState(25);
    const [textColor, setTextColor] = useState('#df4b26');

    const isDrawing = useRef(false);
    const layerRef = useRef(null);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.batchDraw();
        }
    }, [lines, shapes]);

    const saveImageToServer = async (navigate) => {
        const auth = getAuth();
        const user = auth.currentUser;

        const uid = user.uid;

        if (!/^[A-Za-z0-9_-]{2,}$/.test(mapName)) {
            setMapNameError('Nom invalide. Pas de caractères spéciaux et minimum 2 caractères.');
            return;
        }

        setAnimLoading(true);

        if (layerRef.current) {
            const dataUrl = layerRef.current.getStage().toDataURL();
            const blob = await (await fetch(dataUrl)).blob();
            const formData = new FormData();
            formData.append('file', blob, mapName + '.png');
            fetch(`http://localhost:5000/api/${uid}/upload`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.text())
            .then(data => {
                console.log(data)
                setTimeout(() => {
                    setAnimLoading(false);
                    navigate('/maplist')
                }, 2500);
            })
            .catch(error => {
                console.error(error)
                setAnimLoading(false);
            });
        }
    };

    // Convertir la taille de la scène en un objet lorsque vous en avez besoin
    const stageSizeObject = {
        width: Number(stageSize.split('x')[0]),
        height: Number(stageSize.split('x')[1])
    };

    const handleSizeChange = (event) => {
        setStageSize(event.target.value);
    };

    const handleObjectClick = (index) => {
        if (tool === 'eraser' && isDrawing.current) {
            setShapes(prevShapes => prevShapes.filter((shape, i) => i !== index));
            setText(prevText => prevText.filter((t, i) => i !== index));
        }
    };

    const handleMouseDown = (e) => {
        const point = e.target.getStage().getPointerPosition();

        if (tool === 'pen' || tool === 'eraser') {

            isDrawing.current = true;
            setLines([...lines, { tool, points: [point.x, point.y], color: lineColor, width: lineWidth }])
        } else if (tool === 'shape') {

            isDrawing.current = true;
            let shape;
            if (shapeType === 'rectangle') {
                shape = { type: 'Rect', x: point.x, y: point.y, width: 0, height: 0, color: shapeColor };
            } else if (shapeType === 'circle') {
                shape = { type: 'Circle', x: point.x, y: point.y, radius: 0, color: shapeColor };
            }
        
            if (shape) {
                setDrawingShape(shape);
            }
        } else if (tool === 'txt') {
            isDrawing.current = true;
            const rect = { x: point.x, y: point.y, width: 100, height: 50, text: '' };
            setText(prevText => [...prevText, rect]);
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
            }
          
            setDrawingShape(shape);
        } else if (tool === 'txt') {
            setText(text.map((t, i) => {
                if (i === text.length - 1) {
                    return { ...t, width: Math.max(1, point.x - t.x), height: Math.max(1, point.y - t.y) };
                } else {
                    return t;
                }
            }));
        }
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
        if (drawingShape) {
          setShapes(prevShapes => [...prevShapes, drawingShape]);
          setDrawingShape(null);
        }
        if (tool === 'txt') {
            const newText = window.prompt('Entrez le texte de la zone de texte:');
            setText(text.map((t, i) => {
                if (i === text.length - 1) {
                    return { ...t, text: newText, color: textColor, size: textSize };
                } else {
                    return t;
                }
            }));
        }
            
    };

    return (
        <div className="map-editor">
            <div className="tools">
                <h2 className="edit-h2">Edition de carte</h2>
                <Box sx={{ minWidth: 120 }} className="map-size-select">
                    <FormControl fullWidth>
                        <InputLabel id="size-select-lable">Taille de carte</InputLabel>
                        <Select
                            labelId="size-select-label"
                            id="size-select"
                            value={stageSize}
                            label="Taille de carte"
                            aria-label="Taille de carte"
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
                                <Grid item xs={5}>
                                    <Typography id="input-slider" gutterBottom>Epaisseur</Typography>
                                    <Slider valueLabelDisplay="auto" min={0} max={10} value={lineWidth} onChange={(e, newValue) => setLineWidth(newValue)}/>
                                </Grid>
                                <Grid item xs={1}>
                                    <input id="colorPickerPencil" data-testid="colorPickerPencil" type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} style={{ marginLeft: '60px', marginTop: '20px' }} />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControlLabel value="shape" control={<Radio />} label={<><span>Formes </span><InterestsIcon /></>} />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="shape-select-label">Choisir</InputLabel>
                                        <Select
                                            labelId="shape-select-label"
                                            id="shape-select"
                                            value={shapeType}
                                            label="Choix de la forme"
                                            onChange={(e) => setShapeType(e.target.value)}
                                        >
                                            <MenuItem value="rectangle">Rectangle</MenuItem>
                                            <MenuItem value="circle">Cercle</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}>
                                    <input id="colorPickerShape" type="color" value={shapeColor} onChange={(e) => setShapeColor(e.target.value)} style={{ marginLeft: '60px', marginTop: '20px' }} />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControlLabel value="txt" control={<Radio />} label={<><span>Zonne de texte </span><TextSnippetIcon /></>} />
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography id="input-slider" gutterBottom>
                                        Taille du texte
                                    </Typography>
                                    <Slider valueLabelDisplay="auto" min={10} max={100} value={textSize} onChange={(e, newValue) => setTextSize(newValue)} />
                                </Grid>
                                <Grid item xs={1}>
                                    <input id="colorPickerTxt" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ marginLeft: '60px', marginTop: '20px' }} />
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
                        Enregistrer
                    </Button>
                    <Dialog open={open} onClose={() => {setOpen(false); setMapNameError(null)}}>
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
                            {mapNameError && <Alert severity="error">{mapNameError}</Alert>}
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" variant="contained" onClick={() => setOpen(false)}>
                                Annuler
                            </Button>
                            {animLoading ?
                                <Box width={100}>
                                    <CircularProgress />
                                </Box>
                                :
                                <Button  variant="contained" onClick={() => saveImageToServer(navigate)}>
                                    Enregistrer
                                </Button>}
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
                        <Line key={i} points={line.points} stroke={line.color} strokeWidth={ line.tool === 'eraser' ? eraserWidth : line.width } tension={0.5} lineCap="round" globalCompositeOperation={ line.tool === 'eraser' ? 'destination-out' : 'source-over' } />
                    ))}
                    {shapes.map((shape, i) => {
                        if (shape.type === 'Rect') {
                            return <Rect key={i} stroke={shape.color} {...shape} onMouseEnter={() => handleObjectClick(i)} />;
                        } else if (shape.type === 'Circle') {
                            return <Circle key={i} stroke={shape.color} {...shape} onMouseEnter={() => handleObjectClick(i)} />;
                        } else {
                            return null;
                        }
                    })}
                    {text.map((t, i) => (
                        <Text key={i} x={t.x} y={t.y} text={t.text} width={t.width} height={t.height} fontSize={t.size} fill={t.color} stroke={t.color} onMouseEnter={() => handleObjectClick(i)} />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default MapEditor;