import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { Avatar } from "./home";
import axios from "axios";
import PageHeaderCommunity from "../../components/common/page-header-community";
import { useLanguageContext } from "../../context/LanguageContext";

export default function CommunityMyNetwork() {
  const { data: myNetworks, fetchData: getMyNetworks } = useFetch(
    "/comm/getFollowers",
    URL_API_COMM
  );
  const { data: networkRequest, fetchData: getNetworksRequest } = useFetch(
    "/comm/follow_requests",
    URL_API_COMM
  );
  const { data: networkRecommend } = useFetch(
    "/comm/follow_requests",
    URL_API_COMM
  );
  const { language } = useLanguageContext();

  const handleAcceptNetwork = async (id) => {
    try {
      const response = await axios.get(
        `${URL_API_COMM}/comm/acc_fol_req/${id}`
      );
      if (response?.status === 200) {
        getNetworksRequest();
        getMyNetworks();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={{ marginTop: 30 }}></View>
        <Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 15 }}>
          {language === "EN"
            ? `My Network (${myNetworks?.following?.length || 0})`
            : `Koneksi Saya (${myNetworks?.following?.length || 0})`}
        </Text>

        {myNetworks?.following?.length === 0 && (
          <Text style={{ textAlign: "center" }}>
            {language === "EN"
              ? "You have no Connection"
              : "Anda tidak memiliki koneksi"}
          </Text>
        )}
        {myNetworks?.following?.map((follow, index) => (
          <View key={follow?.id} style={{ marginTop: 6 }}>
            <View style={styles.flexContainer}>
              <Avatar
                name={
                  follow?.ms_User?.ms_EnterpriseProfile?.business_name ||
                  `${follow?.ms_User?.ms_Profile?.first_name || ""} ${
                    follow?.ms_User?.ms_Profile?.last_name || ""
                  }`
                }
                imageUrl={follow?.ms_User?.ms_Profile?.virtual_pp}
              />
              <View style={styles.textContainer}>
                <Text style={styles.boldText}>
                  {follow?.ms_User?.ms_EnterpriseProfile?.business_name ||
                    `${follow?.ms_User?.ms_Profile?.first_name || ""} ${
                      follow?.ms_User?.ms_Profile?.last_name || ""
                    }`}
                </Text>
                <Text style={styles.smallText}>
                  {follow?.ms_User?.ms_EnterpriseProfile?.tagline ||
                    follow?.ms_User?.ms_Profile?.tagline}
                </Text>
                <Text style={styles.smallText}>
                  {follow?.ms_User?.ms_Profile?.location ||
                    follow?.ms_User?.ms_EnterpriseProfile?.ms_City?.name}
                  , Indonesia
                </Text>
                <View style={styles.extraSmallText}>
                  <Text style={{ fontSize: 12, color: COLORS.gray }}>
                    {language === "EN"
                      ? "2 same community"
                      : "2 komunitas yang sama"}{" "}
                    (React.js Developer and Next.js Dev)
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: COLORS.red,
                      paddingVertical: 5,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#fff" }]}>
                    {language === "EN" ? "Remove" : "Hapus"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 15,
            marginTop: 35,
          }}
        >
          {language === "EN" ? "Connect Request" : "Permintaan koneksi"} (
          {
            networkRequest?.filter((network) => network?.status !== "Accepted")
              ?.length
          }
          )
        </Text>

        {networkRequest?.filter((network) => network?.status !== "Accepted")
          ?.length === 0 && (
          <Text style={{ textAlign: "center" }}>
            {language === "EN"
              ? "You have no Request Connection"
              : "Anda tidak memiliki permintaan koneksi"}
          </Text>
        )}
        {networkRequest
          ?.filter((network) => network?.status !== "Accepted")
          ?.map((network) => (
            <View key={network?.id} style={{ marginTop: 6 }}>
              <View style={styles.flexContainer}>
                <Avatar
                  name={
                    network?.fol?.ms_EnterpriseProfile?.business_name ||
                    `${network?.fol?.ms_Profile?.first_name || ""} ${
                      network?.fol?.ms_Profile?.last_name || ""
                    }`
                  }
                />
                <View style={styles.textContainer}>
                  <Text style={styles.boldText}>
                    {network?.fol?.ms_EnterpriseProfile?.business_name ||
                      `${network?.fol?.ms_Profile?.first_name || ""} ${
                        network?.fol?.ms_Profile?.last_name || ""
                      }`}
                  </Text>
                  <Text style={styles.smallText}>
                    {network?.fol?.ms_EnterpriseProfile?.tagline ||
                      network?.fol?.ms_Profile?.tagline}
                  </Text>
                  <Text style={styles.smallText}>
                    {network?.fol?.ms_Profile?.location ||
                      network?.fol?.ms_EnterpriseProfile?.ms_City?.name}
                    , Indonesia
                  </Text>
                  <View style={styles.extraSmallText}>
                    <Text style={{ fontSize: 12, color: COLORS.gray }}>
                      {language === "EN"
                        ? "2 same community"
                        : "2 komunitas yang sama"}{" "}
                      (React.js Developer and Next.js Dev)
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: COLORS.main,
                        paddingVertical: 5,
                        borderRadius: 5,
                      },
                    ]}
                    onPress={() => handleAcceptNetwork(network?.id)}
                  >
                    <Text style={[styles.buttonText, { color: "#fff" }]}>
                      {language === "EN" ? "Accept" : "Terima"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 15,
            marginTop: 35,
          }}
        >
          {language === "EN"
            ? "People you may know"
            : "Orang yang mungkin Anda kenal"}
        </Text>

        {/* {networkRecommend?.find?.map((network) => (
          <View key={network?.id} style={{ marginTop: 6 }}>
            <View style={styles.flexContainer}>
              <Avatar
                name={
                  network?.fol?.ms_EnterpriseProfile?.business_name ||
                  `${network?.fol?.ms_Profile?.first_name || ""} ${
                    network?.fol?.ms_Profile?.last_name || ""
                  }`
                }
              />
              <View style={styles.textContainer}>
                <Text style={styles.boldText}>
                  {network?.fol?.ms_EnterpriseProfile?.business_name ||
                    `${network?.fol?.ms_Profile?.first_name || ""} ${
                      network?.fol?.ms_Profile?.last_name || ""
                    }`}
                </Text>
                <Text style={styles.smallText}>
                  {network?.fol?.ms_EnterpriseProfile?.tagline ||
                    network?.fol?.ms_Profile?.tagline}
                </Text>
                <Text style={styles.smallText}>
                  {network?.fol?.ms_Profile?.location ||
                    network?.fol?.ms_EnterpriseProfile?.ms_City?.name}
                  , Indonesia
                </Text>
                <View style={styles.extraSmallText}>
                  <Text style={{ fontSize: 12, color: COLORS.gray }}>
                    2 same community (React.js Developer and Next.js Dev)
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: COLORS.main,
                      paddingVertical: 5,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#fff" }]}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))} */}
      </ScrollView>
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  flexContainer: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray,
    marginHorizontal: 5,
    alignItems: "center",
    gap: 15,
  },
  textContainer: {
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: "black",
  },
  smallText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  extraSmallText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
    gap: 10,
    // flexWrap: "wrap",
  },
  icon: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: -30 }],
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  buttonText: {
    color: COLORS.gray,
    fontSize: 14,
  },
});
