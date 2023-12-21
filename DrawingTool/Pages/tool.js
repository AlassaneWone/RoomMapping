import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import {
  Canvas,
  Path,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";
import io from 'socket.io-client';

export default DrawingScreen = () => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const socket = io("http://192.168.0.90:3000");

    // Vous pouvez ajouter des écouteurs pour gérer les événements du serveur ici
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("updateDrawing", paths);

    // N'oubliez pas de fermer la connexion lorsque le composant est démonté
    return () => {
      socket.disconnect();
    };
  }, []); // Le tableau vide en tant que deuxième argument signifie que cet effet ne s'exécute qu'une seule fois après le montage initial

  

  const onDrawingStart = useCallback((touchInfo: TouchInfo) => {
    setPaths((old) => {
      const { x, y } = touchInfo;
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      return [...old, newPath];
    });
  }, []);

  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {
    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const currentPath = Skia.Path.Make();
      currentPath.addPath(currentPaths[currentPaths.length - 1]);
      const lastPoint = currentPath.getLastPt();
      const xMid = (lastPoint.x + x) / 2;
      const yMid = (lastPoint.y + y) / 2;

      currentPath.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
      
      socket.emit("updateDrawing", currentPath);

      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const clearCanvas = () => {
    setPaths([]);
    console("clear");
  };

  return (
    <View style={toolStyle.container}>
    <Canvas style={toolStyle.canva} onTouch={touchHandler}>
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
    <Button title="Clear" onPress={clearCanvas} />
    </View>
  );
};

const toolStyle = StyleSheet.create({
  canva: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
  },
  container: {
    flex: 1,
    width: "100%",
  }
});
