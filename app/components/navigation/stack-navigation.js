import { StyleSheet } from "react-native";
import Login from "../../pages/login";
import Home from "../../pages/home";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseDetail from "../../pages/course-detail";
import Profile from "../../pages/profile";
import MyCourse from "../../pages/my-course-";
import MyCart from "../../pages/cart";
import CartDetail from "../../pages/cart-detail";
import CommunityHome from "../../pages/community/home";
import ScreenLoading from "../../pages/community/screen-loading";
import { CartAddress } from "../../pages/cart-pages";
import CommunityMyNetwork from "../../pages/community/my-network";
import ProfileCommunity from "../../pages/community/profile";
import CommunityJobs from "../../pages/community/jobs";
import CommunityJobsDetail from "../../pages/community/jobs-detail";
import CommunityPost from "../../pages/community/post";
import CommunityNotification from "../../pages/community/notification";
import CommunityMessage from "../../pages/community/message";
import MyCommunity from "../../pages/community/my-community";
import CommunityDetail from "../../pages/community/detail-community";
import CommunityProfileDetail from "../../pages/community/detail-profile";
import CommunitySearch from "../../pages/community/community-search";
import CommunityProfileView from "../../pages/community/profile-view";
import CommunityNotifDetail from "../../pages/community/notification-detail";
import HomeEnterprise from "../../pages/enterprise/home-enterprise";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LearningEnterprise from "../../pages/enterprise/learning";
import PurchasedMaterialEnterprise from "../../pages/enterprise/purchased-material";
import LearningCreate from "../../pages/enterprise/learning-create";
import AdvertiseEnterprise from "../../pages/enterprise/advertise";
import TalentSearchEnterprise from "../../pages/enterprise/talent-search";
import AdvertiseCreate from "../../pages/enterprise/advertise-create";
import TalentSearchCreate from "../../pages/enterprise/talent-search-create";
import { useProfileContext } from "../../context/useProfileContext";
import ListParticipantEnterprise from "../../pages/enterprise/list-parcipant";
import MyTicket from "../../pages/my-ticket";
import ReportPost from "../../pages/community/report-post";
import Discover from "../../pages/discover";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const { profileContext } = useProfileContext();

  return (
    <NavigationContainer theme={{ colors: { background: "white" } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="discover" component={Discover} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="course-detail" component={CourseDetail} />
        <Stack.Screen name="my-ticket" component={MyTicket} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="my-course" component={MyCourse} />
        <Stack.Screen name="cart" component={MyCart} />
        <Stack.Screen name="cart-detail" component={CartDetail} />
        <Stack.Screen name="cart-address" component={CartAddress} />

        <Stack.Screen name="community-home" component={CommunityHome} />
        <Stack.Screen name="community-network" component={CommunityMyNetwork} />
        <Stack.Screen name="community-profile" component={ProfileCommunity} />
        <Stack.Screen name="community-post" component={CommunityPost} />
        <Stack.Screen name="community-post-report" component={ReportPost} />
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
        <>
          <Stack.Screen name="enterprise-home" component={HomeEnterprise} />
          <Stack.Screen
            name="enterprise-learning"
            component={LearningEnterprise}
          />
          <Stack.Screen name="enterprise-ads" component={AdvertiseEnterprise} />
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
        <Stack.Screen name="community-search" component={CommunitySearch} />
        <Stack.Screen name="community-loading" component={ScreenLoading} />
        <Stack.Screen name="login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
