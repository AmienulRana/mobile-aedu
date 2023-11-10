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
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment/moment";
import Credentials from "../../components/common/credentials";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const COURSE_TYPE = ["Learning Material", "Premium", "Subscription"];
const LANGUAGE = [
  { label: "English", value: "English" },
  { label: "Indonesia", value: "Indonesia" },
];
const LEVEL = [
  { label: "Beginner", value: 1 },
  { label: "Intermediate", value: 2 },
  { label: "Expert", value: 3 },
];

const assignmentsPlaceholder = [
  "Example: Learning Next.js technology",
  "Example: Creating End To End testing with Cypress",
  "Example: Building a professional portfolio",
  "Example: Implementing SOLID Principle and Clean Code",
];

export default function LearningCreate() {
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
      title: "",
      price: "0",
      description: "",
      language: "",
      level: "",
      category: "",
      course_cat: "",
      sub_category: "",
      location: "",
      learning_method: "",
      start_date: "",
      end_date: "",
      thumbnail: "",
      certificate: false,
      thumbnail_preview: "",
      address: "",
      approx_time: "",
      cred: [],
      assignments: [],
      requirements: [],
      course_type: "Subscription" | "Premium" | "Book" | "",
      stock: "0",
      weight: "0",
    },
  });
  const { data: categoryCourse } = useFetch("/enter/course_cat", URL_API_ENTER);
  const { data: subCategoryCourse, fetchData: fecthSubCategory } = useFetch(
    `/enter/subcourse_cat/${watch("category")}`,
    URL_API_ENTER
  );

  const [tabActive, setTabActive] = useState("Learning Material");
  const [courseType, setCourseType] = useState("Book"); // or 'Learning Material' based on the default selection

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState("");
  const [selectedCredentials, setSelectedCredentials] = useState([]);
  const [credentialsData, setCredentialsData] = useState();
  const [assignments, setAssignments] = useState(Array(4).fill(""));
  const [requirements, setRequirements] = useState([]);
  const [selectedImage, setSelectedImage] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode, typeDate) => {
    setShow(typeDate);
    setMode(currentMode);
  };

  const getCredentials = async () => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/course_cred/${watch("sub_category")}`
      );
      const mappedCredentials = response?.data?.map((cred) => ({
        name: cred?.cred_name,
        id: cred?.id,
      }));
      setCredentialsData(mappedCredentials);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoalsChange = (event, index, goals) => {
    const { value } = event.target;
    if (goals === "assignment") {
      setAssignments((prevCourseContext) => {
        const updatedAssignments = [...prevCourseContext];
        updatedAssignments[index] = value;
        return updatedAssignments;
      });
    } else {
      setRequirements((prevCourseContext) => {
        const updatedReq = [...prevCourseContext];
        updatedReq[index] = value;
        return updatedReq;
      });
    }
  };

  const onSubmitDataBook = async () => {
    try {
      const fd = new FormData();
      fd.append("title", watch("title"));
      fd.append("price", String(watch("price")));
      fd.append("description", watch("description"));
      fd.append("stock", String(watch("stock")));
      fd.append("course_type", watch("course_type"));
      fd.append("language", watch("language"));
      fd.append("level", watch("level"));
      fd.append("category", watch("category"));
      fd.append("sub_category", watch("sub_category"));
      assignments?.map((assignment) => {
        fd.append("assignments", assignment?.trim());
      });
      fd.append("thumbnail", imageFile);
      fd.append("images", imageFile);
      // selectedImage?.map((image) => {
      // });
      await axios.post(`${URL_API_ENTER}/enter/addBooks`, fd);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Failed", "Failed to add new Learning Material");
      console.log(error);
    }
  };
  const onSubmit = async (data) => {
    console.log(data);
    console.log(imageFile);
    if (watch("course_type") === "Book") {
      onSubmitDataBook();
      return;
    }
    const getIdCredentials = selectedCredentials.map(
      (data, i) => `${data?.id}`
    );
    try {
      const level =
        data?.level === "Beginner" ? 1 : data?.level === "Intermediate" ? 2 : 3;
      const payload = {
        ...data,
        price: +data?.price,
        level,
      };
      const fd = new FormData();
      fd.append("tnl", imageFile);
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "thumbnail_preview") return;
        fd.append(key, String(value));
      });
      assignments?.map((assignment) => {
        if (assignment.trim() !== "") {
          fd.append("assignments", assignment.trim());
        }
      });
      requirements?.map((requirement) => {
        fd.append("requirements", requirement.trim());
      });
      fd.append("cred", getIdCredentials.join(","));
      const response = await axios({
        method: "POST",
        url: `${URL_API_ENTER}/enter/addCourse`,
        data: fd,
      });
      if (response.status === 200) {
        navigation.goBack();
      }
      console.log(response);
    } catch (error) {
      Alert.alert("Failed", "Failed to add new Learning Material");
      console.log(error);
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

  const addNewGoals = (goals) => {
    if (goals === "assignments") {
      setAssignments((prevCourseContext) => {
        const newAssignments = [...prevCourseContext, ""];
        return newAssignments;
      });
    } else {
      setRequirements((prevCourseContext) => {
        const newReq = [...prevCourseContext, ""];
        return newReq;
      });
    }
  };

  // const onSubmit = (data) => {
  //   console.log(data);
  // };
  useEffect(() => {
    fecthSubCategory();
  }, [watch("category")]);
  useEffect(() => {
    getCredentials();
  }, [watch("sub_category")]);
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
              borderBottomWidth: 1,
              borderBottomColor: "black",
              paddingBottom: 10,
              marginBottom: 10,
            }}
          >
            First Page
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 6,
            }}
          >
            The initial learning page is crucial for your success at Aedu.
            Consider creating a captivating Learning Homepage that showcases why
            someone would want to enroll in your Learning.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
            marginBottom: 30,
          }}
        >
          {COURSE_TYPE.map((data, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {
                  padding: 10,
                  borderBottomWidth: 2,
                  borderColor: "transparent",
                },
                tabActive === data && {
                  borderColor: COLORS.main, // Use your desired active color
                },
              ]}
              onPress={() => {
                setTabActive(data);
                setCourseType(data === "Learning Material" ? "Book" : data);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: tabActive === data ? COLORS.main : COLORS.gray,
                }}
              >
                {data}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[styles.input, errors?.title && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="title"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.title && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        {courseType !== "Subscription" && (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text style={styles.label}>Price</Text>
                  <TextInput
                    style={[styles.input, errors?.price && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="price"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.price && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </>
        )}
        {courseType === "Book" && (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text style={styles.label}>Stock</Text>
                  <TextInput
                    style={[styles.input, errors?.stock && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="stock"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.stock && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text style={styles.label}>Weight</Text>
                  <TextInput
                    style={[styles.input, errors?.weight && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="weight"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.weight && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.textarea,
                  errors?.description && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          )}
          name="description"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.description && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        <Text style={{ fontSize: 12 }}>
          A well-crafted description should contain a minimum of 200 words.
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={[styles.label, { marginTop: 15 }]}>Language</Text>
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
                  items={LANGUAGE}
                  placeholder={{
                    label: "--Language--",
                    value: null,
                  }}
                />
              </View>
            </>
          )}
          name="language"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.language && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={[styles.label]}>Level</Text>
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
                  items={LEVEL}
                  placeholder={{
                    label: "--Level--",
                    value: null,
                  }}
                />
              </View>
            </>
          )}
          name="level"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.level && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={[styles.label]}>Category</Text>
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
                  items={categoryCourse?.map((category) => ({
                    label: category?.course_category,
                    value: category?.id,
                  }))}
                  placeholder={{
                    label: "--Category--",
                    value: null,
                  }}
                />
              </View>
            </>
          )}
          name="category"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.category && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={[styles.label]}>Sub Category</Text>
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
                  items={subCategoryCourse?.map((category) => ({
                    label: category?.sub_name,
                    value: category?.id,
                  }))}
                  placeholder={{
                    label: "--Sub Category--",
                    value: null,
                  }}
                />
              </View>
            </>
          )}
          name="sub_category"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.sub_category && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        {courseType !== "Book" && (
          <>
            <Text style={[styles.label]}>Learning Method</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <RadioButton
                color={COLORS.main}
                value="Online"
                status={
                  watch("learning_method") === "Online"
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setValue("learning_method", "Online")}
              />
              <Text>Online</Text>
              <RadioButton
                color={COLORS.main}
                value="Offline"
                status={
                  watch("learning_method") === "Offline"
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setValue("learning_method", "Offline")}
              />
              <Text>Offline</Text>
            </View>
            {watch("learning_method") === "Offline" && (
              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Text style={styles.label}>Detail Address</Text>
                      <TextInput
                        style={[
                          styles.textarea,
                          errors?.description && styles.inputError,
                        ]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                      />
                    </View>
                  )}
                  name="address"
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors?.address && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Text style={styles.label}>Location</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors?.location && styles.inputError,
                        ]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  )}
                  name="location"
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors?.location && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
              </>
            )}

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={(event, date) => {
                  onChange(event, date);
                  if (show === "start") {
                    return setValue("start_date", String(date));
                  }
                  setValue("end_date", String(date));
                }}
              />
            )}
            <TouchableOpacity onPress={() => showMode("date", "start")}>
              <Text style={styles.label}>Start Date</Text>
              <View
                style={[
                  styles.input,
                  errors?.start_date && styles.inputError,
                  { backgroundColor: "white", justifyContent: "center" },
                ]}
              >
                <Text>
                  {watch("start_date")
                    ? moment(watch("start_date")).format("DD/MM/YYYY")
                    : ""}
                </Text>
              </View>
            </TouchableOpacity>
            {courseType === "Premium" && (
              <TouchableOpacity onPress={() => showMode("date", "end")}>
                <Text style={styles.label}>End Date</Text>
                <View
                  style={[
                    styles.input,
                    errors?.start_date && styles.inputError,
                    { backgroundColor: "white", justifyContent: "center" },
                  ]}
                >
                  <Text>
                    {watch("end_date")
                      ? moment(watch("end_date")).format("DD/MM/YYYY")
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label, { marginTop: 15 }]}>
                    Learning Estimate
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
                        { label: "1 - 3 Hour", value: "1 - 3 Hour" },
                        { label: "3 - 6 Hour", value: "3 - 6 Hour" },
                        { label: "> 6 Hour", value: "> 6 Hour" },
                      ]}
                      placeholder={{
                        label: "--Time--",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="approx_time"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.approx_time && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Text style={{ marginBottom: 15 }}>
              How many hours does this course last?
            </Text>

            <Text style={[styles.label]}>Certificate</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <RadioButton
                color={COLORS.main}
                value="Online"
                status={
                  watch("learning_method") === "Online"
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setValue("learning_method", "Online")}
              />
              <Text>Online</Text>
              <RadioButton
                color={COLORS.main}
                value="Offline"
                status={
                  watch("learning_method") === "Offline"
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setValue("learning_method", "Offline")}
              />
              <Text>Offline</Text>
            </View>
            <Text>Does this course offer a certificate?</Text>

            <Credentials
              credentials={credentialsData}
              selectedSkills={selectedCredentials}
              setSelectedSkills={setSelectedCredentials}
              title="Credentials"
            />
          </>
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

        {courseType !== "Book" && (
          <>
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                Parcipant Goals
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 6,
                }}
              >
                The following description will be publicly visible on your
                Learning Homepage and will have a direct impact on your learning
                performance. This description will assist participants in
                deciding whether your learning is suitable for them or not.
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                What will participants learn?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                You should include at least 4 learning objectives or outcomes
                that participants can expect to achieve after completing your
                learning.
              </Text>
            </View>
            {assignments?.map((assignment, index) => (
              <View style={{ marginBottom: 5, width: "70%" }} key={index}>
                <TextInput
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 5,
                  }}
                  placeholder={
                    assignmentsPlaceholder[index] ||
                    `Example: Assignment ${index + 1}`
                  }
                  value={assignment}
                  onChangeText={(text) =>
                    handleGoalsChange(text, index, "assignments")
                  }
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addNewGoals("assignments")}
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>+</Text>
              <Text>Add More Goals</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                What are the requirements or prerequisites for taking your
                course?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                List the skills, experience, tools, or equipment that
                participants should ideally possess before taking your course.
                If there are no specific requirements, use this space as an
                opportunity to make it more beginner-friendly.
              </Text>
            </View>
            {requirements?.map((requirement, index) => (
              <View style={{ marginBottom: 5, width: "70%" }} key={index}>
                <TextInput
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 5,
                  }}
                  placeholder={`Example: requirements ${index + 1}`}
                  value={requirement}
                  onChangeText={(text) =>
                    handleGoalsChange(text, index, "requirements")
                  }
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addNewGoals("requirements")}
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>+</Text>
              <Text>Add More requirements</Text>
            </TouchableOpacity>
          </>
        )}
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
