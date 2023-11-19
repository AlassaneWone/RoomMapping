// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Pages/HomeScreen";
import CreateSessionScreen from "./Pages/CreateSessionScreen";
import JoinSessionScreen from "./Pages/JoinSessionScreen";
import CanvasScreen from "./Pages/CanvasScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateSession" component={CreateSessionScreen} />
        <Stack.Screen name="JoinSession" component={JoinSessionScreen} />
        <Stack.Screen name="Canvas" component={CanvasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
