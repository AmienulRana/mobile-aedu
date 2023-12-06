import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLanguageContext } from "../../context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function BackHeader({ title }) {
  const navigation = useNavigation();
  const { language } = useLanguageContext();
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back-sharp" size={24} color="black" />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {title ? title : language === "EN" ? "Back" : "Kembali"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
