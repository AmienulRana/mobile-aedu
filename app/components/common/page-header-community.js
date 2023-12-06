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
import useFetch, { URL_API_COMM, URL_API_ENTER } from "../../hooks/useFetch";
import COLORS from "../shared/COLORS";
import { useNavigation } from "@react-navigation/native";
import { useProfileContext } from "../../context/useProfileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageToggle from "./language-toggle";
import { useLanguageContext } from "../../context/LanguageContext";

export default function PageHeaderCommunity() {
  const { data: userProfile } = useFetch(`/enter/getVerif`, URL_API_ENTER);
  const {
    data: cookie,
    isLoading,
    isError,
  } = useFetch("/comm/cc", URL_API_COMM);
  const { profileContext, setProfileContext } = useProfileContext();
  const navigation = useNavigation();
  const { language } = useLanguageContext();

  useEffect(() => {
    const payload = {
      id: cookie?.id,
      enterpise: cookie?.enterprise,
      first_name:
        cookie?.ms_Profile?.first_name ||
        cookie?.ms_EnterpriseProfile?.business_name,
      last_name: cookie?.ms_Profile?.last_name,
      tagline:
        cookie?.ms_Profile?.role ||
        cookie?.ms_Profile?.tagline ||
        cookie?.ms_EnterpriseProfile?.tagline,
    };
    setProfileContext({ ...profileContext, ...payload });
  }, [cookie]);

  useEffect(() => {
    if (isError) {
      navigation.navigate("login");
      AsyncStorage.removeItem("login-mode");
    }
  }, [isError]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text>{language === "EN" ? "Hello" : "Halo"},</Text>
          {!isLoading && (
            <Text
              style={styles.username}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {!cookie?.enterprise
                ? `${cookie?.ms_Profile?.first_name} ${cookie?.ms_Profile?.last_name}`
                : `${cookie?.ms_EnterpriseProfile?.business_name || "There"}`}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <LanguageToggle />
          {!cookie?.ms_Profile?.first_name &&
            !cookie?.ms_EnterpriseProfile?.business_name && (
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
