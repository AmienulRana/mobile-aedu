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
  Linking,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { getTimeAgoString } from "../../components/utils/helper";
import moment from "moment";
import axios from "axios";
import AdsCard from "../../components/pages/community/post-card";
import PageHeaderCommunity from "../../components/common/page-header-community";
import { useProfileContext } from "../../context/useProfileContext";
import { useLanguageContext } from "../../context/LanguageContext";
import ReactNativeModal from "react-native-modal";
import { ART, HEALTH, TECH } from "../../components/shared/DATA";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Avatar({ name, size, textSize, imageUrl }) {
  return imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: size || 40, height: size || 40, borderRadius: 100 }}
    />
  ) : (
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
  const [showOption, setShowOption] = useState(false);

  const [comment, setComment] = useState("");
  const [dataComment, setDataComment] = useState([]);
  const navigation = useNavigation();
  const { profileContext } = useProfileContext();
  const { language } = useLanguageContext();

  const handleLikePost = async (id) => {
    setIsLike((prev) => !prev);
    try {
      await axios.get(`${URL_API_COMM}/comm/likePost/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateUserDetail = (user) => {
    console.log(profileContext);
    if (user?.ms_User?.ms_EnterpriseProfile) {
      Linking.openURL(
        `https://communityhub.aedu.id/profile/enterprise/${user?.ms_User?.id}`
      );
    } else if (user?.ms_User?.id == profileContext?.id) {
      navigation.navigate("community-profile");
    } else {
      navigation.navigate("community-profile-detail", {
        user_id: user?.ms_User?.id,
      });
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.get(`${URL_API_COMM}/comm/del_post/${id}`);
      // mutate(`${URL_API_COMMUNITY}/comm/userPosts`);
      Alert.alert('Success to delete post');
      setShowOption(false);
    } catch (error) {
      setShowOption(false);
      Alert.alert('Failed to delete post');
      console.log(error);
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
    setDataComment(post?.ms_PostComments);
  }, [post]);
  return (
    <View
      style={{
        marginBottom: 45,
        position: "relative",
      }}
      onBackdropPress={() => setShowOption(false)}
      customBackdrop={<View style={{ margin: 0 }}></View>}
    >
      <TouchableOpacity
        onPress={() => setShowOption(!showOption)}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <Entypo name="dots-three-horizontal" size={24} color="black" />
      </TouchableOpacity>
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
                    imageUrl={post?.ms_User?.ms_Profile?.virtual_pp}
                  />
                  <TouchableOpacity
                    onPress={() => handleNavigateUserDetail(post)}
                  >
                    <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
                      {post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                        `${post?.ms_User?.ms_Profile?.first_name} ${post?.ms_User?.ms_Profile?.last_name}` ||
                        "Annonymus"}
                    </Text>
                    <Text style={{ color: COLORS.gray }}>
                      {getTimeAgoString(post?.createdAt, language)}
                    </Text>
                  </TouchableOpacity>
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
                size={50}
                imageUrl={post?.ms_User?.ms_Profile?.virtual_pp}
              />
              <TouchableOpacity onPress={() => handleNavigateUserDetail(post)}>
                <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
                  {post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                    `${post?.ms_User?.ms_Profile?.first_name} ${post?.ms_User?.ms_Profile?.last_name}` ||
                    "Annonymus"}
                </Text>
                <Text style={{ color: COLORS.gray, fontSize: 12 }}>
                  {getTimeAgoString(post?.createdAt, language)}
                </Text>
              </TouchableOpacity>
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
            {language === "EN" ? "Like" : "Suka"} (
            {(post?.ms_PostLikes?.length || 0) + (isLike ? 1 : 0)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <FontAwesome name="comment" size={20} color={COLORS.gray} />
          <Text style={{ color: COLORS.gray }}>
            {language === "EN" ? "Comment" : "Komentar"} (
            {dataComment?.length || 0})
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
              {language === "EN" ? "Like" : "Suka"} (
              {(post?.ms_PostLikes?.length || 0) + (isLike ? 1 : 0)})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          {dataComment?.map((comment, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                gap: 15,
                marginBottom: 20,
              }}
            >
              <Avatar
                name={
                  comment?.ms_User?.ms_EnterpriseProfile?.business_name ||
                  `${comment?.ms_User?.ms_Profile?.first_name} ${comment?.ms_User?.ms_Profile?.last_name}`
                }
                imageUrl={comment?.ms_User?.ms_Profile?.virtual_pp}
              />
              <View
                style={{
                  backgroundColor: "#f4f4f4",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  flex: 1,
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
                    {getTimeAgoString(comment?.createdAt, language)}
                  </Text>
                </View>
                <Text style={{ marginTop: 5 }}>{comment?.comment}</Text>
              </View>
            </View>
          ))}
          {dataComment?.length === 0 && (
            <Text style={{ fontWeight: 600, textAlign: "center" }}>
              {language === "EN"
                ? "This post has no comments"
                : "Postingan ini tidak memiliki komentar"}
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
            placeholder={
              language === "EN" ? "Write comment.." : "Tulis komentar.."
            }
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
            <Text style={{ color: "white", textAlign: "center" }}>
              {language === "EN" ? "Send" : "Kirim"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ReactNativeModal
        backdropOpacity={0.3}
        onBackButtonPress={() => setShowOption(false)}
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          padding: 0,
          margin: 0,
        }}
        isVisible={showOption}
        swipeDirection={["down"]}
        onSwipeComplete={() => setShowOption(!showOption)}
      >
        <View
          style={{
            backgroundColor: "white",
            height: 300,
            width: "100%",
            margin: 0,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 10, transform: [{translateY: -15}] }}>
            <Ionicons name="remove-outline" size={54} color={COLORS.gray} />
          </View>
          {profileContext?.id === post?.uid ? (
          <TouchableOpacity
            onPress={() => handleDeletePost(post?.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <FontAwesome name="trash" size={18} color={COLORS.red} />
            <Text style={{ fontSize: 14, marginLeft: 8, color: COLORS.red }}>
              {language === "EN" ? "Delete" : "Hapus"}
            </Text>
          </TouchableOpacity>
          ) : (
          <TouchableOpacity
            onPress={() => {
              setShowOption(false);
              navigation.navigate('community-post-report', { post_id: post?.id}) 
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <FontAwesome name="flag" size={18} color={COLORS.gray} />
            <Text style={{ fontSize: 14, marginLeft: 8, color: COLORS.gray }}>
              {language === "EN" ? "Report" : "Laporkan"}
            </Text>
          </TouchableOpacity>

          )}
        </View>
      </ReactNativeModal>
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
  const { language } = useLanguageContext();

  // Tech, Health,, Art
  const [categoryMode, setCategoryMode] = useState('');
  const router = useRoute();

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

  const translateTypeCommunity = (type) => {
    if(type === 'Health'){
      return language === 'EN' ? 'Health' : 'Kesehatan'
    }
    else if(type === 'Tech'){
      return language === 'EN' ? 'Technology' : 'Teknologi'
    }else{
      return language === 'EN' ? 'Art Design' : 'Art Desain'
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('category');
      
      if (value !== null) {
        // value previously stored
        setCategoryMode(value);
        
      }
    } catch (e) {
      // error reading value
    }
  };


  useEffect(() => {
    getData();
  }, [])

  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>
        {language === "EN"
          ? "Redirect to Community Menu"
          : "Alihkan ke Menu Komunitas"}
      </Text>
    </View>
  ) : (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />

        <View style={{ marginTop: 30 }}></View>

        <Text style={{ marginBottom: 20,  fontWeight:'bold', fontSize: 18}}>
         Global Feed {translateTypeCommunity(categoryMode)}
          </Text>
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
            placeholder={
              language === "EN"
                ? "Search by Title Job, Skill, Or Username"
                : "Cari berdasarkan Judul Pekerjaan, Keahlian, atau Nama Pengguna"
            }
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
            <Text style={{ color: "white", textAlign: "center" }}>
              {language === "EN" ? "Search" : "Cari"}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {categoryMode === 'Health' && HEALTH.map((post) => (
          <PostCard key={post?.id} post={post} />
          ))}

        {categoryMode === 'Tech' && TECH?.map((post) => (
          <PostCard key={post?.id} post={post} />
        ))}
        {categoryMode === 'Art' && ART?.map((post) => (
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
            placeholder={
              language === "EN"
                ? "Search by Title Job, Skill, Or Username"
                : "Cari berdasarkan Judul Pekerjaan, Keahlian, atau Nama Pengguna"
            }
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
            {language === "EN" ? "Search Results" : "Hasil Pencarian"}:
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
