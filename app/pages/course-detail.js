import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  StyleSheet,
  FlatList,
  Alert,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../components/shared/COLORS";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useFetch, { URL_API } from "../hooks/useFetch";
import RenderHTML from "react-native-render-html";
import InformationDetail, {
  CourseInformation,
} from "../components/pages/detail-course/information-detail";
import COLORS from "../components/shared/COLORS";
import DetailMaterial from "../components/pages/detail-course/detail-material";
import { averageRating } from "../components/utils/helper";
import BadgeCourse from "../components/common/badge-course";
import DescriptionCourse from "../components/pages/detail-course/description-course";
import axios from "axios";
import Collapsible from "react-native-collapsible";
import YoutubePlayer from "react-native-youtube-iframe";
import FinishCourse from "../components/pages/detail-course/finish-course";

const courses = [
  "Introduction",
  "Variables",
  "Data Types",
  "Numbers",
  "Casting",
];

export default function CourseDetail() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const router = useRoute();
  const { data, isLoading: loadingDetail } = useFetch(
    `/courseDetail/${router?.params?.id}`
  );
  const { data: ownedCourse, isLoading: loadingOwned } =
    useFetch(`/owned_courses`);
  const { data: coursesContent } = useFetch(`/learn/${router.params?.id}`);
  const { data: coursesProgress } = useFetch(
    `/progression/${router.params?.id}`
  );

  const [isMyCourse, setIsMyCourse] = useState(false);
  const [expandModule, setExpandModule] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState("");
  const [subModuleActive, setSubModuleActive] = useState({});
  const [finishCourse, setFinishCourse] = useState(false);

  const handleCheckoutPage = async () => {
    try {
      const response = await axios.get(
        `${URL_API}/addto_cart/${router.params?.id}`
      );
      if (response.status === 200) {
        navigation.navigate("cart");
      }
    } catch (error) {
      Alert.alert("Failed to checkout!");
    }
  };

  const findNextSubModule = () => {
    if (subModuleActive) {
      const allSubModules = coursesContent?.ms_CourseModules?.flatMap(
        (module) => module?.ms_CourseSubModules
      );

      const currentSubModuleIndex = allSubModules?.findIndex(
        (subModule) => subModule?.id === subModuleActive?.id
      );
      if (currentSubModuleIndex !== -1) {
        const nextSubModuleIndex = currentSubModuleIndex + 1;
        if (nextSubModuleIndex < allSubModules?.length) {
          const nextSubModule = allSubModules[nextSubModuleIndex];
          return nextSubModule;
        } else {
          return false;
        }
      }
    }
  };

  const findRelativeSubModule = (type) => {
    const relativeIndex = type === "next" ? 1 : -1;
    if (subModuleActive) {
      const allSubModules = coursesContent?.ms_CourseModules?.flatMap(
        (module) => module?.ms_CourseSubModules
      );

      const currentSubModuleIndex = allSubModules?.findIndex(
        (subModule) => subModule?.id === subModuleActive?.id
      );

      if (currentSubModuleIndex !== -1) {
        const targetIndex = currentSubModuleIndex + relativeIndex;

        if (targetIndex >= 0 && targetIndex < allSubModules?.length) {
          return allSubModules[targetIndex];
        } else {
          return false;
        }
      }
    }
  };

  useEffect(() => {
    const findMyCourse = ownedCourse?.courses?.find(
      (course) => course?.course === router?.params?.id
    );
    setIsMyCourse(findMyCourse);
  }, [ownedCourse]);

  useEffect(() => {
    setSubModuleActive(
      coursesContent?.ms_CourseModules?.[0]?.ms_CourseSubModules?.[0]
    );
  }, [coursesContent]);
  useEffect(() => {
    findNextSubModule();
  }, [subModuleActive, coursesContent]);
  return (
    <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
      <StatusBar backgroundColor="#fff" />
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-sharp" size={24} color="black" />
        {isMyCourse && (
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {data?.course?.title}
          </Text>
        )}
      </TouchableOpacity>
      {finishCourse ? (
        <FinishCourse />
      ) : (
        !loadingDetail &&
        !loadingOwned &&
        (!isMyCourse ? (
          <ScrollView
            style={{ marginBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <DescriptionCourse data={data} />
            <View>
              <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
                Assignment
              </Text>
              <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
                Pre-requisites
              </Text>
              <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
                Detail Course
              </Text>
              <View style={styles.detailCourseWrapper}>
                <BadgeCourse courseType={data?.course?.course_type} />
                {data?.course?.course_type === "Book" ? (
                  <DetailMaterial data={data} />
                ) : (
                  <InformationDetail data={data} />
                )}
                <CourseInformation
                  Icon={
                    <MaterialCommunityIcons
                      name="star"
                      size={20}
                      color={
                        data?.course?.zms_CRatings?.length > 0
                          ? COLORS.orange
                          : "black"
                      }
                    />
                  }
                  value={`${Math.round(
                    averageRating(data?.course?.zms_CRatings) || 0
                  )} (${data?.course?.zms_CRatings?.length || 0})`}
                />

                <TouchableOpacity
                  onPress={() => handleCheckoutPage()}
                  style={styles.btnCheckout}
                >
                  <Text style={{ color: "white" }}>Buy Now</Text>
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                    alignItems: "center",
                  }}
                >
                  <Text>Total Price</Text>
                  <Text style={styles.price}>
                    Rp{Number(data?.course?.price || 0).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            // style={{ paddingBottom: 50 }}
          >
            {/* <DescriptionCourse data={data} /> */}
            <View style={{ marginTop: 20 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
              >
                {subModuleActive?.submod_title}
              </Text>
              {subModuleActive?.content_type === "content" && (
                <RenderHTML
                  source={{ html: subModuleActive?.content }}
                  contentWidth={width}
                />
              )}
              {subModuleActive?.content_type === "video" && (
                <>
                  <YoutubePlayer height={200} play videoId={"Nt-NPpyR9sI"} />
                  <Text style={{ marginTop: 10 }}>
                    {subModuleActive?.video_desc}
                  </Text>
                </>
              )}
            </View>
            <View style={{ marginTop: 220 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 0 }}
              >
                Course Content
              </Text>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ textAlign: "right", marginBottom: 5 }}>
                  {coursesProgress?.perc}%
                </Text>
                <View style={styles.containerGray}>
                  <View
                    style={[
                      styles.bar,
                      { width: `${coursesProgress?.perc || 0}%` },
                    ]}
                  ></View>
                </View>
              </View>
              {coursesContent?.ms_CourseModules?.map(
                (item, index) =>
                  (subModuleActive?.cm_id === item?.id || expandModule) && (
                    <View
                      key={item?.id}
                      style={{
                        backgroundColor: "#fff",
                        marginBottom: 15,
                        padding: 13,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: colors.gray,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setIsCollapsed(item?.id)}
                        style={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",

                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {expandModule && (
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: colors.gray,
                                marginRight: 20,
                              }}
                            >
                              {index + 1}
                            </Text>
                          )}
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {item?.mod_title}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                          {item?.tmp_SubModuleProgressions?.length} /{" "}
                          {item?.ms_CourseSubModules?.length}
                        </Text>
                      </TouchableOpacity>
                      <Collapsible
                        collapsed={isCollapsed === item?.id ? false : true}
                      >
                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                          {item?.ms_CourseSubModules?.map(
                            (subModule, index) => (
                              <TouchableOpacity
                                key={subModule?.id}
                                onPress={() => setSubModuleActive(subModule)}
                              >
                                <Text style={{ marginBottom: 10 }}>
                                  {index + 1}. {subModule?.submod_title}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </Collapsible>
                    </View>
                  )
              )}
              <TouchableOpacity
                style={{
                  marginTop: 0,
                  marginBottom: 15,
                  flexDirection: "row",
                  gap: 7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setExpandModule((prev) => !prev)}
              >
                <Text style={{ textAlign: "center", color: COLORS.main }}>
                  Expand List
                </Text>
                <MaterialCommunityIcons
                  name="folder-multiple-outline"
                  size={16}
                  color={COLORS.main}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: findRelativeSubModule("prev")
                  ? "space-between"
                  : "flex-end",
                alignItems: "center",
                marginBottom: 50,
                marginTop: 20,
              }}
            >
              {findRelativeSubModule("prev") && (
                <TouchableOpacity
                  style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
                  onPress={() =>
                    setSubModuleActive(findRelativeSubModule("prev"))
                  }
                >
                  <Ionicons
                    name="chevron-back-sharp"
                    size={20}
                    color={COLORS.gray}
                  />
                  <Text
                    style={{
                      color: COLORS.gray,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Back
                  </Text>
                </TouchableOpacity>
              )}
              {findNextSubModule() ? (
                <TouchableOpacity
                  style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
                  onPress={() => setSubModuleActive(findNextSubModule())}
                >
                  <Text
                    style={{
                      color: COLORS.main,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {findNextSubModule()?.submod_title}
                  </Text>
                  <Ionicons
                    name="chevron-forward-sharp"
                    size={20}
                    color={COLORS.main}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setFinishCourse(true)}
                  style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: COLORS.main,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Finish
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailCourseWrapper: {
    borderColor: COLORS.main,
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  btnCheckout: {
    backgroundColor: COLORS.main,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
    marginTop: 10,
    gap: 10,
  },
  price: {
    fontSize: 18,
    color: COLORS.main,
    fontWeight: "bold",
  },
  containerGray: {
    backgroundColor: "#eaeaea",
    borderRadius: 5,
    marginBottom: 20,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.main,
  },
});
