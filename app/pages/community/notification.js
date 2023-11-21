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
import { useLanguageContext } from "../../context/LanguageContext";

export default function CommunityNotification() {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const { data: notifications, isLoading } = useFetch(
    "/comm/notification",
    URL_API_COMM
  );
  const [notificationData, setNotificationData] = useState([]);
  const { language } = useLanguageContext();

  const handleLoadMore = () => {
    // Mengganti halaman saat tombol "Load More" ditekan
    setPage(page + 1);
  };

  useEffect(() => {
    const filterNotif = notifications?.data?.filter(
      (notif) => notif?.act !== "Chat send" && notif?.act !== "Profile View"
    );
    if (
      notifications?.my_network &&
      notifications?.group &&
      notifications?.liked
    ) {
      console.log("liked =>>>>>>", notifications?.liked);
      setNotificationData([
        ...filterNotif,
        ...notifications?.my_network,
        ...notifications?.group,
        ...notifications?.liked,
      ]);
    }
  }, [notifications]);

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
      {!isLoading &&
        (notificationData?.length > 0 ? (
          notificationData
            ?.sort((a, b) => {
              const timeA = new Date(a?.createdAt).getTime();
              const timeB = new Date(b?.createdAt).getTime();
              return timeB - timeA;
            })
            ?.slice(0, page * 10)
            ?.map((notification, i) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("community-notif-detail", {
                    post_id: notification?.post_id,
                  })
                }
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 3,
                  borderBottomWidth: notificationData?.length - 1 === i ? 0 : 1,
                  paddingBottom: 6,
                  marginBottom: 15,
                  marginHorizontal: 4,
                  gap: 15,
                }}
              >
                {notification?.post_id &&
                  notification?.act?.includes("Like") && (
                    <>
                      <Avatar
                        name={notification?.ms_User?.ms_Profile?.first_name}
                        size={50}
                        imageUrl={notification?.ms_User?.ms_Profile?.virtual_pp}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ flex: 1 }}>
                          <Text style={{ fontWeight: 900 }}>
                            {`${
                              notification?.ms_User?.ms_Profile?.first_name ||
                              "Someone"
                            } ${
                              notification?.ms_User?.ms_Profile?.last_name || ""
                            }`}{" "}
                          </Text>
                          {language === "EN"
                            ? "recently liked your post"
                            : "baru saja menyukai kiriman Anda"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "gray",
                            marginTop: 1,
                            minWidth: "auto",
                          }}
                        >
                          {getTimeAgoString(notification?.createdAt, language)}
                        </Text>
                      </View>
                    </>
                  )}

                {notification?.post_id &&
                  notification?.act?.includes("Comment") && (
                    <>
                      <Avatar
                        name={
                          notification?.ms_User?.ms_Profile?.first_name ||
                          "Jhon"
                        }
                        size={50}
                        imageUrl={notification?.ms_User?.ms_Profile?.virtual_pp}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ flex: 1 }}>
                          <Text style={{ fontWeight: 900 }}>
                            {`${
                              notification?.ms_User?.ms_Profile?.first_name ||
                              "Jhon"
                            } ${
                              notification?.ms_User?.ms_Profile?.last_name || ""
                            }`}{" "}
                          </Text>
                          {language === "EN"
                            ? "comment in your post"
                            : "baru saja mengomentari kiriman Anda"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "gray",
                            marginTop: 1,
                            minWidth: "auto",
                          }}
                        >
                          {getTimeAgoString(notification?.createdAt, language)}
                        </Text>
                      </View>
                    </>
                  )}

                {notification?.act?.includes("New") && (
                  <>
                    <Avatar
                      name={notification?.ms_User?.ms_Profile?.first_name}
                      size={50}
                      imageUrl={notification?.ms_User?.ms_Profile?.virtual_pp}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ flex: 1 }} numberOfLines={2}>
                        <Text style={{ fontWeight: 900 }}>
                          {`${
                            notification?.ms_User?.ms_Profile?.first_name ||
                            "Someone"
                          } ${
                            notification?.ms_User?.ms_Profile?.last_name || ""
                          }`}{" "}
                        </Text>
                        {language === "EN"
                          ? "just posted something"
                          : "baru saja memposting sesuatu"}
                        <Text style={{ fontWeight: 900 }}>
                          {notification?.ms_CommGroup
                            ? ` ${language === "EN" ? "to" : "ke"} ${
                                notification?.ms_CommGroup?.group_name
                              }`
                            : ""}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "gray",
                          marginTop: 1,
                          minWidth: "auto",
                        }}
                      >
                        {getTimeAgoString(notification?.createdAt, language)}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))
        ) : (
          <Text style={{ textAlign: "center" }}>
            {language === "EN"
              ? "You have no notification"
              : "Anda tidak memiliki pemberitahuan"}
          </Text>
        ))}

      {page * 10 < notificationData.length && (
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
