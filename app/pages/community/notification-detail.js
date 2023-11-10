import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { PostCard } from "./home";
import { Ionicons } from "@expo/vector-icons";

export default function CommunityNotifDetail() {
  const { data } = useFetch("/comm/postAd", URL_API_COMM);
  const navigation = useNavigation();
  const [postDetail, setPostDetail] = useState({});
  const router = useRoute();
  useEffect(() => {
    const filterPost = data?.[0]?.find(
      (post) => post?.id === router?.params?.post_id
    );
    setPostDetail(filterPost);
    console.log(filterPost);
  }, [data, router]);

  return (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 30 }}></View>
        {postDetail ? (
          <PostCard post={postDetail} />
        ) : (
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            Opps Sorry we can't find post!
          </Text>
        )}
        {/* {data?.[0]?.map((post) => (
            
          ))} */}
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
});
