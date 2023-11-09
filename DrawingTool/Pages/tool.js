import React, { useCallback, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import {
  Canvas,
  Path,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";

export default DrawingScreen = () => {
  const [paths, setPaths] = useState([]);

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
    print("clear");
  };

  return (
    <Canvas onTouch={touchHandler}>
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
  );
};

const toolStyle = StyleSheet.create({
  canva: {
    flex: 1,
    width: "90%",
    borderColor: "black",
    borderWidth: 1,
  },
});
