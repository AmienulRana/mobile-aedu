import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { getTimeAgoString } from "../../components/utils/helper";
import PageHeaderCommunity from "../../components/common/page-header-community";
import { useProfileContext } from "../../context/useProfileContext";

export const JobAvailable = ({ jobs }) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: COLORS.main,
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderStartEndRadius: 5,
          borderRadiusTopStart: 5,
        }}
      >
        <Text style={{ color: "white" }}>Jobs based on your Profile</Text>
      </View>
      {jobs?.map((job) => (
        <TouchableOpacity
          key={job?.id}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("community-job-detail", { id_jobs: job?.id })
          }
        >
          <View style={styles.wrapperJobs}>
            <Image
              source={require("../../assets/courses/course-1.png")}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.jobName}>{job?.job_name}</Text>
              <Text style={styles.companyName}>
                {job?.ms_User?.ms_EnterpriseProfile?.business_name}
              </Text>
              <Text
                style={styles.location}
              >{`${job?.ms_City?.name}, Indonesia (On-Site)`}</Text>
              <Text style={styles.postingDate}>
                {getTimeAgoString(job?.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

export const MyJobs = ({ jobs }) => {
  const navigation = useNavigation();
  return (
    <>
      {jobs?.map((job) => (
        <TouchableOpacity
          key={job?.id}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("community-job-detail", {
              id_jobs: job?.job_ad,
            })
          }
        >
          <View style={styles.wrapperJobs}>
            <Image
              source={require("../../assets/courses/course-1.png")}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.jobName}>{job?.ms_JobAd?.job_name}</Text>
              <Text style={styles.companyName}>
                {job?.ms_JobAd?.ms_User?.ms_EnterpriseProfile?.business_name}
              </Text>
              <Text
                style={styles.location}
              >{`${job?.ms_JobAd?.ms_City?.name}, Indonesia (On-Site)`}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={styles.postingDate}>
                  {job?.status === "Pending" && "Applied"}{" "}
                  {getTimeAgoString(job?.createdAt)}
                </Text>
                {job?.status === "Pending" && (
                  <Text
                    style={[
                      styles.statusJob,
                      {
                        backgroundColor: "#fae48b",
                        color: "#b45309",
                      },
                    ]}
                  >
                    Pending
                  </Text>
                )}
                {job?.status === "Accepted" && (
                  <Text
                    style={[
                      styles.statusJob,
                      {
                        backgroundColor: COLORS.main,
                        color: "#fff",
                      },
                    ]}
                  >
                    Accepted
                  </Text>
                )}

                {job?.status === "Rejected" && (
                  <Text
                    style={[
                      styles.statusJob,
                      {
                        backgroundColor: "#ec4446",
                        color: "#fff",
                      },
                    ]}
                  >
                    Rejected
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};
export const SaveJobs = ({ jobs }) => {
  const navigation = useNavigation();
  return (
    <>
      {jobs?.map((job) => (
        <TouchableOpacity
          key={job?.id}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("community-job-detail", {
              id_jobs: job?.job_ad,
            })
          }
        >
          <View style={styles.wrapperJobs}>
            <Image
              source={require("../../assets/courses/course-1.png")}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.jobName}>{job?.ms_JobAd?.job_name}</Text>
              <Text style={styles.companyName}>
                {job?.ms_JobAd?.ms_User?.ms_EnterpriseProfile?.business_name}
              </Text>
              <Text
                style={styles.location}
              >{`${job?.ms_JobAd?.ms_City?.name}, Indonesia (On-Site)`}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={styles.postingDate}>
                  Saved {getTimeAgoString(job?.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default function CommunityJobs() {
  const [tabActive, setTabActive] = useState("All Jobs");
  const { data: jobs } = useFetch("/comm/allJobs", URL_API_COMM);
  const { data: myJobs } = useFetch("/comm/getAppliedJobs/All", URL_API_COMM);
  const { data: saveJobs } = useFetch("/comm/saved_jobs", URL_API_COMM);
  const { profileContext } = useProfileContext();

  useEffect(() => {
    console.log(profileContext);
  }, [profileContext]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={{ marginTop: 30, backgroundColor: COLORS.main }}></View>

        <View style={{ paddingVertical: 15 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={
              !profileContext.enterpise
                ? ["All Jobs", "My Jobs", "Save Jobs"]
                : ["All Jobs"]
            }
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
        {tabActive === "All Jobs" && <JobAvailable jobs={jobs} />}
        {!profileContext?.enterpise && (
          <>
            {tabActive === "My Jobs" && <MyJobs jobs={myJobs} />}
            {tabActive === "Save Jobs" && <SaveJobs jobs={saveJobs} />}
          </>
        )}
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
  wrapperJobs: {
    flexDirection: "row",
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: "black",
    paddingVertical: 4,
    paddingBottom: 12,
    alignItems: "start",
    marginTop: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
  },
  jobName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.main,
  },
  companyName: {
    fontSize: 14,
    color: "black",
  },
  location: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  postingDate: {
    fontSize: 12,
    color: COLORS.main, // Ganti dengan warna teks yang sesuai
    marginTop: 5,
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
  statusJob: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    fontSize: 12,
  },
});
