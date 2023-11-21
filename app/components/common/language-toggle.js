import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLanguageContext } from "../../context/LanguageContext";
import COLORS from "../shared/COLORS";

export default function LanguageToggle() {
  const { language, changeLanguage } = useLanguageContext();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={changeLanguage}
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text>{language}</Text>
      {language === "EN" ? (
        <Image
          source={require("../../assets/united-kingdom.png")}
          style={styles.flag}
        />
      ) : (
        <Image
          source={require("../../assets/indonesia.png")}
          style={styles.flag}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flag: {
    width: 25,
    height: 25,
    borderColor: COLORS.main,
    borderWidth: 2,
    borderRadius: 25,
  },
});
