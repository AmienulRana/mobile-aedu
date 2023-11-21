import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  NavigationContext,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import COLORS from "../shared/COLORS";
import axios from "axios";
import { URL_API_ENTER } from "../../hooks/useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfileContext } from "../../context/useProfileContext";

const BottomMenuEnterprise = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useContext(NavigationContext);
  const router = useRoute();
  const { profileContext, setProfileContext } = useProfileContext();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("login-mode");
    // navigation.navigate("login");
    try {
      const response = await axios.get(`${URL_API_ENTER}/enter/logout`);
      if (response.status === 200) {
        setProfileContext({ ...profileContext, enterpise: "" });
        setTimeout(() => {
          navigation.navigate("home");
        }, 500);
      }
    } catch (error) {
      console.log(error?.response);
      Alert.alert("Failed to logout");
    }
  };
  return !isKeyboardVisible ? (
    <View style={styles.menuBar}>
      <TouchableOpacity
        onPress={() => navigation.push("enterprise-home")}
        style={styles.menuItem}
      >
        <Ionicons
          name="home"
          size={24}
          color={router.name === "enterprise-home" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("enterprise-ads")}
        style={styles.menuItem}
      >
        <FontAwesome5
          name="adversal"
          size={24}
          color={router.name === "enterprise-ads" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("enterprise-learning")}
        style={styles.menuItem}
      >
        <Feather
          name="book-open"
          size={24}
          color={
            router.name === "enterprise-learning" ? COLORS.main : COLORS.gray
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("enterprise-talent")}
      >
        <Foundation
          name="shopping-bag"
          size={24}
          color={
            router.name === "enterprise-talent" ? COLORS.main : COLORS.gray
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("community-home")}
      >
        <Ionicons name="md-globe-sharp" size={24} color={COLORS.gray} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLogout()} style={styles.menuItem}>
        <MaterialIcons name="logout" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  ) : null;
};

export default BottomMenuEnterprise;

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    height: 50,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderWidth: 0.2,
    borderColor: "#eaeaea",
  },
});
