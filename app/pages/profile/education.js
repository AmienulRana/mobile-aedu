import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../../components/shared/COLORS";

import useFetch, { URL_API } from "../../hooks/useFetch";
import moment from "moment/moment";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useLanguageContext } from "../../context/LanguageContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";
import { arrayYears } from "../../components/utils/helper";

export default function ActionEducation() {
  const { data: token } = useFetch("/getToken");
  const { data: profile, fetchData: fetchProfile } = useFetch(
    `/getProfile?token=${token?.token}`
  );
  const { data: educationData } = useFetch("/get_edu");

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      school: "",
      degree: "",
      study_field: "",
      date_month: "",
      date_year: "",
    },
  });
  const [showDate, setShowDate] = useState(false);
  const router = useRoute();

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
    console.log(data);
    try {
      const payload = {
        school: data.school,
        degree: data.degree,
        study_field: data.study_field,
        grad_date: `${data.date_month} ${data.date_year}`,
      };

      if (!router?.params?.education_id) {
        await axios.post(`${URL_API}/add_Edu`, payload);
      } else {
        await axios.put(
          `${URL_API}/edit_edu/${router?.params?.education_id}`,
          payload
        );
      }

      navigation.push("profile");
    } catch (error) {
      Alert.alert(
        "Error",
        language === "ID" ? "Gagal mengubah data" : "Failed to update data"
      );
      console.log(error);
    }
  };
  useEffect(() => {
    const data = educationData?.edu_data?.find((education) => education?.id === router?.params?.education_id)
    const graduated = moment(data?.grad_date).format('MMMM YYYY')?.split(' ');
    setValue("school", data?.school);
    setValue("degree", data?.degree);
    setValue("study_field", data?.study_field);
    setValue("date_month", graduated[0]);
    setValue("date_year", graduated[1]);
    // setDefaultDate(new Date(data?.dateofbirth));
    console.log(router?.params);
  }, [educationData, router]);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {router?.params?.education_id
          ? language === "EN"
            ? "Edit Education"
            : "Ubah Pendidikan"
          : language === "EN"
          ? "Add Education"
          : "Tambah Pendidikan"}
      </Text>

      <Text style={styles.label}>
        {language === "EN" ? "School" : "Institusi"}
      </Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            placeholder={
              language === "EN"
                ? "Ex: University Indonesia"
                : "Contoh: Universitas Indonesia"
            }
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
          />
        )}
        name="school"
        rules={{ required: true }}
      />
      {errors?.school && (
        <Text style={styles.error}>{errors?.school?.message}</Text>
      )}
      <Text style={styles.label}>{language === "EN" ? "Degree" : "Gelar"}</Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            placeholder={language === "EN" ? "Ex: Bachelor" : "Contoh: Sarjana"}
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
          />
        )}
        name="degree"
        rules={{ required: true }}
      />
      {errors?.degree && (
        <Text style={styles.error}>{errors?.degree?.message}</Text>
      )}
      <Text style={styles.label}>
        {language === "EN" ? "Field of Study" : "Bidang Studi"}
      </Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            placeholder={
              language === "EN"
                ? "Ex: System Information"
                : "Contoh: Sistem Informasi"
            }
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
          />
        )}
        name="study_field"
        rules={{ required: true }}
      />
      {errors?.study_field && (
        <Text style={styles.error}>{errors?.study_field?.message}</Text>
      )}

      <Text style={styles.label}>
        {language === "EN" ? "Graduated" : "Tahun Lulus"}
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View
              style={{
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 20,
                borderRadius: 5,
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
                  { label: "January", value: "January" },
                  {
                    label: "February",
                    value: "February",
                  },
                  { label: "March", value: "March" },
                  { label: "April", value: "April" },
                  { label: "May", value: "May" },
                  { label: "June", value: "June" },
                  { label: "July", value: "July" },
                  { label: "August", value: "August" },
                  { label: "September", value: "September" },
                  { label: "October", value: "October" },
                  { label: "November", value: "November" },
                  { label: "December", value: "December" },
                ]}
                placeholder={{
                  label: language === "EN" ? "Month" : "Bulan",
                  value: "",
                }}
              />
            </View>
          </>
        )}
        name="date_month"
        defaultValue=""
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View
              style={{
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 20,
                borderRadius: 5,
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
                items={arrayYears()}
                placeholder={{
                  label: language === "EN" ? "Year" : "Tahun",
                  value: "",
                }}
              />
            </View>
          </>
        )}
        name="date_year"
        defaultValue=""
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmitForm)}
        style={styles.button}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {language === "EN" ? "Update" : "Perbarui"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {language === "EN" ? "Close" : "Tutup"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    position: "relative",
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.main,
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
