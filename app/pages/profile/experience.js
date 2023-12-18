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
import { RadioButton, Checkbox } from "react-native-paper";
import { arrayYears } from "../../components/utils/helper";
import LocationSearch from "../../components/common/location-search";

export default function ActionExperience() {
  const { data: token } = useFetch("/getToken");
  const { data: profile, fetchData: fetchProfile } = useFetch(
    `/getProfile?token=${token?.token}`
  );
  const { data: experienceData } = useFetch("/get_exp");

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      id: 0,
      title: "",
      company: "",
      employment_type: "",
      start_date_month: "",
      start_date_year: "",
      end_date_month: "",
      end_date_year: "",
      location: {
        id: '',
        name: '',
      },
      location_type: "",
      Description: "",
      currently_working: false,
    },
  });
  const [showDate, setShowDate] = useState(false);
  const router = useRoute();

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
    try {
        const payload = {
            ...data,
            location: data.location.id,
            start_date: `${data.start_date_month} ${data.start_date_year}`,
            end_date: watch("currently_working")
            ? ""
            : `${data.end_date_month} ${data.end_date_year}`,
          };

          console.log(payload);

      if (!router?.params?.experience_id) {
        await axios.post(`${URL_API}/add_exp`, payload);
      } else {
        await axios.put(
          `${URL_API}/edit_exp/${router?.params?.experience_id}`,
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
    const data = experienceData?.exp_data?.find(
      (experience) => experience?.id === router?.params?.experience_id
    );
    const startDate = moment(data?.start_date).format("MMMM YYYY")?.split(" ");
    const endDate = moment(data?.end_date).format("MMMM YYYY")?.split(" ");
    setValue("title", data?.title);
    setValue("employment_type", data?.employment_type);
    setValue("company", data?.company);
    setValue('location.name', data?.location)
    setValue('location_type', data?.location_type)
    setValue('currently_working', data?.currently_working)
    setValue("start_date_month", startDate[0]);
    setValue("start_date_year", startDate[1]);
    setValue("end_date_month", endDate[0]);
    setValue("end_date_year", endDate[1]);
    setValue("Description", data?.Description);
    // setDefaultDate(new Date(data?.dateofbirth));
    console.log(data);
  }, [experienceData, router]);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {router?.params?.experience_id
          ? language === "EN"
            ? "Edit Experience"
            : "Ubah Pengalaman"
          : language === "EN"
          ? "Add Experience"
          : "Tambah Pengalaman"}
      </Text>

      <Text style={styles.label}>{language === "EN" ? "Title" : "Judul"}</Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
          />
        )}
        name="title"
        rules={{ required: true }}
      />
      {errors?.title && (
        <Text style={styles.error}>{errors?.title?.message}</Text>
      )}

      <Text style={styles.label}>
        {language === "EN" ? "Employment Type" : "Tipe Pekerjaan"}
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
                  { label: "Full Time", value: "Full time" },
                  {
                    label: "Part time",
                    value: "Part time",
                  },
                  { label: "Contract", value: "Contract" },
                  { label: "Freelance", value: "Freelance" },
                  { label: "Internship", value: "Intership" },
                  { label: "Self-employed", value: "Self-employed" },
                ]}
              />
            </View>
          </>
        )}
        name="employment_type"
        defaultValue=""
      />
      <Text style={styles.label}>
        {language === "EN" ? "Company Name" : "Nama Perusahaan"}
      </Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
          />
        )}
        name="company"
        rules={{ required: true }}
      />
      {errors?.company && (
        <Text style={styles.error}>{errors?.company?.message}</Text>
      )}

<Text style={styles.label}>City</Text>
            <LocationSearch
              setLocation={(id, name) => {
                setValue("location.name", name);
                setValue("location.id", id);
              }}
              location={watch("location.name")}
            />

      <Text style={styles.label}>
        {language === "EN" ? "Location Type" : "Tipe Lokasi"}
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
                  { label: "On Site", value: "On Site" },
                  {
                    label: "Remote",
                    value: "Remote",
                  },
                  { label: "Hybrid", value: "Hybrid" },
                ]}
              />
            </View>
          </>
        )}
        name="location_type"
        defaultValue=""
      />

      <View style={{ flexDirection: "row", gap: 15, alignItems: "center", marginBottom: 10 }}>
        <Checkbox
        color={COLORS.main}
          status={watch("currently_working") ? "checked" : "unchecked"}
          onPress={() => {
            setValue("currently_working", !watch("currently_working"));
          }}
        />
        <Text>
          {language === "EN"
            ? "I am currently working in this role"
            : "Saya masih bekerja disini"}
        </Text>
      </View>

      <Text style={styles.label}>
        {language === "EN" ? "Start Date" : "Tanggal Mulai"}
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
        name="start_date_month"
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
        name="start_date_year"
        defaultValue=""
      />

      {!watch('currently_working') && (
        <>
        
        <Text style={styles.label}>
          {language === "EN" ? "End Date" : "Tanggal Selesai"}
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
          name="end_date_month"
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
          name="end_date_year"
          defaultValue=""
        />
        </>
      )}
       <Text style={styles.label}>
        {language === "EN" ? "Description" : "Deskripsi"}
      </Text>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            onChangeText={(text) => field.onChange(text)}
            value={field.value}
            style={styles.input}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        )}
        name="Description"
      />
      {errors?.Description && (
        <Text style={styles.error}>{errors?.Description?.message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmitForm)}
        style={styles.button}
        // disabled={isValid}
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
    marginBottom:20
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
