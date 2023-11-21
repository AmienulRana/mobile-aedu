import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/page-header";
import SearchBar from "../components/common/search-bar";
import ContinueLearn from "../components/pages/home/continue-learn";
import PopularCourse from "../components/pages/home/popular-course";
import AdvanceCourse from "../components/pages/home/advance-course";
import { useNavigation, useRoute } from "@react-navigation/native";
import useFetch from "../hooks/useFetch";
import BottomMenuBar from "../components/common/bottom-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpcommingEvent from "../components/pages/home/upcomming-event";

export default function Home() {
  const { data } = useFetch("/courses/1");
  const [loginMode, setLoginMode] = useState(null);
  const navigation = useNavigation();

  const getDataStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("login-mode");
      // value previously stored
      setLoginMode(value);
      console.log("login mode =>>>>", value);
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  useEffect(() => {
    getDataStorage();
  }, []);

  useEffect(() => {
    if (loginMode === "enterprise") {
      navigation.navigate("enterprise-home");
    }
  }, [loginMode]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <SearchBar />
        <Image source={require("../assets/banner.png")} style={styles.banner} />
        <ContinueLearn />
        <UpcommingEvent />
        <PopularCourse courses={data?.result} />
        <AdvanceCourse courses={data?.result} />
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
  banner: {
    marginTop: 30,
  },
});
