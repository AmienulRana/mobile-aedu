import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Button,
  TextInput,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { getTimeAgoString } from "../../components/utils/helper";
import moment from "moment";
import axios from "axios";
import AdsCard from "../../components/pages/community/post-card";
import PageHeaderCommunity from "../../components/common/page-header-community";

export function Avatar({ name, size, textSize }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        width: size || 40,
        height: size || 40,
        backgroundColor: COLORS.main,
      }}
    >
      <Text style={{ color: "white", fontSize: textSize || 16 }}>
        {name?.substring(0, 1)}
      </Text>
    </View>
  );
}

export function PostCard({ post, isAdsPost }) {
  const [isLike, setIsLike] = useState(post?.is_like || false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [dataComment, setDataComment] = useState([]);
  const navigation = useNavigation();

  const handleLikePost = async (id) => {
    setIsLike((prev) => !prev);
    try {
      await axios.get(`${URL_API_COMM}/comm/likePost/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateUserDetail = (user_id) => {
    if (user_id == 2) {
      navigation.navigate("community-profile");
    } else {
      navigation.navigate("community-profile-detail", { user_id });
    }
  };

  const handleSendComment = async () => {
    const payload = {
      comment,
      ms_User: {
        ms_Profile: {
          first_name: "Pspeepo",
          last_name: "Pepo",
        },
      },
      createdAt: moment(),
    };
    if (comment !== "") {
      setDataComment([...dataComment, payload]);
      setComment("");
      try {
        await axios.post(`${URL_API_COMM}/comm/commentPost/${post?.id}`, {
          comment,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log(post?.ms_PostComments);
    setDataComment(post?.ms_PostComments);
  }, [post]);
  return (
    <View
      style={{
        marginBottom: 45,
      }}
    >
      {isAdsPost ? (
        <AdsCard post={post} />
      ) : (
        <>
          {post?.for_group ? (
            <View style={{ flexDirection: "row", gap: 15 }}>
              <Image
                source={require("../../assets/courses/course-1.png")}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("community-detail", {
                      community_id: post?.ms_CommGroup?.id,
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      fontSize: 16,
                    }}
                  >
                    {post?.ms_CommGroup?.group_name}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar
                    size={20}
                    textSize={10}
                    name={
                      post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                      post?.ms_User?.ms_Profile?.first_name
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleNavigateUserDetail(post?.ms_User?.id)}
                  >
                    <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
                      {post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                        `${post?.ms_User?.ms_Profile?.first_name} ${post?.ms_User?.ms_Profile?.last_name}` ||
                        "Annonymus"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ color: COLORS.gray }}>
                    {getTimeAgoString(post?.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <Avatar
                name={
                  post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                  post?.ms_User?.ms_Profile?.first_name
                }
              />
              <TouchableOpacity
                onPress={() => handleNavigateUserDetail(post?.ms_User?.id)}
              >
                <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
                  {post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                    `${post?.ms_User?.ms_Profile?.first_name} ${post?.ms_User?.ms_Profile?.last_name}` ||
                    "Annonymus"}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: COLORS.gray }}>
                {getTimeAgoString(post?.createdAt)}
              </Text>
            </View>
          )}
          <View
            style={{
              marginTop: 15,
              borderBottomWidth: 1,
              borderColor: COLORS.gray,
              paddingBottom: 15,
            }}
          >
            <Text>{post?.post}</Text>
            {post?.attachments && (
              <Image
                source={{ uri: post?.attachments }}
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  height: 250,
                }}
                resizeMode="cover"
              />
            )}
          </View>
        </>
      )}
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          gap: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => handleLikePost(post?.id)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <AntDesign
            name="like1"
            size={20}
            color={isLike ? COLORS.blue : COLORS.gray}
          />
          <Text
            style={{
              color: isLike ? COLORS.blue : COLORS.gray,
            }}
          >
            Like ({(post?.ms_PostLikes?.length || 0) + (isLike ? 1 : 0)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <FontAwesome name="comment" size={20} color={COLORS.gray} />
          <Text style={{ color: COLORS.gray }}>
            Comment ({dataComment?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: COLORS.gray,
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <AntDesign
              name="like1"
              size={20}
              color={isLike ? COLORS.blue : COLORS.gray}
            />
            <Text
              style={{
                color: isLike ? COLORS.blue : COLORS.gray,
              }}
            >
              Like ({(post?.ms_PostLikes?.length || 0) + (isLike ? 1 : 0)})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          {dataComment?.map((comment, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", gap: 15, marginBottom: 20 }}
            >
              <Avatar name={"Amienul"} />
              <View
                style={{
                  backgroundColor: "#f4f4f4",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: 900 }}>
                    {comment?.ms_User?.ms_EnterpriseProfile?.business_name ||
                      `${comment?.ms_User?.ms_Profile?.first_name} ${comment?.ms_User?.ms_Profile?.last_name}`}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {getTimeAgoString(comment?.createdAt)}
                  </Text>
                </View>
                <Text style={{ marginTop: 5 }}>{comment?.comment}</Text>
              </View>
            </View>
          ))}
          {dataComment?.length === 0 && (
            <Text style={{ fontWeight: 600, textAlign: "center" }}>
              This post no have comment
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            position: "absolute",
            bottom: 0,
            left: 0,
            padding: 20,
            gap: 15,
          }}
        >
          <TextInput
            placeholder="Write comment.."
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 100,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onChangeText={(text) => setComment(text)}
            value={comment}
          />
          <TouchableOpacity
            onPress={() => handleSendComment()}
            style={{
              backgroundColor: COLORS.main,
              borderRadius: 100,
              width: 80,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const searchData = [
  "Microsoft",
  "Frontend Developer",
  "Backend Developer",
  "React.js",
];

export default function CommunityHome() {
  const { data, fetchData, isLoading } = useFetch("/comm/postAd", URL_API_COMM);
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();

  const [searchContent, setSearchContent] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const handleSearch = (value) => {
    setSearchContent(value);
    const searchContent = searchData.filter((data) =>
      data.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    setResultSearch(searchContent);
  };

  useEffect(() => {
    console.log(data?.[1]);
  }, [data]);
  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Redirect to Community Menu</Text>
    </View>
  ) : (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />

        <View style={{ marginTop: 30 }}></View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 30,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Search by Title Job, Skill, Or Username"
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 100,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            editable={false}
          />
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              backgroundColor: COLORS.main,
              borderRadius: 100,
              width: 80,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Search</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {data?.[0]?.map((post) => (
          <PostCard key={post?.id} post={post} />
        ))}
        {data?.[1]?.map((post, i) => (
          <PostCard key={post?.id} post={post} isAdsPost />
        ))}
      </ScrollView>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 30,
          }}
        >
          <TextInput
            placeholder="Search by Title Job, Skill, Or Username"
            style={{
              // width: "100%",
              borderWidth: 1,
              borderRadius: 100,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 20,
            }}
            value={searchContent}
            onChangeText={handleSearch}
            // onBlur={handleOnBlur}
            // onClick={() => setShowContentResult(true)}
          />
          <Text
            style={{
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            Search Results:
          </Text>
          {resultSearch.map((content, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setShowModal(false);
                navigation?.navigate("community-search", { content });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: COLORS.gray }}>{content}</Text>
            </TouchableOpacity>
          ))}

          {resultSearch?.length == 0 && searchContent && (
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                navigation?.navigate("community-search", {
                  content: searchContent,
                });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: COLORS.gray }}>{searchContent}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
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
