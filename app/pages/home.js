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

export default function Home() {
  const { data } = useFetch("/courses/1");
  const router = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      navigation.navigate("login");
    }, 2000);
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <SearchBar />
        <Image source={require("../assets/banner.png")} style={styles.banner} />
        <ContinueLearn />
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
