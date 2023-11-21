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
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import COLORS from "../shared/COLORS";
import { useNavigation } from "@react-navigation/native";

export default function PageHeaderCommunity() {
  const { data: userProfile, isError } = useFetch(
    `/enter/getVerif`,
    URL_API_ENTER
  );
  // const { data: cookie } = useFetch("/comm/cc", URL_API_COMMUNITY);

  const navigation = useNavigation();

  useEffect(() => {
    console.log(isError);
  }, [isError]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>Hello,</Text>
          <Text style={styles.username}>
            {userProfile?.bus_detail?.business_name || "There"}{" "}
          </Text>
        </View>
        {userProfile?.bus_detail?.business_name ? (
          <View style={styles.avatar}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {userProfile?.bus_detail?.business_name?.substring(0, 1)}
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
