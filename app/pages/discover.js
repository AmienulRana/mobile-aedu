import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  BackHandler,
  Text,
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
import { TouchableOpacity } from "react-native";
import COLORS from "../components/shared/COLORS";
import { useLanguageContext } from "../context/LanguageContext";
import { FlatList } from "react-native";
import BadgeCourse from "../components/common/badge-course";

export default function Discover() {
  const { data } = useFetch("/courses/1");
  const [loginMode, setLoginMode] = useState(null);
  const navigation = useNavigation();
  const router = useRoute();
  const { language } = useLanguageContext();

  const getDataStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("login-mode");
      setLoginMode(value);
    } catch (e) {
      console.log(e);
    }
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('category', value);
    } catch (e) {
      // saving error
    }
  };
  const handleNavigateHome = (category) => {
    navigation.navigate('home', {category});
    storeData(category);
  }

  useEffect(() => {
    getDataStorage();
  }, []);

  useEffect(() => {
    if (loginMode === "enterprise") {
      navigation.navigate("enterprise-home");
    }
  }, [loginMode]);

  useEffect(() => {
    if (router?.name === "discover") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          BackHandler.exitApp();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [router, navigation]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <SearchBar />
        <Image source={require("../assets/banner.png")} style={styles.banner} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          {language === "EN"? "Category" : "Kategori"}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
          onPress={() => handleNavigateHome('Health')}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/healthcare.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
            {language === "EN"? "Health" : "Kesehatan"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => handleNavigateHome('Tech')}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/technology.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
            {language === "EN"? "Technology" :"Teknologi"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => handleNavigateHome('Art')}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/palette.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
            {language === "EN"? "Art Design" : "Art Desain"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 40, marginBottom: 50 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
            {language === "EN"
              ? "Discover the top workshop in here"
              : "Temukan workshop terbaik disini "}
          </Text>
          <Text style={{ color: COLORS.gray, marginBottom: 20 }}>
            {language === "EN"
              ? "Learn from the best place"
              : "Belajar dari tempat terbaik"}
          </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data?.result?.slice(0,3)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("course-detail", { id: item?.id })
              }
              style={styles.advanceCourseContent}
            >
              <Image
                style={styles.advanceCourseImage}
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
                <BadgeCourse courseType={item?.course_type} />
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.contentTitleCourse}
              >
                {item.title}
              </Text>
              <Text style={styles.contentLessionCourse}>
                Rp{Number(item.price).toLocaleString("id-ID")}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(image, index) => index.toString()}
        />
        </View>
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

  advanceCourseContainer: {
    marginTop: 15,
    marginBottom: 30,
  },
  advanceCourseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  advanceCourseContent: {
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
  advanceCourseImage: {
    width: 200,
    height: 117,
    marginBottom: 10,
  },
  contentTitleCourse: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
});
