import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";
import { getTimeAgoString } from "../../components/utils/helper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Avatar } from "./home";
import moment from "moment";
import { useLanguageContext } from "../../context/LanguageContext";

export default function CommunityProfileView() {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const { data: profileViews, isLoading } = useFetch(
    "/comm/profile_view",
    URL_API_COMM
  );
  const [notificationData, setNotificationData] = useState([]);
  const { language } = useLanguageContext();

  const handleLoadMore = () => {
    // Mengganti halaman saat tombol "Load More" ditekan
    setPage(page + 1);
  };

  useEffect(() => {
    console.log(profileViews?.length);
  }, [profileViews]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginTop: 15,
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-sharp" size={24} color="black" />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {language === "EN" ? "Back" : "Kembali"}
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 30, backgroundColor: COLORS.main }}></View>
      <Text style={{ marginBottom: 15, fontSize: 16, fontWeight: 900 }}>
        {language === "EN"
          ? `Total Viewed (${profileViews?.length})`
          : `Total Dilihat (${profileViews?.length})`}
      </Text>

      {!isLoading &&
        (profileViews?.length > 0 ? (
          profileViews
            ?.sort((a, b) => {
              const timeA = new Date(a?.createdAt).getTime();
              const timeB = new Date(b?.createdAt).getTime();
              return timeB - timeA;
            })
            ?.slice(0, page * 10)
            ?.map((profile, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 3,
                  borderBottomWidth: profileViews?.length - 1 === i ? 0 : 1,
                  paddingBottom: 6,
                  marginBottom: 15,
                  marginHorizontal: 4,
                  gap: 15,
                }}
              >
                <>
                  <Avatar
                    name={profile?.ms_User?.ms_Profile?.first_name}
                    size={50}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ flex: 1 }} numberOfLines={2} el>
                      <Text style={{ fontWeight: 900 }}>
                        {`${
                          profile?.ms_User?.ms_Profile?.first_name || "Jhon"
                        } ${
                          profile?.ms_User?.ms_Profile?.last_name || ""
                        }`}{" "}
                      </Text>

                      {language === "EN"
                        ? "Viewed your profile"
                        : "Melihat profil Anda"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "gray",
                        marginTop: 1,
                        minWidth: "auto",
                      }}
                    >
                      {moment(profile?.createdAt).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                </>
              </View>
            ))
        ) : (
          <Text style={{ textAlign: "center" }}>
            {language === "EN" ? "0 Profile viewed" : "0 Profil dilihat"}
          </Text>
        ))}

      {page * 10 < profileViews?.length && (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.main,
            paddingVertical: 5,
            borderRadius: 4,
            marginBottom: 20,
          }}
          onPress={handleLoadMore}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            {language === "EN" ? "Load More" : "Muat Lebih Banyak"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
});
