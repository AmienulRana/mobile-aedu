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
import { Avatar, PostCard } from "./home";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../components/shared/COLORS";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import PageHeaderCommunity from "../../components/common/page-header-community";
import { useLanguageContext } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/useProfileContext";

export default function CommunityPost() {
  const { data, fetchData } = useFetch("/comm/userPosts", URL_API_COMM);
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguageContext();

  return (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <PageHeaderCommunity />
        </View>
        <View
          style={{
            backgroundColor: "#f4f2ee91",
            paddingHorizontal: 10,
            paddingTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.9}
            style={{ padding: 15, borderRadius: 5, backgroundColor: "white" }}
          >
            <View style={styles.profileContainer}>
              <Avatar name={data?.[0]?.ms_User?.ms_Profile?.first_name} />
              <TextInput
                placeholder={
                  language === "EN"
                    ? "What's do you want to talk about??"
                    : "Apa yang ingin kamu bicarakan??"
                }
                style={styles.input}
                onPress={() => setShowModal(true)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.imageTextContainer}>
                <FontAwesome name="image" size={18} color="#06b6d4" />
                <Text style={styles.imageText}>
                  {language === "EN" ? "Add Image" : "Tambahkan Gambar"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={styles.postButton}
              >
                <Text style={styles.buttonText}>
                  {language === "EN" ? "Post" : "Kirim"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 10 }}></View>
          {data?.map((post) => (
            <PostCard key={post?.id} post={post} />
          ))}
        </View>
      </ScrollView>
      {/* {showModal && ( */}
      <ModalCreatePost
        fetchData={fetchData}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {/* )} */}
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    position: "relative",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
    // marginTop: 40,
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
    paddingVertical: 6,
    borderColor: "#A9A9A9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 30,
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

export const ModalCreatePost = ({
  fetchData,
  showModal,
  setShowModal,
  communityDefault,
}) => {
  const [selectedImage, setSelectedImage] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [showCommunity, setShowCommunity] = useState(false);
  const { data: myCommunity } = useFetch("/comm/communities", URL_API_COMM);
  const [selectedCommunity, setSelectedCommunity] = useState("Global");
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const { profileContext } = useProfileContext();
  const { language } = useLanguageContext();
  // const router = useRoute(); // Ganti useRouter dengan state router

  const chooseImage = async () => {
    setShowModal(false);
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Failed to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const uriParts = uri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      setSelectedImage({ uri: result.assets[0].uri });
      setImageFile({
        uri: uri,
        type: "image/jpeg",
        name: fileName,
      });
      setShowModal(true);
    }
  };

  const selectCommunity = (community, id_community) => {
    setSelectedCommunity(community);
    setShowCommunity(false);
    setSelectedCommunityId(id_community);
  };

  const clearAction = () => {
    setShowModal(false);
    setTag("");
    setDescription("");
    setSelectedCommunity("Global");
    setSelectedImage("");
    setImageFile(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("pc", description);
      formData.append(
        "for_group",
        selectedCommunity === "Global" ? "" : selectedCommunityId
      );
      formData.append("is_like", "0");
      formData.append("is_comment", "0");
      formData.append("images", imageFile);

      const response = await axios.post(
        `${URL_API_COMM}/comm/addPost`,
        formData
      );
      if (response?.status === 200) {
        clearAction();
        fetchData();
      }
    } catch (error) {
      Alert.alert("Failed", "Failed to add  new post!");
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(communityDefault);
    if (communityDefault) {
      const community = myCommunity?.find(
        (community) => community?.id === communityDefault
      );
      selectCommunity(community?.group_name, community?.id);
    }
  }, [myCommunity, communityDefault]);
  return (
    <Modal
      animationType="fade"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 50 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Avatar name={profileContext?.first_name} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 16 }}>
              {language === "EN" ? "Post to:" : "Kirim ke:"}
            </Text>

            <TouchableOpacity
              onPress={() => setShowCommunity(!showCommunity)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{selectedCommunity}</Text>
              <MaterialIcons
                name={
                  showCommunity ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {showCommunity && (
              <View
                style={{
                  position: "absolute",
                  width: 200,
                  top: 48,
                  left: 0,
                  padding: 8,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderRadius: 8,
                  zIndex: 10,
                }}
              >
                <TouchableOpacity onPress={() => selectCommunity("Global", "")}>
                  <Text style={{ color: "gray", marginBottom: 8 }}>Global</Text>
                </TouchableOpacity>
                {myCommunity?.map((community, i) => (
                  <TouchableOpacity
                    key={community.id}
                    onPress={() =>
                      selectCommunity(community?.group_name, community?.id)
                    }
                  >
                    <Text style={{ color: "gray", marginBottom: 8 }}>
                      {community?.group_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <TextInput
          multiline
          numberOfLines={3}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder={
            language === "EN"
              ? "What's do you want to talk about??"
              : "Apa yang ingin kamu bicarakan??"
          }
          style={{
            fontSize: 16,
            height: 120,
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 5,
            marginBottom: 16,
            padding: 10,
          }}
          textAlignVertical="top"
        />
        <TextInput
          onChangeText={(text) => setTag(text)}
          value={tag}
          placeholder="#tech #health #art"
          style={{
            fontSize: 16,
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 5,
            marginBottom: 16,
            padding: 10,
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={() => chooseImage()}
        >
          {!selectedImage?.uri ? (
            <TouchableOpacity
              onPress={() => chooseImage()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="image" size={24} color={COLORS.primary} />
              <Text style={{ fontSize: 16, marginLeft: 8 }}>
                {language === "EN" ? "Add Image" : "Tambahkan Gambar"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Image
              source={{ uri: selectedImage?.uri }}
              style={{ width: 300, height: 200 }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 4,
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.main,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.main }}>
              {language === "EN" ? "Cancel" : "Batal"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: COLORS.main,
              padding: 8,
              borderRadius: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>
              {language === "EN" ? "Create Post" : "Buat Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
