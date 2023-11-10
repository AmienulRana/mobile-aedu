import { StyleSheet } from "react-native";
import Login from "./app/pages/login";
import Home from "./app/pages/home";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseDetail from "./app/pages/course-detail";
import Profile from "./app/pages/profile";
import MyCourse from "./app/pages/my-course-";
import MyCart from "./app/pages/cart";
import CartDetail from "./app/pages/cart-detail";
import CommunityHome from "./app/pages/community/home";
import ScreenLoading from "./app/pages/community/screen-loading";
import { CartAddress } from "./app/pages/cart-pages";
import CommunityMyNetwork from "./app/pages/community/my-network";
import ProfileCommunity from "./app/pages/community/profile";
import CommunityJobs from "./app/pages/community/jobs";
import CommunityJobsDetail from "./app/pages/community/jobs-detail";
import CommunityPost from "./app/pages/community/post";
import CommunityNotification from "./app/pages/community/notification";
import CommunityMessage from "./app/pages/community/message";
import MyCommunity from "./app/pages/community/my-community";
import CommunityDetail from "./app/pages/community/detail-community";
import CommunityProfileDetail from "./app/pages/community/detail-profile";
import CommunitySearch from "./app/pages/community/community-search";
import CommunityProfileView from "./app/pages/community/profile-view";
import CommunityNotifDetail from "./app/pages/community/notification-detail";
import HomeEnterprise from "./app/pages/enterprise/home-enterprise";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LearningEnterprise from "./app/pages/enterprise/learning";
import PurchasedMaterialEnterprise from "./app/pages/enterprise/purchased-material";
import LearningCreate from "./app/pages/enterprise/learning-create";
import AdvertiseEnterprise from "./app/pages/enterprise/advertise";
import TalentSearchEnterprise from "./app/pages/enterprise/talent-search";
import AdvertiseCreate from "./app/pages/enterprise/advertise-create";
import TalentSearchCreate from "./app/pages/enterprise/talent-search-create";
import { ProfileProvider } from "./app/context/useProfileContext";
import ListParticipantEnterprise from "./app/pages/enterprise/list-parcipant";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loginMode, setLoginMode] = useState(null);
  // const navigation = useNavigation();
  const handleGetData = async () => {
    try {
      const value = await AsyncStorage.getItem("login-mode");
      if (value !== null) {
        // value previously stored
        setLoginMode(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  // useEffect(() => {
  //   if (loginMode === "enteprise") {
  //     navigation.navigate("enterprise-home");
  //   }
  // }, [loginMode]);
  return (
    <ProfileProvider>
      <NavigationContainer theme={{ colors: { background: "white" } }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loginMode === "enterprise" ? (
            <>
              <Stack.Screen name="enterprise-home" component={HomeEnterprise} />
              <Stack.Screen
                name="enterprise-learning"
                component={LearningEnterprise}
              />
              <Stack.Screen
                name="enterprise-ads"
                component={AdvertiseEnterprise}
              />
              <Stack.Screen
                name="enterprise-ads-create"
                component={AdvertiseCreate}
              />
              <Stack.Screen
                name="enterprise-talent"
                component={TalentSearchEnterprise}
              />
              <Stack.Screen
                name="enterprise-talent-create"
                component={TalentSearchCreate}
              />
              <Stack.Screen
                name="enterprise-purchased"
                component={ListParticipantEnterprise}
              />
              <Stack.Screen
                name="enterprise-purchased-material"
                component={PurchasedMaterialEnterprise}
              />
              <Stack.Screen
                name="enterprise-learning-create"
                component={LearningCreate}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="home" component={Home} />
              <Stack.Screen name="course-detail" component={CourseDetail} />
              <Stack.Screen name="profile" component={Profile} />
              <Stack.Screen name="my-course" component={MyCourse} />
              <Stack.Screen name="cart" component={MyCart} />
              <Stack.Screen name="cart-detail" component={CartDetail} />
              <Stack.Screen name="cart-address" component={CartAddress} />
            </>
          )}

          <Stack.Screen name="community-home" component={CommunityHome} />
          <Stack.Screen
            name="community-network"
            component={CommunityMyNetwork}
          />
          <Stack.Screen name="community-profile" component={ProfileCommunity} />
          <Stack.Screen name="community-post" component={CommunityPost} />
          <Stack.Screen name="community-jobs" component={CommunityJobs} />
          <Stack.Screen
            name="community-notification"
            component={CommunityNotification}
          />
          <Stack.Screen
            name="community-notif-detail"
            component={CommunityNotifDetail}
          />
          <Stack.Screen name="community-message" component={CommunityMessage} />
          <Stack.Screen name="community-community" component={MyCommunity} />
          <Stack.Screen name="community-detail" component={CommunityDetail} />
          <Stack.Screen
            name="community-viewed"
            component={CommunityProfileView}
          />
          <Stack.Screen
            name="community-profile-detail"
            component={CommunityProfileDetail}
          />
          <Stack.Screen
            name="community-job-detail"
            component={CommunityJobsDetail}
          />
          <Stack.Screen name="community-search" component={CommunitySearch} />
          <Stack.Screen name="community-loading" component={ScreenLoading} />
          <Stack.Screen name="login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>

    // <View>
    //   {/* <Login /> */}
    //   <Home />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
