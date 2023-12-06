import "../styles/MapEditor.css";

import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Image as KonvaImage, Text } from 'react-konva';
import { Box, Radio, RadioGroup, FormControl, FormControlLabel, InputLabel, MenuItem,
    Select, Typography, Slider, Grid, Button, Alert, CircularProgress } from "@mui/material";
import DrawIcon from '@mui/icons-material/Draw';
import InterestsIcon from '@mui/icons-material/Interests';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";

const MapEditor = () => {
    /**
     * MapEditor component is a functional component that uses hooks for state and side effects.
     * 
     * It uses the useNavigate and useLocation hooks from react-router-dom for navigation and location state.
     * It also uses a custom hook, useMapForKonva, to load an image for use in a Konva stage.
     * 
     * The component maintains several state variables using the useState hook:
     * - stageSize: to store the size of the Konva stage.
     * - open, mapName, mapNameError, animLoading: to manage the map name dialog and loading animation.
     * - tool: to store the currently selected drawing tool.
     * - lines, lineColor, lineWidth: to manage the lines drawn on the Konva stage.
     * - eraserWidth: to store the width of the eraser tool.
     * - shapes, shapeType, drawingShape, shapeColor: to manage the shapes drawn on the Konva stage.
     * - text: to manage the text objects on the Konva stage.
     */
    const navigate = useNavigate();

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

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;

    /**
     * The stageSizeObject is an object that contains the width and height of the Konva stage.
     */
    const stageSizeObject = {
        width: Number(stageSize.split('x')[0]),
        height: Number(stageSize.split('x')[1])
    };

    /**
     * Event handler for changing the size of the Konva stage.
     * 
     * @param {Event} event - The event object from the change event.
     */
    const handleSizeChange = (event) => {
        setStageSize(event.target.value);
    };

    /**
     * Custom React hook to fetch a map image and prepare it for use with Konva.
     * @param {string} uid - The connected user ID.
     * @param {string} mapId - The selected map ID.
     * @returns {Object} The image object for use with Konva.
     */
    const useMapForKonva = (uid, mapId) => {
        const [imageObj, setImageObj] = useState(null);
    
        useEffect(() => {
            fetch(`http://localhost:5000/api/map/${uid}/maps/${mapId}`)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error("There has been a problem with your fetch operation")
                })
                .then(data => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.src = data.url;
                    img.onload = () => {
                        setImageObj(img);
                    };
                })
                .catch((error) => {
                    console.log(error);
                });
        }, [uid, mapId]);
    
        return imageObj;
    }

    const { state } = useLocation();
    const KonvaMap = useMapForKonva(uid, state);

    /**
     * useEffect hook to trigger a re-render of the Konva stage whenever the lines or shapes state changes.
     * The dependency array includes lines and shapes, so this effect runs whenever either of these state variables changes.
     */
    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.batchDraw();
        }
    }, [lines, shapes]);

    /**
     * Asynchronous function to save the current state of the Konva stage as an image to the server.
     * 
     * @param {function} navigate - The function to navigate to different pages in the app.
     */
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

    /**
     * This function is called when an object on the stage is clicked.
     * If the currently selected tool is the eraser and the user is currently drawing,
     * it removes the clicked object from the shapes and text state arrays.
     * 
     * @param {number} index - The index of the clicked object in the shapes and text state arrays.
     */
    const handleObjectClick = (index) => {
        if (tool === 'eraser' && isDrawing.current) {
            setShapes(prevShapes => prevShapes.filter((shape, i) => i !== index));
            setText(prevText => prevText.filter((t, i) => i !== index));
        }
    };

    /**
     * Event handler for the mouse down event on the Konva stage.
     *
     * This function is called when the mouse button is pressed down on the stage.
     * It gets the current pointer position and updates the state based on the currently selected tool.
     *
     * If the pen or eraser tool is selected, it starts a new line at the pointer position.
     * If the shape tool is selected, it starts a new shape at the pointer position.
     * If the text tool is selected, it starts a new text box at the pointer position.
     *
     * @param {Event} e - The event object from the mouse down event.
     */
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
    
    /**
     * Event handler for the mouse move event on the Konva stage.
     *
     * This function is called when the mouse is moved on the stage.
     * It gets the current pointer position and updates the state based on the currently selected tool and whether the user is currently drawing.
     *
     * If the pen or eraser tool is selected, it adds the pointer position to the points of the current line.
     * If the shape tool is selected, it updates the dimensions of the current shape based on the pointer position.
     * If the text tool is selected, it updates the dimensions of the current text box based on the pointer position.
     *
     * @param {Event} e - The event object from the mouse move event.
     */
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
    
    /**
     * Event handler for the mouse up event on the Konva stage.
     *
     * This function is called when the mouse button is released on the stage.
     * It updates the state based on the currently selected tool and whether the user was drawing.
     *
     * If the user was drawing a shape, it adds the shape to the shapes state and resets the drawingShape state.
     * If the text tool was selected, it prompts the user for the text of the text box and updates the last text box in the text state with the new text.
     */
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
            {/* Container for the tools */}
            <div className="tools">
                <h2 className="edit-h2">Edition de carte</h2>
                {/* Container for the map size select */}
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
                {/* Container for the tool radio buttons */}
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
                {/* Container for the save button */}
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
            {/* Konva stage for the map */}
            <Stage className="konva" width={stageSizeObject.width} height={stageSizeObject.height} 
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
            >
                <Layer>
                    {/* Layer for the map */}
                    <KonvaImage 
                        image={KonvaMap}
                        width={stageSizeObject.width}
                        height={stageSizeObject.height}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={1}
                    />
                </Layer>
                <Layer ref={layerRef}>
                    {/* Layer for the drawings */}
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