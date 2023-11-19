// Pages/HomeScreen.js

import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToCreateSession = () => {
    navigation.navigate("CreateSession");
  };

  const navigateToJoinSession = () => {
    navigation.navigate("JoinSession");
  };

  return (
    <View style={styles.container}>
      <Button title="Create a Session" onPress={navigateToCreateSession} style={styles.button}/>
      <Text> </Text>
      <Button title="Join a Session" onPress={navigateToJoinSession} style={styles.button}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
      
  },
});

export default HomeScreen;
