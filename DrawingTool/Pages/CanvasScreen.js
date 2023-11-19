import React, { useEffect, useCallback, useState, useRef } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import {
  Canvas,
  Path,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";
import io from 'socket.io-client';

const CanvasScreen = ({ route }) => {
  const { username, sessionId } = route.params;
  const [paths, setPaths] = useState([]);
  const socketRef = useRef(null);


  useEffect(() => {
    // Création de la connexion Socket.IO lors du montage du composant
    socketRef.current = io("http://10.99.5.116:3000");

    // Événement de joindre la session
    socketRef.current.emit("joinSession", { sessionId, username });

    socketRef.current.on("updateDrawing", (data) => {
      const drawingData = deserializePath(data.data);
      setPaths((currentPaths) => [...currentPaths, drawingData]);
    });  
    
    socketRef.current.on("clearCanvas", () => {
      setPaths([]);
    });
    // Gestionnaire de déconnexion lors du démontage du composant
    return () => {
      socketRef.current.disconnect();
    };
  }, [sessionId, username]);

  const serializePath = (path) => {
    cmdPath = path.toCmds();
    cmdPath[0][1] = cmdPath[1][1];
    cmdPath[0][2] = cmdPath[1][2];
    return {
      commands: cmdPath, // Convert the path to an array of commands
    };
  };
  
  // Deserialize
  const deserializePath = (data) => {
    const path = Skia.Path.Make();
    data.commands.forEach((command) => {
      switch (command[0]) {
        case 0: // moveTo
          path.moveTo(command[1], command[2]);
          break;
        case 1: // lineTo
          path.lineTo(command[1], command[2]);
          break;
        case 2: // quadTo
          path.quadTo(command[1], command[2], command[3], command[4]);
          break;
        // Add cases for other command types as needed
      }
    });
    return path;
  };

  const onDrawingStart = useCallback((touchInfo: TouchInfo) => {
    const { x, y } = touchInfo;

    setPaths((old) => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      return [...old, newPath];
    });
  }, []);

  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {
    const { x, y } = touchInfo;

    setPaths((currentPaths) => {
      const currentPath = Skia.Path.Make();
      currentPath.addPath(currentPaths[currentPaths.length - 1]);
      const lastPoint = currentPath.getLastPt();

      if (lastPoint) { // Check if there's a previous point
        const xMid = (lastPoint.x + x) / 2;
        const yMid = (lastPoint.y + y) / 2;

        currentPath.quadTo(xMid, yMid, x, y);

        const serializedPath = serializePath(currentPath);      
        socketRef.current.emit("updateDrawing", { sessionId, username, data: serializedPath });
      }

      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
  }, [socketRef, sessionId, username]);


  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const clearCanvas = () => {
    setPaths([]);
    socketRef.current.emit("clearCanvas", { sessionId });
    console.log("clear");
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canva} onTouch={touchHandler}>
          {paths.map((path, index) => (
            <Path
              key={index}
              path={path}
              color={"black"}
              style={"stroke"}
              strokeWidth={2}
            />
          ))}
        </Canvas>
        <Text style={styles.sessionCode}>{route.params.sessionId}</Text>
      </View>
      <Button title="Clear" onPress={clearCanvas} />
    </View>
  );
};

const styles = StyleSheet.create({
  canva: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  canvasContainer: {
    flex: 1,
    position: "relative",
  },
  sessionCode: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
});

export default CanvasScreen;
