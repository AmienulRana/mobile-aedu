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

export default function ActionCertificate() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      url: "",
      issue_date_month: "",
      issue_date_year: "",
      expire_date_year: "",
      expire_date_month: "",
      organization: "",
      cert_id: "",
      cert_title: "",
      issue_date: "",
      expired_date: "",
    },
  });
  const router = useRoute();

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
    try {
      const payload = {
        ...data,
        issue_date: `${data?.issue_date_month} ${data?.issue_date_year}`,
        expired_date: `${data?.expire_date_month} ${data?.expire_date_year}`,
      };

      if (!router?.params?.certificate) {
        await axios.post(`${URL_API}/addCerts`, payload);
      } else {
        await axios.put(
          `${URL_API}/edit_cert/${router?.params?.certificate?.id}`,
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
    const data = router?.params?.certificate;
    const issueDate = moment(data?.issue_date).format("MMMM YYYY")?.split(" ");
    const expiredDate = moment(data?.expired_date).format("MMMM YYYY")?.split(" ");
      setValue("cert_title", data?.cert_title);
      setValue("organization", data?.organization);
      setValue("cert_id", data?.cert_id);
      setValue("url", data?.url);
      setValue("issue_date_month", issueDate[0]);
      setValue("issue_date_year", issueDate[1]);
      setValue("expire_date_month", expiredDate[0]);
      setValue("expire_date_year", expiredDate[1]);
  }, [router]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {router?.params?.certificate
          ? language === "EN"
            ? "Edit Certificate"
            : "Ubah Sertifikat"
          : language === "EN"
          ? "Add Certificate"
          : "Tambah Sertifikat"}
      </Text>

      <Text style={styles.label}>
        {language === "EN" ? "Name Certificate" : "Nama Sertifikat"}
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
        name="cert_title"
        rules={{ required: true }}
      />
      {errors?.cert_title && (
        <Text style={styles.error}>{errors?.cert_title?.message}</Text>
      )}

      <Text style={styles.label}>
        {language === "EN" ? "Organization" : "Organisasi"}
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onChangeText={(text) => onChange(text)}
            value={value}
            style={styles.input}
          />
        )}
        name="organization"
        defaultValue=""
      />

      <Text style={styles.label}>
        {language === "EN" ? "Issued Date" : "Tanggal Penerbitan"}
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
        name="issue_date_month"
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
        name="issue_date_year"
        defaultValue=""
      />

      <Text style={styles.label}>
        {language === "EN" ? "Expired Date" : "Tanggal Berakhir"}
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
        name="expire_date_month"
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
        name="expire_date_year"
        defaultValue=""
      />

      <Text style={styles.label}>
        {language === "EN" ? "Credential ID" : "Kredensial ID"}
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
        name="cert_id"
        rules={{ required: true }}
      />
      {errors?.cert_id && (
        <Text style={styles.error}>{errors?.cert_id?.message}</Text>
      )}

      <Text style={styles.label}>
        {language === "EN" ? "Certificate URL" : "Sertifikat URL"}
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
        name="url"
        rules={{ required: true }}
      />
      {errors?.url && <Text style={styles.error}>{errors?.url?.message}</Text>}

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
    marginBottom: 20,
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
