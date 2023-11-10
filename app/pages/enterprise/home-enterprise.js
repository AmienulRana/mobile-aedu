import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import { useNavigation, useRoute } from "@react-navigation/native";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import BottomMenuBar from "../../components/common/bottom-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomMenuEnterprise from "../../components/common/bottom-menu-enterprise";
import COLORS from "../../components/shared/COLORS";
import PageHeaderCommunity from "../../components/common/page-header-community";

export default function HomeEnterprise() {
  const navigation = useNavigation();
  const { data: jobs } = useFetch("/enter/userJobs", URL_API_ENTER);
  const { data: closedCourse } = useFetch("/enter/closedCourse", URL_API_ENTER);
  const { data: publishCourse } = useFetch(
    "/enter/publishedCourses",
    URL_API_ENTER
  );
  const { data: advertises } = useFetch("/enter/get_ad", URL_API_ENTER);

  const getDataStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("login-mode");
      if (value !== null) {
        // value previously stored
        console.log(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getDataStorage();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={styles.cardContainer}>
          <Text style={styles.header}>Courses</Text>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                navigation.navigate("/enterprise/home/course-not-close")
              }
            >
              <Text style={[styles.linkText, { color: COLORS.orange }]}>
                Course Not Close
              </Text>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCount}>
                  {closedCourse?.length} Course
                </Text>
                <Text style={styles.courseUserCount}>Total user: 0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.link}
              onPress={() => navigation.navigate("/")}
            >
              <Text style={[styles.linkText, { color: COLORS.main }]}>
                Course Active
              </Text>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCount}>
                  {publishCourse?.length} Course
                </Text>
                <Text style={styles.courseUserCount}>
                  Total user:{" "}
                  {publishCourse?.reduce(
                    (total, course) => total + course?.ms_Payments?.length,
                    0
                  )}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                navigation.navigate("/enterprise/home/course-not-close")
              }
            >
              <Text style={[styles.linkText, { color: COLORS.red }]}>
                Course Rejected
              </Text>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCount}>1 Course</Text>
                <Text style={styles.courseUserCount}>Total user: 0</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.header}>Talent Search</Text>

          {jobs?.map((job, i) => (
            <TouchableOpacity
              key={i}
              style={styles.jobLink}
              onPress={() => navigation.navigate(`/talent-search/${job?.id}`)}
            >
              <Text style={styles.jobSector}>
                {job?.ms_JobSector.name.toUpperCase()}
              </Text>
              <Text style={styles.jobName}>{job?.job_name}</Text>
              <View style={styles.jobInfo}>
                <Text style={styles.candidateInfo}>
                  Candidate: {job?.employer}
                </Text>
                <Text style={styles.newInfo}>NEW: 0</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.header, { marginBottom: 20 }]}>
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
                paddingHorizontal: 10,
              }}
            >
              <Image
                source={require("../../assets/courses/course-1.png")}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
              <View
                style={{ flex: 1, padding: 5, justifyContent: "space-between" }}
              >
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    href={`https://learning.aedu.id/course/${"12321"}`}
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                    target="_blank"
                    rel="noreferrer"
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
              </View>
            </View>
          ))}
        </View>
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
  banner: {
    marginTop: 30,
  },
  cardContainer: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    backgroundColor: "white",
    marginVertical: 25,
    justifyContent: "space-between",
    flex: 1,
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  scrollView: {
    maxHeight: 200,
  },
  link: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 3,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "yellow", // You can change the color here
  },
  courseInfo: {
    alignItems: "flex-end",
  },
  courseCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseUserCount: {
    fontSize: 14,
  },

  jobLink: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 3,
  },
  jobSector: {
    fontSize: 12,
    color: "gray",
  },
  jobName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  jobInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  candidateInfo: {
    fontSize: 14,
    color: "gray",
  },
  newInfo: {
    fontSize: 14,
    color: "green",
  },
});
