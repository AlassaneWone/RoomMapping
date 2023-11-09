import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import styles from "./assets/style";

import DrawingScreen from "./Pages/tool";

export default function App() {
  return (
    <View style={styles.container}>
      <DrawingScreen />
    </View>
  );
}
