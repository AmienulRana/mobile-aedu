import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import { useNavigation, useRoute } from "@react-navigation/native";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import BottomMenuBar from "../../components/common/bottom-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomMenuEnterprise from "../../components/common/bottom-menu-enterprise";
import COLORS from "../../components/shared/COLORS";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import PublishCourse from "../../components/pages/enterprise/learning/publish";
import PageHeaderCommunity from "../../components/common/page-header-community";

export default function LearningEnterprise() {
  const navigation = useNavigation();

  const { data: drafts, fetchData: fecthDraftCourse } = useFetch(
    "/enter/draftCourses",
    URL_API_ENTER
  );
  const { data: publishs, fetchData: fetchPublishCourse } = useFetch(
    "/enter/publishedCourses",
    URL_API_ENTER
  );
  const { data: enterprise } = useFetch("/enter/getVerif", URL_API_ENTER);

  const handlePublishCourse = async (id) => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/pub_course/${id}`
      );
      if (response?.status === 200) {
        fetchPublishCourse();
        fecthDraftCourse();
      }
    } catch (error) {
      Alert.alert(
        "Failed to publish learning",
        "To draft to publish you must add content on the enterprise website so that it is 100% complete",
        [
          {
            text: "Cancel",
          },
          {
            text: "Go to website",
            onPress: () => Linking.openURL("https://enterprise.aedu.id"),
          },
        ]
      );
      console.log(error);
    }
  };
  const handleDeleteCourse = async (id) => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/deleteDraft/${id}`
      );
      if (response?.status === 200) {
        fecthDraftCourse();
      }
    } catch (error) {
      Alert.alert("Failed to delete draft");
      console.log(error);
    }
  };

  const getDataStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("login-mode");
      if (value !== null) {
        // value previously stored
        console.log(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getDataStorage();
  }, []);

  useEffect(() => {
    console.log(enterprise);
  }, [enterprise]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />

        <View style={styles.containerBanner}>
          <Text style={styles.text}>GO CREATE COURSE</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("enterprise-learning-create")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Create Learning</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Overview
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "gray",
              marginTop: 6,
            }}
          >
            The Learning page is the control center for managing your content.
            On this page, you can easily organize your learning content, both
            those ready for publication and those still in the drafting stage.
          </Text>
        </View>

        <Text style={{ fontSize: 16, marginVertical: 16, fontWeight: 900 }}>
          Learning Draft
        </Text>
        {drafts?.map((draft, i) => (
          <View style={styles.containerDraft} key={i}>
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: draft?.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.titleStatusContainer}>
                <Text style={styles.title}>{draft?.title}</Text>
              </View>
              <View style={styles.completionContainer}>
                <Text style={styles.completionLabel}>Complete</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${draft?.completion}%` },
                    ]}
                  />
                </View>
                <Text style={styles.completionPercentage}>
                  {draft?.completion}%
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={styles.publishButton}
                  onPress={() => handlePublishCourse(draft?.id)}
                >
                  <Text style={styles.publishButtonText}>Publish Learning</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCourse(draft?.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="red"
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={{ fontSize: 16, marginVertical: 16, fontWeight: 900 }}>
          Learning Publish
        </Text>
        <PublishCourse publishes={publishs} />
      </ScrollView>
      <BottomMenuEnterprise />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  containerBanner: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.main, // You can change the color here
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  containerDraft: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 3,
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  titleStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    width:"95%"
  },
  completionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    backgroundColor: COLORS.gray,
    width: "50%",
    height: 3,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    backgroundColor: COLORS.main, // Ganti warna sesuai keinginan
    height: 3,
    borderRadius: 2,
  },
  completionPercentage: {
    fontSize: 14,
  },
  publishButton: {
    backgroundColor: COLORS.main, // Ganti warna sesuai keinginan
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 10,
    width: 120,
  },
  publishButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  deleteIcon: {
    fontSize: 24,
    color: "red",
  },
});
