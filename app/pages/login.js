import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import COLORS from "../components/shared/COLORS";

import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { URL_API, URL_API_ENTER } from "../hooks/useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfileContext } from "../context/useProfileContext";
import { useLanguageContext } from "../context/LanguageContext";

export default function Login() {
  const navigation = useNavigation();
  const router = useRoute();
  const { profileContext, setProfileContext } = useProfileContext();

  const { language } = useLanguageContext();

  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${URL_API}/login`, {
        email: username,
        password,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem("login-mode", "user");
        navigation.push("home");
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Failed Login", "Your username or password maybe wrong");
    }
  };
  const handleLoginEnterprise = async () => {
    try {
      const response = await axios.post(`${URL_API_ENTER}/enter/login`, {
        email: username,
        password,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem("login-mode", "enterprise");
        setProfileContext({ ...profileContext, enterpise: "enterprise" });
        setTimeout(() => {
          navigation.push("enterprise-home");
        }, 300);
      }
    } catch (error) {
      console.log("error", error?.response);
      if (error?.response?.data === "You're already logged in") {
        await AsyncStorage.setItem("login-mode", "enterprise");
        setProfileContext({ ...profileContext, enterpise: "enterprise" });
        setTimeout(() => {
          navigation.push("enterprise-home");
        }, 300);
      } else {
        Alert.alert(
          "Failed Login as Enterprise",
          "Your username or password maybe wrong"
        );
      }
    }
  };
  return (
    <ScrollView>
      <Image source={require("../assets/login-image.png")} />
      <View style={styles.container}>
        <Text style={styles.heading}>
          {language === "EN" ? "Welcome to AEDU" : "Selamat Datang di AEDU"}
        </Text>

        <View style={styles.wrapperInput}>
          <FontAwesome5
            name="user-alt"
            size={16}
            color={COLORS.gray}
            style={{ marginRight: 15 }}
          />
          <TextInput
            style={styles.input}
            placeholder={language === "EN" ? "Username" : "Nama Pengguna"}
            value={username}
            onChangeText={onChangeUsername}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.wrapperInput}>
          <FontAwesome
            name="lock"
            size={22}
            color={COLORS.gray}
            style={{ marginRight: 15 }}
          />
          <TextInput
            placeholder={language === "EN" ? "Password" : "Kata Sandi"}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={onChangePassword}
          />
        </View>
        <TouchableOpacity onPress={() => handleLogin()}>
          <Text style={styles.buttonLogin}>
            {language === "EN" ? "Sign In" : "Masuk"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLoginEnterprise()}>
          <Text style={styles.buttonLoginEnter}>
            {language === "EN"
              ? "Sign In as Enterprise"
              : "Masuk sebagai Perusahaan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("home")}>
          <Text
            style={{ textAlign: "center", color: COLORS.gray, marginTop: 15 }}
          >
            {language === "EN" ? "Skip Authentication" : "Lewati Otentikasi"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 40,
    backgroundColor: "white",
    marginTop: -20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
  },
  wrapperInput: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginTop: 15,
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  buttonLogin: {
    backgroundColor: COLORS.main,
    padding: 14,
    marginTop: 30,
    color: "white",
    textAlign: "center",
    borderRadius: 15,
  },
  buttonLoginEnter: {
    backgroundColor: COLORS.white,
    padding: 14,
    marginTop: 20,
    color: COLORS.main,
    textAlign: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.main,
  },
});
