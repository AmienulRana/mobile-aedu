import { StyleSheet, View, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../shared/COLORS";
import { useLanguageContext } from "../../context/LanguageContext";

export default function SearchBar() {
  const { language } = useLanguageContext();
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={24}
        color={COLORS.gray}
        style={{ marginRight: 10 }}
      />
      <TextInput placeholder={language === "EN" ? "Search" : "Cari"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginTop: 15,
    alignItems: "center",
  },
});
