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

export default function PageHeader() {
  const { data: token } = useFetch("/getToken");
  const { data: userProfile, fetchData: fetchUserProfile } = useFetch(
    `/getProfile?token=${token?.token}`
  );
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>Hello,</Text>
          <Text style={styles.username}>
            {userProfile?.profile?.first_name || "There"}{" "}
            {userProfile?.profile?.last_name}
          </Text>
        </View>
        {userProfile?.profile?.first_name ? (
          <View style={styles.avatar}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {userProfile?.profile?.first_name?.substring(0, 1)}
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Image
              source={require("../../assets/profile.png")}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        )}
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
    marginTop: StatusBar.currentHeight + 10,
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
