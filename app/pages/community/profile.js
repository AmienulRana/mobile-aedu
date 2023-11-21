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
import useFetch, { URL_API, URL_API_COMM } from "../../hooks/useFetch";
import moment from "moment/moment";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useLanguageContext } from "../../context/LanguageContext";

export default function ProfileCommunity() {
  const navigation = useNavigation();

  const { data: token } = useFetch("/getToken");
  const { data: communitys } = useFetch("/comm/communities", URL_API_COMM);
  const { data: experienceData } = useFetch("/get_exp");
  const { data: educationData } = useFetch("/get_edu");
  const {
    data: userProfile,
    fetchData: fetchUserProfile,
    isLoading,
  } = useFetch(`/getProfile?token=${token?.token}`);
  const { data: certificate, fetchData: fetchCertificate } = useFetch(
    `/ext_certs/${userProfile?.profile?.user_ref}`
  );

  const [experienceTimeline, setExperienceTimeline] = useState([]);
  const [educationTimeline, setEducationTimeline] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: messages, fetchData: fetchMessage } = useFetch(
    `/comm/inbox`,
    URL_API_COMM
  );
  const { data: notifications, fetchData: fetchNotif } = useFetch(
    `/comm/notification`,
    URL_API_COMM
  );
  const { data: profileViews } = useFetch("/comm/profile_view", URL_API_COMM);
  const { language } = useLanguageContext();

  const [totalUnreadMessage, setTotalUnreadMessage] = useState(0);
  const [totalUnreadNotif, setTotalUnreadNotif] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
    fetchMessage();
    if (!isLoading) {
      setRefreshing(false);
    }
  };

  const handleBuySubscrib = async () => {
    console.log("testing");
    try {
      const response = await axios.get(`${URL_API}/addto_cart/Premium`);
      if (response.status === 200) {
        navigation.navigate("cart");
      }
    } catch (error) {
      console.log(error?.response);
      Alert.alert("Failed to buy subscription");
    }
  };

  const handleViewProfile = () => {
    Alert.alert("Please buy subscription to unlock this feature", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed test"),
        style: "cancel",
      },
      { text: "OK", onPress: () => handleBuySubscrib() },
    ]);
  };

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
    const changeStructure = experienceData?.exp_data?.map((experience) => ({
      title: experience?.title,
      description: experience?.Description || "Description Jobs",
      ortherText: experience?.location_type,
      date: `${moment(experience?.start_date).format("MMMM YYYY")} - ${
        experience?.currently_working
          ? "Now"
          : moment(experience?.end_date).format("MMMM YYYY")
      }`,
      subTitle: `${experience?.company} · ${experience?.employment_type}`,
    }));
    setExperienceTimeline(changeStructure);
  }, [experienceData]);
  useEffect(() => {
    const changeStructure = educationData?.edu_data?.map((education) => ({
      title: education?.school,
      date: `${moment(education?.grad_date).format("MMMM YYYY")}`,
      subTitle: `${education?.degree} · ${education?.study_field}`,
    }));
    setEducationTimeline(changeStructure);
  }, [educationData]);

  useEffect(() => {
    fetchUserProfile();
  }, [token]);
  useEffect(() => {
    fetchCertificate();
  }, [userProfile]);
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
                {userProfile?.profile?.first_name?.substring(0, 1)}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
                flexDirection: "row",
                gap: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("community-notification")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={COLORS.gray}
                />
                {totalUnreadNotif > 0 && (
                  <Text style={styles.totalCount}>{totalUnreadNotif || 0}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("community-message")}
              >
                <Feather name="mail" size={20} color={COLORS.gray} />
                {totalUnreadMessage > 0 && (
                  <Text style={styles.totalCount}>{totalUnreadMessage}</Text>
                )}
              </TouchableOpacity>
            </View>
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
                {userProfile?.profile?.first_name}{" "}
                {userProfile?.profile?.last_name}
              </Text>
            </View>
            <Text style={{ fontSize: 16 }}>
              {userProfile?.profile?.tagline}
            </Text>

            <View style={{ marginTop: 5, flexDirection: "row", gap: 7 }}>
              <Ionicons name="location" size={20} color={COLORS.gray} />
              <Text style={{ fontSize: 16 }}>Medan, Sumatera Utara</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleViewProfile()}
              style={{ flexDirection: "row", gap: 6, marginTop: 5 }}
            >
              <Text style={{ color: COLORS.gray }}>
                {language === "EN"
                  ? "Who's viewed your profile"
                  : "Siapa yang melihat profil Anda"}
              </Text>

              <Text
                style={{ color: COLORS.main, textDecorationLine: "underline" }}
              >
                {profileViews?.length}
              </Text>
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {language === "EN" ? "My Community" : "Komunitas Saya"}
            </Text>
          </View>
          {communitys?.slice(0, 2)?.map((community) => (
            <View
              key={community?.id}
              style={{ marginTop: 15, flexDirection: "row", gap: 7 }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image
                  style={{ width: 60, height: 60, borderRadius: 5 }}
                  source={require("../../assets/courses/course-2.png")}
                />
                <View>
                  <Text style={{ fontSize: 10, color: COLORS.gray }}>
                    {language === "EN"
                      ? "PUBLIC COMMUNITY"
                      : "KOMUNITAS PUBLIK"}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("community-detail", {
                        community_id: community?.id,
                      })
                    }
                  >
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>
                      {community?.group_name}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{ fontSize: 12, color: COLORS.gray, marginTop: 5 }}
                  >
                    {community?.ms_CommGrpMembers?.length}{" "}
                    {language === "EN" ? "Members" : "Anggota"}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => navigation.navigate("community-community")}
          >
            <Text
              style={{ marginTop: 10, textAlign: "center", color: COLORS.main }}
            >
              {language === "EN"
                ? communitys?.length < 0
                  ? "Explore Community"
                  : `See ${communitys?.length - 2} Community`
                : communitys?.length < 0
                ? "Jelajahi Komunitas"
                : `Lihat ${communitys?.length - 2} Komunitas`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {language === "EN" ? "About Me" : "Tentang Saya"}
            </Text>
          </View>
          <View style={{ marginTop: 15, flexDirection: "row", gap: 7 }}>
            <Text style={{ fontSize: 16 }}>{userProfile?.profile?.about}</Text>
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
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Personal Information" : "Informasi Pribadi"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"}{" "}
              {language === "EN" ? "Marital status" : "Status Pernikahan"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.marital_stats}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Gender" : "Jenis Kelamin"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.gender}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Religion" : "Agama"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.religion}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Age" : "Usia"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {moment().diff(
                moment(userProfile?.profile?.dateofbirth),
                "years"
              )}
            </Text>
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
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Experience" : "Pengalaman"}
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
              {language === "EN" ? "Certificate" : "Sertifikat"}
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
              {language === "EN" ? "Education" : "Pendidikan"}
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
            <Text style={{ fontSize: 16 }}>
              {language === "EN"
                ? "Download digital portfolio"
                : "Unduh portofolio digital"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://learning.aedu.id/digital-portfolio/${userProfile?.profile?.user_ref}`
                )
              }
            >
              <Text style={{ fontSize: 16, color: COLORS.main }}>
                {language === "EN" ? "in here!" : "di sini!"}
              </Text>
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
