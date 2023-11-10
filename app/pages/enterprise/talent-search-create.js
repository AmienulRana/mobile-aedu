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
import LocationSearch from "../../components/common/location-search";

export default function TalentSearchCreate() {
  const navigation = useNavigation();
  const router = useRoute();
  const {
    control,
    handleSubmit,
    formState: { errors, is },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      job_name: "",
      location: {
        name: "",
        id: "",
      },
      work_hours: "",
      loc_type: "",
      job_type: "",
      job_sector: "",
      job_func: "",
      description: "",
      skills: [],
      start_date: "",
      end_date: "",
      exp: "",
      language: "",
      degree: "",
    },
  });

  const { data: jobSectors } = useFetch("/enter/js", URL_API_ENTER);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState("");
  const [selectedCredentials, setSelectedCredentials] = useState([]);
  const [credentialsData, setCredentialsData] = useState();
  const [activePage, setActivePage] = useState("basic");

  const [jobFunctions, setJobFunctions] = useState([]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode, typeDate) => {
    setShow(typeDate);
    setMode(currentMode);
  };

  const onSubmitData = async (data) => {
    try {
      console.log(selectedCredentials);
      const payload = {
        ...data,
        exp: `${data?.exp || 0} Years`,
        skills: selectedCredentials?.map((skill) => skill?.name)?.join(", "),
        location: watch("location.id"),
      };
      console.log(payload);
      const response = await axios.post(
        `${URL_API_ENTER}/enter/add_jobad`,
        payload
      );
      console.log(response?.data);
      if (response?.status === 200) {
        navigation.push("enterprise-talent");
      }
    } catch (error) {
      Alert.alert("Failed", "Failed to add new Jobs");
      console.log(error);
    }
  };
  const handleNextPrevPage = async (data) => {
    if (activePage === "basic") {
      setActivePage("skills");
    } else if (activePage === "skills") {
      setActivePage("additional");
    } else if (activePage === "additional") {
      onSubmitData(data);
    }
  };

  const handlePrevPage = () => {
    if (activePage === "skills") {
      setActivePage("basic");
    } else {
      setActivePage("skills");
    }
  };

  // const onSubmit = (data) => {
  //   console.log(data);
  // };
  useEffect(() => {
    const filterfunctionSector = () => {
      const filterSectors =
        jobSectors?.filter(
          (sector) => sector?.id === watch("job_sector")
        )?.[0] || [];
      const getFunctionSector =
        filterSectors?.ms_JobFuncs?.map((functions) => ({
          label: functions?.name,
          value: functions?.id,
        })) || [];
      setJobFunctions(getFunctionSector);
    };
    filterfunctionSector();
  }, [watch("job_sector")]);

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
              marginBottom: 30,
            }}
          >
            {activePage === "basic" && "Basic Information"}
            {activePage === "skills" && "Skills"}
            {activePage === "additional" && "Additional Information"}
          </Text>
        </View>
        {activePage === "basic" && (
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors?.job_name && styles.inputError,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="job_name"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.job_name && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Text style={styles.label}>City</Text>
            <LocationSearch
              setLocation={(id, name) => {
                setValue("location.id", id);
                setValue("location.name", name);
              }}
              location={watch("location.name")}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Work Hours</Text>
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
                        {
                          label: "8 - 5",
                          value: "8 - 5",
                        },
                        {
                          label: "9 - 5",
                          value: "9 - 5",
                        },
                      ]}
                      placeholder={{
                        label: "Select work hours",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="work_hours"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.work_hours && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Location Type</Text>
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
                        {
                          label: "On-site",
                          value: "On-site",
                        },
                        {
                          label: "Remote",
                          value: "Remote",
                        },
                        {
                          label: "Hybrid",
                          value: "Hybrid",
                        },
                      ]}
                      placeholder={{
                        label: "Select location type",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="loc_type"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.loc_type && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Job Type</Text>
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
                        {
                          label: "Full time",
                          value: "Full time",
                        },
                        {
                          label: "Part time",
                          value: "Part time",
                        },
                        {
                          label: "Freelance",
                          value: "Freelance",
                        },
                        {
                          label: "Contract",
                          value: "Contract",
                        },
                        {
                          label: "Internship",
                          value: "Internship",
                        },
                      ]}
                      placeholder={{
                        label: "Select job type",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="job_type"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.job_type && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Job Sector</Text>
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
                      items={jobSectors?.map((sector) => ({
                        label: sector?.name,
                        value: sector?.id,
                      }))}
                      placeholder={{
                        label: "Select job sector",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="job_sector"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.job_sector && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Job Function</Text>
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
                      items={jobFunctions}
                      placeholder={{
                        label: "Select job function",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="job_func"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.job_func && (
              <Text style={styles.errorText}>This field is required</Text>
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
          </View>
        )}

        {activePage === "skills" && (
          <Credentials
            credentials={credentialsData}
            selectedSkills={selectedCredentials}
            setSelectedSkills={setSelectedCredentials}
            title="Skills"
          />
        )}
        {activePage === "additional" && (
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Degree</Text>
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
                        {
                          label: "Associate Degree",
                          value: "Associate Degree",
                        },
                        {
                          label: "Bachelor's Degree",
                          value: "Bachelor's Degree",
                        },
                        { label: "Master's Degree", value: "Master's Degree" },
                        { label: "Doctoral Degree", value: "Doctoral Degree" },
                        {
                          label: "Sertifikat Profesional",
                          value: "Sertifikat Profesional",
                        },
                        { label: "Non-degree", value: "Non-degree" },
                      ]}
                      placeholder={{
                        label: "Select Degree",
                        value: null,
                      }}
                    />
                  </View>
                </>
              )}
              name="degree"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.degree && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text style={styles.label}>Experience</Text>
                  <TextInput
                    style={[styles.input, errors?.exp && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                  />
                </View>
              )}
              name="exp"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.exp && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={[styles.label]}>Language</Text>
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
                        {
                          label: "English",
                          value: "English",
                        },
                        {
                          label: "Indonesia",
                          value: "Indonesia",
                        },
                      ]}
                      placeholder={{
                        label: "Select language",
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
            {/* {is && !watch("start_date") && (
              <Text style={styles.errorText}>This field is required</Text>
            )} */}
            <TouchableOpacity onPress={() => showMode("date", "end")}>
              <Text style={styles.label}>End Date</Text>
              <View
                style={[
                  styles.input,
                  errors?.end_date && styles.inputError,
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
          </View>
        )}

        <View style={{ flexDirection: "row", gap: 20 }}>
          {activePage !== "basic" && (
            <TouchableOpacity
              style={{
                marginVertical: 25,
                backgroundColor: COLORS.white,
                paddingVertical: 10,
                borderColor: COLORS.main,
                borderWidth: 1,
                flex: 1,
              }}
              onPress={() => handlePrevPage()}
            >
              <Text style={{ textAlign: "center", color: COLORS.main }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              marginVertical: 25,
              backgroundColor: COLORS.main,
              paddingVertical: 10,
              flex: 1,
            }}
            onPress={handleSubmit(handleNextPrevPage)}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              {activePage === "additional" ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 10,
  },
});
