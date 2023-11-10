import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { PostCard } from "./home";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../components/shared/COLORS";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ModalCreatePost } from "./post";
import PageHeaderCommunity from "../../components/common/page-header-community";

export default function CommunityDetail() {
  const [showModal, setShowModal] = useState(false);
  const router = useRoute();
  const { data, fetchData } = useFetch(
    `/comm/group_posts/${router.params?.community_id}`,
    URL_API_COMM
  );
  const { data: detailCommunity, fetchData: fetchDetailCommunity } = useFetch(
    `/comm/group/${router.params?.community_id}`,
    URL_API_COMM
  );
  const [postGroup, setPostGroup] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDetailCommunity();
  }, [router]);
  useEffect(() => {
    const removeGroupProp = data?.data?.map((group) => ({
      ...group,
      for_group: null,
    }));
    setPostGroup(removeGroupProp);
  }, [data]);
  return (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={{ marginTop: 40 }}>
          <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
            <Image
              source={require("../../assets/courses/course-3.png")}
              style={{ width: 50, height: 50, borderRadius: 5 }}
            />
            <Text style={{ flex: 1, fontSize: 20, fontWeight: "bold" }}>
              {detailCommunity?.group_name}
            </Text>
          </View>
          <Text style={{ color: COLORS.gray, marginTop: 20, marginBottom: 20 }}>
            {detailCommunity?.about}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          activeOpacity={0.9}
        >
          <View style={styles.profileContainer}>
            <View
              style={[
                styles.profileAvatar,
                {
                  backgroundColor: data?.[0]?.ms_User?.ms_Profile?.first_name
                    ? COLORS?.main
                    : "#EDEDED",
                },
              ]}
            >
              {data?.[0]?.ms_User?.ms_Profile?.first_name ? (
                <Text style={styles.avatarText}>
                  {data?.[0]?.ms_User?.ms_Profile?.first_name?.slice(0, 1) ||
                    "X"}
                </Text>
              ) : (
                <FontAwesome name="user" size={20} color="#A9A9A9" />
              )}
            </View>
            <View style={styles.input} onPress={() => setShowModal(true)}>
              <Text style={{ color: COLORS.gray }}>
                What's do you want to talk about??
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.imageTextContainer}>
              <FontAwesome name="image" size={18} color="#06b6d4" />
              <Text style={styles.imageText}>Add Image</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.postButton}
            >
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 30 }}></View>
        {postGroup?.map((post) => (
          <PostCard key={post?.id} post={post} />
        ))}
      </ScrollView>
      {showModal && (
        <ModalCreatePost
          communityDefault={router?.params?.community_id}
          fetchData={fetchData}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
    marginTop: 20,
  },
  profileImage: {
    // Add your image style here
  },
  profileAvatar: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: "#A9A9A9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  imageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    gap: 15,
  },
  imageText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: COLORS.main,
    borderRadius: 5,
    width: 100,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
  },
});
