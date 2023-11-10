import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/page-header";
import BottomMenuBar from "../components/common/bottom-menu";
import COLORS from "../components/shared/COLORS";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Level from "../components/common/level";
import useFetch, { URL_API } from "../hooks/useFetch";
import axios from "axios";
import RenderHTML from "react-native-render-html";
import moment from "moment/moment";
import { useNavigation } from "@react-navigation/native";
import BadgeCourse from "../components/common/badge-course";
// import CountDown from "react-native-countdown-component";

export default function MyCourse() {
  const [tabActive, setTabActive] = useState("Purchases");

  const [detailStatsCourse, setDetailStatsCourse] = useState([{}]);
  const [purchases, setPurchases] = useState([]);
  const { data: recentlyView } = useFetch("/profile/courses_recentView");
  const { data: userWishlist } = useFetch("/profile/userWishlist");
  const { data: pendingPayments } = useFetch("/pendingPayments");
  const navigation = useNavigation();

  const handleGetDetailStats = async (course_id) => {
    try {
      const response = await axios.get(`${URL_API}/course_stat/${course_id}`);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPurchases = async () => {
    try {
      const response = await axios.get(`${URL_API}/owned_courses`);
      if (response?.status === 200) {
        setPurchases(response.data.courses);
        const promises = response.data.courses?.map(async (course) => {
          const statsCourse = await handleGetDetailStats(course?.course);
          return statsCourse;
        });
        Promise.all(promises).then((dataCourses) => {
          setDetailStatsCourse(dataCourses);
          console.log(dataCourses);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const timeExpiredPayment = (createdAt) => {
    const createdAtDate = new Date(createdAt); // Konversi ke objek Date
    createdAtDate.setHours(createdAtDate.getHours() + 24); // Tambahkan 24 jam

    const now = new Date(); // Waktu sekarang
    const timeDifference = createdAtDate - now; // Selisih waktu dalam milidetik

    const timeInSeconds = Math.max(Math.floor(timeDifference / 1000), 0);
    return timeInSeconds;
  };

  useEffect(() => {
    handleGetPurchases();
  }, []);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
          My Course
        </Text>
        <View style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={["Purchases", "Recently View", "Wishlist", "Status Payment"]}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setTabActive(item)}
                style={{ marginBottom: 20 }}
              >
                <Text style={styles.tab(tabActive, item)}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        {tabActive === "Purchases" &&
          purchases?.map((purchased, index) => (
            <View
              key={purchased?.id}
              style={{
                padding: 10,
                borderWidth: 0.5,
                borderRadius: 10,
                borderColor: COLORS.gray,
                position: "relative",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                }}
              >
                <Image
                  source={{ uri: purchased?.ms_EnterpriseCourse?.thumbnail }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("course-detail", {
                        id: purchased?.ms_EnterpriseCourse?.id,
                      })
                    }
                  >
                    <Text style={{ fontWeight: "700" }}>
                      {purchased?.ms_EnterpriseCourse?.title}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 15,
                      alignItems: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Feather name="users" size={15} color="black" />
                      <Text>
                        {detailStatsCourse[index]?.student_count || 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <FontAwesome
                        name={
                          detailStatsCourse[index]?.rating > 0
                            ? "star"
                            : "star-o"
                        }
                        size={15}
                        color={
                          detailStatsCourse[index]?.rating > 0
                            ? COLORS.orange
                            : "black"
                        }
                      />

                      <Text>{detailStatsCourse[index]?.rating || 0}</Text>
                    </View>
                    <Level level={purchased?.ms_EnterpriseCourse?.level} />
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <RenderHTML
                  source={{ html: purchased?.ms_EnterpriseCourse?.description }}
                />
                <View
                  style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
                >
                  <MaterialCommunityIcons
                    name="folder-multiple-outline"
                    size={16}
                    color="black"
                  />
                  <Text>{detailStatsCourse[index]?.submod_count} Module</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: COLORS.main,
                  borderRadius: 7,

                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Review</Text>
              </TouchableOpacity>
            </View>
          ))}
        {tabActive === "Recently View" &&
          recentlyView?.r?.map((recently, index) => (
            <View
              key={recently?.id}
              style={{
                padding: 10,
                borderWidth: 0.5,
                borderRadius: 10,
                borderColor: COLORS.gray,
                position: "relative",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                }}
              >
                <Image
                  source={{ uri: recently?.ms_EnterpriseCourse?.thumbnail }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("course-detail", {
                        id: recently?.ms_EnterpriseCourse?.id,
                      })
                    }
                  >
                    <Text style={{ fontWeight: "700" }}>
                      {recently?.ms_EnterpriseCourse?.title}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 15,
                      alignItems: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Feather name="users" size={15} color="black" />
                      <Text>
                        {detailStatsCourse[index]?.student_count || 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <FontAwesome
                        name={
                          detailStatsCourse[index]?.rating > 0
                            ? "star"
                            : "star-o"
                        }
                        size={15}
                        color={
                          detailStatsCourse[index]?.rating > 0
                            ? COLORS.orange
                            : "black"
                        }
                      />

                      <Text>{detailStatsCourse[index]?.rating || 0}</Text>
                    </View>
                    <Level level={recently?.ms_EnterpriseCourse?.level} />
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <RenderHTML
                  source={{ html: recently?.ms_EnterpriseCourse?.description }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <AntDesign name="eye" size={16} color="black" />
                  <Text>{moment(recently?.createdAt).fromNow()}</Text>
                </View>
              </View>
            </View>
          ))}
        {tabActive === "Wishlist" &&
          userWishlist?.r?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("course-detail", {
                  id: item?.ms_EnterpriseCourse?.id,
                })
              }
              style={styles.popularCourseContent}
            >
              <Image
                style={styles.popularCourseImage}
                source={{ uri: item.thumbnail }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 15,
                  marginTop: 5,
                }}
              >
                <BadgeCourse
                  courseType={item?.ms_EnterpriseCourse?.course_type}
                />
              </View>
              <Text style={styles.contentTitleCourse}>
                {item?.ms_EnterpriseCourse?.title}
              </Text>
              <Text style={styles.contentLessionCourse}>
                Rp
                {Number(item?.ms_EnterpriseCourse?.price).toLocaleString(
                  "id-ID"
                )}
              </Text>
            </TouchableOpacity>
          ))}

        {tabActive === "Status Payment" &&
          pendingPayments?.pending_payments?.map((pending, index) => (
            <View
              key={pending?.id}
              style={{
                padding: 10,
                borderWidth: 0.5,
                borderRadius: 10,
                borderColor: COLORS.gray,
                position: "relative",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                }}
              >
                <Image
                  source={{ uri: pending?.ms_EnterpriseCourse?.thumbnail }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("cart-detail", {
                        id: pending?.payment_id,
                      })
                    }
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: COLORS.gray }}>
                        Virtual Account :
                      </Text>
                      {pending?.pay_method?.includes("MANDIRI") ? (
                        <Image
                          source={{
                            uri: `../assets/atm-mandiri.png`,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: `../assets/atm-bca.png`,
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ fontWeight: "700" }}>
                      {pending?.external_id?.replaceAll("-", "")}
                    </Text>
                    <Text style={{ fontWeight: "700" }}>
                      Rp
                      {Number(
                        pending?.ms_EnterpriseCourse?.price
                      ).toLocaleString()}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 3,
                        backgroundColor: COLORS.orange,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        Pay before:{" "}
                        {moment(
                          new Date(pending?.createdAt).getTime() +
                            24 * 60 * 60 * 1000
                        ).format("DD/MM/YYYY HH:mm")}{" "}
                        Wib
                      </Text>
                      {/* <CountDown
                        style={{ flexDirection: "row", alignItems: "center" }}
                        size={12} */}
                      {/* //   until={84231}
                      //   digitStyle={{
                      //     backgroundColor: "transparent",
                      //     borderWidth: 0,
                      //     flexDirection: "row",
                      //   }}
                      //   digitTxtStyle={{ color: "white", marginBottom: 0 }}
                      //   timeLabelStyle={{
                      //     color: "white",
                      //     fontWeight: "bold",
                      //     marginTop: 0,
                      //     fontSize: 10,
                      //   }}
                      //   timeToShow={["H", "M", "S"]}
                      //   timeLabels={{ m: null, s: null, h: null }}
                      //   showSeparator
                      //   separatorStyle={{ color: "white" }}
                      // /> */}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <BottomMenuBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  tab: (tabActive, item) => {
    return {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderWidth: tabActive !== item ? 1 : 0,
      borderColor: COLORS.gray,
      color: tabActive === item ? "#fff" : COLORS.gray,
      borderRadius: 100,
      marginRight: 15,
      backgroundColor: tabActive === item ? COLORS.main : "#fff",
    };
  },
  popularCourseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  popularCourseContent: {
    marginRight: 15,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000", // Warna bayangan
    shadowOffset: {
      width: 0,
      height: 2,
    }, // Ukuran offset bayangan
    shadowOpacity: 0.2, // Opasitas bayangan
    shadowRadius: 3, // Radius bayangan
    width: 200,
  },
  popularCourseImage: {
    width: 200,
    height: 117,
    marginBottom: 10,
  },
  contentTitleCourse: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  contentLessionCourse: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
