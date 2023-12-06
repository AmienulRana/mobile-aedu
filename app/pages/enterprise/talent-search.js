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

export default function TalentSearchEnterprise() {
  const navigation = useNavigation();

  const { data, fetchData: fetchJobs } = useFetch(
    "/enter/userJobs",
    URL_API_ENTER
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();

    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <PageHeaderCommunity />

        <View style={styles.containerBanner}>
          <Text style={styles.text}>Want to find suitable talent?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("enterprise-talent-create")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Create Jobs</Text>
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
            The Talent Search Page is where you can search for and discover
            potential talents. From here, you can apply filters and criteria to
            find individuals with matching skills. This allows you to identify
            talents that fit your needs and take further actions, such as
            communicating or recruiting.
          </Text>
        </View>

        <Text style={{ fontSize: 16, marginVertical: 16, fontWeight: 900 }}>
          {data?.length || 0} Active Jobs
        </Text>
        {data?.map((job, i) => (
          <View
            key={i}
            style={{
              border: 1,
              padding: 10,
              backgroundColor: "white",
              marginBottom: 15,
              borderWidth: 2,
              borderColor: "rgba(0,0,0,.2)",
              borderRadius: 4,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <FontAwesome name="pencil" size={18} color={COLORS.gray} />
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: "gray" }}>
              {job?.ms_JobSector?.name?.toUpperCase()}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('enterprise-talent-create', {job_id: job?.id})}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {job?.job_name}
            </Text>

            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                color: "gray",
                fontWeight: "bold",
                marginTop: 6,
                marginBottom: 3,
              }}
            >
              Candidate:
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontSize: 14,
                    marginBottom: 2,
                    color: "gray",
                  }}
                >
                  TOTAL
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {job?.employer}
                </Text>
              </View>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: COLORS.gray,
                  paddingLeft: 12,
                  width: "50%",
                }}
              >
                <Text style={{ fontSize: 14, marginBottom: 2, color: "green" }}>
                  NEW
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>0</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 15,
                gap: 20,
              }}
            >
              <Text>{job?.loc_type}</Text>
              <Text>{job?.job_type}</Text>
            </View>
            <TouchableOpacity style={{ marginTop: 3 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "gray",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                See Details
              </Text>
            </TouchableOpacity>
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
});
