import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
  StatusBar,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomMenuEnterprise from "../../components/common/bottom-menu-enterprise";
import COLORS from "../../components/shared/COLORS";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { RadioButton, TextInput as TextInputPapper } from "react-native-paper";

import { Controller, useForm } from "react-hook-form";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function AdvertiseCreate() {
  const navigation = useNavigation();
  const router = useRoute();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      ad_type: "course" | "orthers",
      course: "",
      media: {},
      primary_text: "",
      headline: "",
      ad_desc: "",
      web_url: "",
      call_to_action: "",
    },
  });
  const { data: publishsCourse } = useFetch(
    "/enter/publishedCourses",
    URL_API_ENTER
  );
  const { data: adsDetail, fetchData: fetchDetailAds } = useFetch(
    `/enter/ad_detail/${router.params?.ads_id}`, URL_API_ENTER
  );

  const [selectedImage, setSelectedImage] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const fd = new FormData();
      fd.append("ad_type", data.ad_type);
      fd.append("course", data.course);
      fd.append("file", imageFile);
      fd.append("primary_text", data.primary_text);
      fd.append("headline", data.headline);
      fd.append("ad_desc", data.ad_desc);
      fd.append("web_url", data.web_url);
      fd.append("call_to_action", data.call_to_action);
      if (router?.params?.ads_id) {
        const response=  await axios.put(
          `${URL_API_ENTER}/enter/edit_ad/${router?.params?.ads_id}`,
          fd
        );
        if (response.status === 200) {
          navigation.push("enterprise-ads");
        }
      } else {
        const response=  await axios.post(`${URL_API_ENTER}/enter/create_ad`, fd);
        if (response.status === 200) {
          navigation.push("enterprise-ads");
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", `failed to ${router?.params?.ads_id ? 'edit' : 'add'} Advertise!`);
    }
  };

  const chooseImage = async () => {
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
    }
  };

  useEffect(() => {
    fetchDetailAds()
  }, [router])
  useEffect(() => {
    setValue("primary_text", adsDetail?.primary_text);
    setValue("call_to_action", adsDetail?.call_to_action);
    setValue("headline", adsDetail?.headline);
    setValue("ad_desc", adsDetail?.ad_desc);
    setValue("ad_type", adsDetail?.ad_type);
    setValue("course", adsDetail?.course);
    setValue("web_url", adsDetail?.web_url);
    console.log(adsDetail)
  }, [adsDetail])

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: StatusBar.currentHeight,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Ad Creative
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 6,
            }}
          >
            Select the media, text, and destination for your ads. You can also
            customize your media and text for each placement
          </Text>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Advertise Type</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <RadioButton
            color={COLORS.main}
            value="Course"
            status={watch("ad_type") === "course" ? "checked" : "unchecked"}
            onPress={() => setValue("ad_type", "course")}
          />
          <Text>Course</Text>
          <RadioButton
            color={COLORS.main}
            value="Orther"
            status={watch("ad_type") === "orther" ? "checked" : "unchecked"}
            onPress={() => setValue("ad_type", "orther")}
          />
          <Text>Orther</Text>
        </View>

        {watch("ad_type") === "course" && (
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>
                  Course Name
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    marginBottom: 20,
                  }}
                >
                  <RNPickerSelect
                    style={{
                      inputAndroid: {
                        fontSize: 16,
                        paddingHorizontal: 10,
                        paddingRight: 30,
                        height: 40,
                        transform: [{ translateY: -8 }],
                      },
                    }}
                    value={value}
                    onValueChange={onChange}
                    items={publishsCourse?.map((course) => ({
                      value: course?.id,
                      label: course?.title,
                    }))}
                    placeholder={{
                      label: "--Select action text--",
                      value: null,
                    }}
                  />
                </View>
              </>
            )}
            name="course"
            defaultValue=""
          />
        )}

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
              <Text style={{ fontSize: 16, marginLeft: 8 }}>Add Image</Text>
            </TouchableOpacity>
          ) : (
            <Image
              source={{ uri: selectedImage?.uri }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </TouchableOpacity>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Primary Text</Text>
              <TextInput
                style={[
                  styles.textarea,
                  errors?.primary_text && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                placeholder="tell people what your ad is about"
                textAlignVertical="top"
              />
            </View>
          )}
          name="primary_text"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Headline (Optional)</Text>
              <TextInput
                style={[styles.input, errors?.headline && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="headline"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.textarea, errors?.ad_desc && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Include additional detail"
              />
            </View>
          )}
          name="ad_desc"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Website URL (Optional)</Text>
              <TextInput
                style={[styles.input, errors?.web_url && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="https://example.com"
              />
            </View>
          )}
          name="web_url"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={[styles.label, { marginTop: 15 }]}>
                Call to Action (Optional)
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  marginBottom: 20,
                }}
              >
                <RNPickerSelect
                  style={{
                    inputAndroid: {
                      fontSize: 16,
                      paddingHorizontal: 10,
                      paddingRight: 30,
                      height: 40,
                      transform: [{ translateY: -8 }],
                    },
                  }}
                  value={value}
                  onValueChange={onChange}
                  items={[
                    { label: "Learn More", value: "Learn More" },
                    { label: "Go to Website", value: "Go to Website" },
                  ]}
                  placeholder={{
                    label: "--Select action text--",
                    value: null,
                  }}
                />
              </View>
            </>
          )}
          name="call_to_action"
          defaultValue=""
        />

        <TouchableOpacity
          style={{
            marginVertical: 25,
            backgroundColor: COLORS.main,
            paddingVertical: 10,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Submit</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.4)",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.4)",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    padding: 5,
  },
  inputError: {
    borderColor: "red", // Change border color to red on error
  },
  errorText: {
    color: "red",
  },
});
