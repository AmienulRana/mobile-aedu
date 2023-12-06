import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  BackHandler,
  Text,
  TouchableOpacity,
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
import { useLanguageContext } from "../context/LanguageContext";
import COLORS from "../components/shared/COLORS";

export default function Home() {
  const { data, fetchData } = useFetch("/courses/1");
  const [loginMode, setLoginMode] = useState(null);
  const navigation = useNavigation();
  const router = useRoute();
  const { language } = useLanguageContext();

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
        {router?.params?.category === "Tech" && (
          <Image
            source={require("../assets/banner/tech.png")}
            style={styles.banner}
          />
        )}
        {router?.params?.category === "Health" && (
          <Image
            source={require("../assets/banner/health.png")}
            style={styles.banner}
          />
        )}
        {router?.params?.category === "Art" && (
          <Image
            source={require("../assets/banner/art.png")}
            style={styles.banner}
          />
        )}
        <ContinueLearn />
        <UpcommingEvent />
        {/* <PopularCourse courses={data?.result} /> */}
        <AdvanceCourse courses={data?.result} />

        <View style={{ marginBottom: 40, backgroundColor: "white", borderWidth: 1, borderColor: COLORS.main, padding: 15, borderRadius: 15 }}>
          <Text style={{ fontWeight: 700, fontSize: 18 }}>
            {language === "EN"
              ? "Join our community"
              : "Bergabung dengan komunitas kami"}
          </Text>
          <Text style={{ marginTop: 20 }}>
            {language === "EN"
              ? "Joining the a Community member is a great introduction to the quickly evolving and specialized field of online education. Membership is free and gives you the opportunity to expand your professional development by networking in worldwide."
              : "Bergabung dengan anggota Komunitas merupakan pengenalan yang bagus terhadap bidang pendidikan online yang berkembang pesat dan terspesialisasi. Keanggotaannya gratis dan memberi Anda kesempatan untuk mengembangkan pengembangan profesional Anda melalui jaringan di seluruh dunia."}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('community-home', {community_type: router?.params?.category})} style={{backgroundColor: COLORS.main, marginTop: 20, paddingVertical: 8, borderRadius: 5,}}>
            <Text style={{color:'white', textAlign:'center'}}>{language === 'EN' ? 'Community' : 'Komunitas'}</Text>
          </TouchableOpacity>
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
    height: 200,
    borderRadius: 20,
    objectFit: "cover",
    width: "100%",
  },
});
