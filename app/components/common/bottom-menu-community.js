import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather, FontAwesome, Foundation, Ionicons } from "@expo/vector-icons";
import { NavigationContext, useRoute } from "@react-navigation/native";
import COLORS from "../shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useProfileContext } from "../../context/useProfileContext";

const BottomMenuBarCommunity = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useContext(NavigationContext);
  const router = useRoute();

  const { data: messages } = useFetch(`/comm/inbox`, URL_API_COMM);
  const { data: notifications } = useFetch(`/comm/notification`, URL_API_COMM);
  const { profileContext } = useProfileContext();

  const [totalUnreadMessage, setTotalUnreadMessage] = useState(0);
  const [totalUnreadNotif, setTotalUnreadNotif] = useState(0);
  useEffect(() => {
    const totalUnredMessage = messages?.filter(
      (message) => !message?.read_status
    ).length;
    setTotalUnreadMessage(totalUnredMessage);
  }, [messages]);
  useEffect(() => {
    const totalUnreadNotif = notifications?.data?.filter(
      (notification) =>
        !notification?.viewed && notification?.act !== "Chat send"
    )?.length;
    setTotalUnreadNotif(totalUnreadNotif);
  }, [notifications]);

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
  return !isKeyboardVisible ? (
    <View style={styles.menuBar}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            router.name === "community-home" ? "home" : "community-home"
          )
        }
        style={styles.menuItem}
      >
        <Ionicons
          name="home"
          size={24}
          color={router.name === "community-home" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("community-network")}
        style={styles.menuItem}
      >
        <FontAwesome
          name="users"
          size={24}
          color={
            router.name === "community-network" ? COLORS.main : COLORS.gray
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("community-post")}
        style={styles.menuItem}
      >
        <FontAwesome
          name="plus"
          size={24}
          color={router.name === "community-post" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("community-jobs")}
        style={styles.menuItem}
      >
        <Foundation
          name="shopping-bag"
          size={24}
          color={router.name === "community-jobs" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            profileContext?.enterpise ? "enterprise-home" : "community-profile"
          )
        }
        style={styles.menuItem}
      >
        <FontAwesome
          name="user"
          size={24}
          color={
            router.name === "community-profile" ? COLORS.main : COLORS.gray
          }
        />
        {!profileContext?.enterpise && (
          <Text style={styles.totalCount}>
            {(totalUnreadMessage || 0) + (totalUnreadNotif || 0)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  ) : null;
};

export default BottomMenuBarCommunity;

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
  menuItem: {
    position: "relative",
  },
  totalCount: {
    backgroundColor: COLORS.main,
    width: 15,
    height: 15,
    position: "absolute",
    top: -4,
    right: -8,
    borderRadius: 100,
    textAlign: "center",
    color: "white",
    fontSize: 10,
  },
});
