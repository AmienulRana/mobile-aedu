import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import COLORS from "../shared/COLORS";
import { useNavigation } from "@react-navigation/native";
import LanguageToggle from "./language-toggle";
import { useLanguageContext } from "../../context/LanguageContext";

export default function PageHeader() {
  const { data: token } = useFetch("/getToken");
  const { data: userProfile, fetchData: fetchUserProfile } = useFetch(
    `/getProfile?token=${token?.token}`
  );
  const navigation = useNavigation();
  const { language } = useLanguageContext();

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>{language === "EN" ? "Hello" : "Halo"},</Text>
          <Text style={styles.username}>
            {userProfile?.profile?.first_name || "There"}{" "}
            {userProfile?.profile?.last_name}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <LanguageToggle />
          {!userProfile?.profile?.first_name && (
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Image
                source={require("../../assets/profile.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  avatar: {
    backgroundColor: COLORS.main,
    width: 40,
    height: 40,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
