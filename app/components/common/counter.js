import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import COLORS from "../shared/COLORS";
import { AntDesign } from "@expo/vector-icons";

const Counter = ({ qty, addFunction, decFunction }) => {
  const [counter, setCounter] = useState(qty || 1);

  const handleMinCounter = () => {
    if (counter > 1) {
      setCounter(counter - 1);
      decFunction?.();
    }
  };

  const handleAddCounter = () => {
    addFunction?.();
    setCounter(counter + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMinCounter} style={styles.button}>
        <AntDesign name="minus" size={10} color="black" />
      </TouchableOpacity>
      <Text style={styles.counterText}>{counter}</Text>
      <TouchableOpacity
        onPress={handleAddCounter}
        style={[styles.button, styles.addButton]}
      >
        <AntDesign name="plus" size={10} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    width: 90,
  },
  button: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: COLORS.main,
    borderColor: COLORS.main,
  },
  counterText: {
    // fontSize: 16,
  },
  plusText: {
    color: "white",
  },
};

export default Counter;
