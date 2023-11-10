import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../shared/COLORS";

const Level = ({ level }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <View
          key={item}
          style={[
            styles.circle,
            {
              backgroundColor: item <= level ? COLORS.main : COLORS.gray,
              height: item * 6,
            },
          ]}
        ></View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  circle: {
    width: 5,
    borderRadius: 10,
    marginHorizontal: 2,
  },
});

export default Level;
