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
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";

export default function PersonalInformation() {
  const { data: token } = useFetch("/getToken");
  const { data: profile, fetchData: fetchProfile } = useFetch(`/getProfile?token=${token?.token}`);

  const [defaultDate, setDefaultDate] = useState(new Date());

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      gender: "",
      marital_stats: "",
      religion: "",
      dateofbirth: "",
      address: "",
    },
  });
  const [showDate, setShowDate] = useState(false);

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
      try {
        const payload = {
            ...data,
            gender: data?.gender == 1 ? language === 'EN' ? 'Male' : 'Laki-Laki' : language === 'EN' ? 'Male' : 'Perempuan'
        }

        const response = await axios.post(`${URL_API}/update_pd`, payload);

        if (response.status === 200) {
          navigation.push('profile');
        }
      } catch (error) {
        Alert.alert('Error', language === 'ID' ? 'Gagal mengubah data' : 'Failed to update data')
        console.log(error);
      }
  };
  useEffect(() => {
    console.log(profile);
    const data = profile?.profile;
    // console.log(profile?.profile)
    if (data?.gender === "Laki-Laki" || data?.gender === "Male") {
      setValue("gender", 1);
    } else {
      setValue("gender", 2);
    }
    setValue('religion', data?.religion)
    setValue('marital_stats', data?.marital_stats)
    setValue('dateofbirth', data?.dateofbirth);
    setDefaultDate(new Date(data?.dateofbirth));
  }, [profile]);

  useEffect(() => {
    fetchProfile()
  }, [token])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {language === "EN" ? "Add Information" : "Tambah Informasi"}
      </Text>

      {showDate && (
        <DateTimePicker
          testID="birthdaydate"
          value={defaultDate}
          mode={"date"}
          is24Hour={true}
          onChange={(event, date) => {
            console.log(date);
            setDefaultDate(date);
            setValue("dateofbirth", String(date));
            setShowDate(false);
          }}
          onTouchCancel={() => setShowDate(false)}
        />
      )}
      <TouchableOpacity onPress={() => setShowDate(!showDate)}>
        <Text style={styles.label}>
          {language === "EN" ? "Birthday Date" : "Tanggal Lahir"}
        </Text>
        <View
          style={[
            styles.input,
            errors?.start_date && styles.inputError,
            {
              backgroundColor: "white",
              justifyContent: "center",
              paddingVertical: 10,
            },
          ]}
        >
          <Text>
            {watch("dateofbirth")
              ? moment(watch("dateofbirth")).format("DD/MM/YYYY")
              : language === "EN"
              ? "Birthday Date"
              : "Tanggal Lahir"}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>
        {language === "EN" ? "Religion" : "Agama"}
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
                  { label: "Islam", value: "Islam" },
                  {
                    label: "Kristen (Protestan)",
                    value: "Kristen (Protestan)",
                  },
                  { label: "Kristen (Katolik)", value: "Kristen (Katolik)" },
                  { label: "Buddha", value: "Buddha" },
                  { label: "Hindu", value: "Hindu" },
                  { label: "Konghuchu", value: "Konghuchu" },
                ]}
              />
            </View>
          </>
        )}
        name="religion"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>
        {language === "EN" ? "Gender" : "Jenis Kelamin"}
      </Text>
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
          status={watch("gender") === 1 ? "checked" : "unchecked"}
          onPress={() => setValue("gender", 1)}
        />
        <Text>{language === "EN" ? "Male" : "Laki-Laki"}</Text>
        <RadioButton
          color={COLORS.main}
          value="Online"
          status={watch("gender") === 2 ? "checked" : "unchecked"}
          onPress={() => setValue("gender", 2)}
        />
        <Text>{language === "EN" ? "Female" : "Perempuan"}</Text>
      </View>
      <Text style={styles.label}>
        {language === "EN" ? "Marital Status" : "Status Kawin"}
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
                  {
                    label: language === "EN" ? "Not Married" : "Belum Nikah",
                    value: language === "EN" ? "Not Married" : "Belum Nikah",
                  },
                  {
                    label: language === "EN" ? "Married" : "Nikah",
                    value: language === "EN" ? "Married" : "Nikah",
                  },
                ]}
              />
            </View>
          </>
        )}
        name="marital_stats"
        rules={{ required: true }}
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
