import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import { useNavigation, useRoute } from "@react-navigation/native";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import BottomMenuBar from "../../components/common/bottom-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomMenuEnterprise from "../../components/common/bottom-menu-enterprise";
import COLORS from "../../components/shared/COLORS";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import PublishCourse from "../../components/pages/enterprise/learning/publish";
import PageHeaderCommunity from "../../components/common/page-header-community";

export default function AdvertiseEnterprise() {
  const navigation = useNavigation();

  const { data: advertises, fetchData: fetchAds } = useFetch(
    "/enter/get_ad",
    URL_API_ENTER
  );

  const handleDelete = async (id_ads) => {
    try {
      await axios.get(`${URL_API_ENTER}/enter/delete_ad/${id_ads}`);
      fetchAds();
    } catch (error) {
      Alert.alert("Failed", "Failed to remove Ads");
      console.log(error);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />

        <View style={styles.containerBanner}>
          <Text style={styles.text}>Go Create Ads</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("enterprise-ads-create")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Create Ads</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Overview
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "gray",
              marginTop: 6,
            }}
          >
            The Ads Page is where you can manage all your ad campaigns. You can
            create, edit, and track the performance of your ads here.
          </Text>
        </View>

        <Text style={{ fontSize: 16, marginVertical: 16, fontWeight: 900 }}>
          Ads Active ({advertises?.length || 0})
        </Text>
        {advertises?.map((advertise) => (
          <View
            key={advertise?.id}
            style={{
              border: 1,
              marginBottom: 12,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View style={{ position: "absolute", right: 4, top: 4 }}>
              <TouchableOpacity onPress={() => handleDelete(advertise?.id)}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="red"
                />
              </TouchableOpacity>
            </View>

            <Image
              source={require("../../assets/courses/course-1.png")}
              style={{ width: 50, height: 50, borderRadius: 5 }}
            />
            <View
              style={{ flex: 1, padding: 5, justifyContent: "space-between" }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => navigation?.navigate('enterprise-ads-create', {ads_id: advertise?.id})}
                  style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  <Text>{advertise?.primary_text || ""}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{ fontSize: 14, color: "gray", marginRight: 10 }}
                  >
                    Click : 0
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "gray", marginRight: 10 }}
                  >
                    Liked : 0
                  </Text>
                  <Text style={{ fontSize: 14, color: "gray" }}>
                    Impression : 0
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.main,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 14, textAlign: "center" }}
                >
                  Up Promote Ads
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomMenuEnterprise />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  containerBanner: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.main, // You can change the color here
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  containerDraft: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 3,
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  titleStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  completionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    backgroundColor: COLORS.gray,
    width: "50%",
    height: 3,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    backgroundColor: COLORS.main, // Ganti warna sesuai keinginan
    height: 3,
    borderRadius: 2,
  },
  completionPercentage: {
    fontSize: 14,
  },
  publishButton: {
    backgroundColor: COLORS.main, // Ganti warna sesuai keinginan
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 10,
    width: 120,
  },
  publishButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  deleteIcon: {
    fontSize: 24,
    color: "red",
  },
});
