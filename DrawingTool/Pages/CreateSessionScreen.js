// Pages/CreateSessionScreen.js

import React, { useState } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import io from 'socket.io-client';

const CreateSessionScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const socket = io("http://10.99.5.116:3000");

  const generateRandomSessionId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const createSession = () => {
    const sessionId = generateRandomSessionId();
    socket.emit("createSession", { username, sessionId });
    navigation.navigate("Canvas", { username, sessionId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <Button title="Create Session" onPress={createSession} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: "100%",
  },
});

export default CreateSessionScreen;
