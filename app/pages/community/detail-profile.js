import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Button,
  Image,
  Modal,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomMenuBar from "../../components/common/bottom-menu";
import COLORS from "../../components/shared/COLORS";
import {
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Timeline from "../../components/common/timeline";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import moment from "moment/moment";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

export default function CommunityProfileDetail() {
  const navigation = useNavigation();
  const router = useRoute();

  const { data: userDetail, fetchData: fetchUserDetail } = useFetch(
    `/comm/getUser/${router?.params?.user_id}`,
    URL_API_COMM
  );
  const { data: isConnected, fetchData: fetchIsConnected } = useFetch(
    `/comm/check_conn/${router?.params?.user_id}`,
    URL_API_COMM
  );
  const { data: certificate, fetchData: fetchCertificate } = useFetch(
    `/ext_certs/${router?.params?.user_id}`
  );

  const [experienceTimeline, setExperienceTimeline] = useState([]);
  const [educationTimeline, setEducationTimeline] = useState([]);

  const [successConnected, setSuccessConnected] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // if (!isLoading) {
    setRefreshing(false);
    // }
  };

  const confirmDeleteNetwork = () => {
    Alert.alert(
      "Confirm Remove",
      `Remove ${userDetail?.ms_Profile?.first_name} ${userDetail?.ms_Profile?.last_name} from connection?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleAddNetwork("remove") },
      ]
    );
  };

  const handleAddNetwork = async (type) => {
    const message =
      type === "remove"
        ? "Connection has been remove"
        : `Your request has been sent to ${userDetail?.ms_Profile?.first_name} ${userDetail?.ms_Profile?.last_name} `;
    try {
      await axios.get(
        `${URL_API_COMM}/comm/followUser/${router.params?.user_id}`
      );
      setSuccessConnected(!successConnected);
      Alert.alert("Successfully", message);
      fetchIsConnected();
    } catch (error) {
      Alert.alert(
        type === "remove"
          ? "Failed remove connection"
          : "Failed to send connection"
      );
    }
  };

  useEffect(() => {
    const changeStructure = userDetail?.ms_Profile?.ms_Prof_Experiences?.map(
      (experience) => ({
        title: experience?.title,
        description: experience?.Description || "Description Jobs",
        ortherText: experience?.location_type,
        date: `${moment(experience?.start_date).format("MMMM YYYY")} - ${
          experience?.currently_working
            ? "Now"
            : moment(experience?.end_date).format("MMMM YYYY")
        }`,
        subTitle: `${experience?.company} · ${experience?.employment_type}`,
      })
    );
    setExperienceTimeline(changeStructure);
  }, [userDetail]);
  useEffect(() => {
    const changeStructure = userDetail?.ms_Profile?.ms_Prof_Edus?.map(
      (education) => ({
        title: education?.school,
        date: `${moment(education?.grad_date).format("MMMM YYYY")}`,
        subTitle: `${education?.degree} · ${education?.study_field}`,
      })
    );
    setEducationTimeline(changeStructure);
  }, [userDetail]);

  useEffect(() => {
    fetchCertificate();
    fetchUserDetail();
    fetchIsConnected();
  }, [router]);
  useEffect(() => {
    setSuccessConnected(isConnected === "User Connected");
  }, [isConnected]);
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ backgroundColor: "white", padding: 5 }}>
          <View style={styles.bannerProfile}></View>
          {/* <Button title="Pilih Gambar" /> */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.avatarProfile, { position: "relative" }]}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                {userDetail?.ms_Profile?.first_name?.substring(0, 1)}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {userDetail?.ms_Profile?.first_name}{" "}
                {userDetail?.ms_Profile?.last_name}
              </Text>
            </View>
            <Text style={{ fontSize: 16 }}>
              {userDetail?.ms_Profile?.tagline}
            </Text>

            <View style={{ marginTop: 5, flexDirection: "row", gap: 7 }}>
              <Ionicons name="location" size={20} color={COLORS.gray} />
              <Text style={{ fontSize: 16 }}>Medan, Sumatera Utara</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              marginBottom: 4,
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                successConnected
                  ? confirmDeleteNetwork()
                  : handleAddNetwork("add")
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "primary", // Anda perlu mendefinisikan warna primary
                borderRadius: 100,
                paddingHorizontal: 15,
                paddingVertical: 6,
                gap: 8,
              }}
            >
              {!successConnected ? (
                <>
                  <FontAwesome5 name="user-plus" size={16} color="gray" />
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    Add Network
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome5 name="user-minus" size={16} color="gray" />
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    Remove Network
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "primary",
                borderRadius: 100,
                paddingHorizontal: 15,
                paddingVertical: 6,
                gap: 8,
              }}
              onPress={() =>
                navigation?.navigate("community-message", {
                  id: userDetail?.id,
                  tagline: userDetail?.ms_Profile?.tagline,
                  username: `${userDetail?.ms_Profile?.first_name} ${userDetail?.ms_Profile?.last_name}`,
                })
              }
            >
              <FontAwesome5 name="envelope" size={16} color="gray" />
              <Text style={{ color: "gray", fontSize: 12 }}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>About Me</Text>
          </View>
          <View style={{ marginTop: 15, flexDirection: "row", gap: 7 }}>
            <Text style={{ fontSize: 16 }}>
              {userDetail?.ms_Profile?.about}
            </Text>
          </View>
        </View>
        {/* <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              Personal Information
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>{"\u2022"} Marital status :</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.marital_stats}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>{"\u2022"} Gender :</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.gender}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>{"\u2022"} Religion :</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.religion}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>{"\u2022"} Age :</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {moment().diff(
                moment(userProfile?.profile?.dateofbirth),
                "years"
              )}
            </Text>
          </View>
        </View> */}
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              Experience
            </Text>
          </View>
          <Timeline data={experienceTimeline} />
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              Certificate
            </Text>
          </View>
          {certificate?.map((certif) => (
            <View key={certif?.id} style={styles.WrapperCertificate}>
              <View style={styles.header}>
                <Text style={styles.title}>{certif?.cert_title}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.organization}>{certif?.organization}</Text>
                <Text style={styles.date}>
                  Issued {moment(certif?.issue_date).format("YYYY")}{" "}
                  {`- Expires ${moment(certif?.expired_date).format("YYYY")}`}
                </Text>
                <View style={styles.credential}>
                  <Text style={styles.credentialText}>
                    Credential ID {certif?.cert_id}
                  </Text>
                  <EvilIcons
                    name="external-link"
                    size={24}
                    color="black"
                    onPress={() =>
                      Linking.openURL(certif?.url || "https://google.com")
                    }
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              Education
            </Text>
          </View>
          <Timeline data={educationTimeline} />
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            Digital Portfolio
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 3,
              marginBottom: 30,
            }}
          >
            <Text style={{ fontSize: 16 }}>Check digital portfolio</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://learning.aedu.id/digital-portfolio/${router?.params?.user_id}`
                )
              }
            >
              <Text style={{ fontSize: 16, color: COLORS.main }}>in here!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    position: "relative",
    marginTop: StatusBar.currentHeight,
  },
  bannerProfile: {
    height: 200,
    width: "auto",
    backgroundColor: "#E0E0E0",
  },
  avatarProfile: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginLeft: 20,
    marginTop: -40,
    marginBottom: 15,
    // transform: [{ translateY: -50 }],
  },
  WrapperCertificate: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  organization: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    marginTop: 5,
  },
  credential: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  credentialText: {
    fontSize: 14,
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
