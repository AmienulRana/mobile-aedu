import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Linking,
    TouchableOpacity,
    Button,
    Image,
    Modal,
    TextInput,
    RefreshControl,
    Alert,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import BottomMenuBar from "../../../common/bottom-menu";
  import COLORS from "../../../shared/COLORS";
  import {
    AntDesign,
    EvilIcons,
    FontAwesome,
    FontAwesome5,
    Ionicons,
  } from "@expo/vector-icons";
  import Timeline from "../../../common/timeline";
  import useFetch, { URL_API } from "../hooks/useFetch";
  import moment from "moment/moment";
  import * as ImagePicker from "expo-image-picker";
  import { Controller, useForm } from "react-hook-form";
  import axios from "axios";
  import { useNavigation } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useLanguageContext } from "../../../../context/LanguageContext";
import { RadioButton } from "react-native-paper";
  
  export function ModalInformation({ isVisible, onClose, profile }) {
    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
    } = useForm({
      defaultValues: {
        first_name: profile?.first_name,
        last_name: "",
        prof_name: "",
        tagline: "",
        phone: "",
        detail_address: "",
      },
    });
  
    const { language } = useLanguageContext();
    const onSubmitForm = async (data) => {
      if (data?.first_name && data?.last_name) {
        try {
          const response = await axios.put(`${URL_API}/updateProfile`, {
            ...data,
          });
          if (response.status === 200) {
            onClose();
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        // Validasi gagal, Anda bisa menambahkan penanganan kesalahan di sini
        console.log("Form validation failed");
      }
    };
    useEffect(() => {
      setValue("first_name", profile?.first_name);
      setValue("last_name", profile?.last_name);
      setValue("prof_name", profile?.prof_name);
      setValue("tagline", profile?.tagline);
      setValue("phone", profile?.phone);
      setValue("detail_address", profile?.detail_address);
    }, [profile]);
    return (
      <Modal animationType="slide" visible={isVisible} onBackdropPress={onClose}>
        <View style={stylesModal.container}>
          <Text style={stylesModal.title}>
            {language === "EN" ? "Personal Information" : "Informasi Pribadi"}
          </Text>
  
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={language === "EN" ? "Detail Address" : "Alamat lengkap"}
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
                numberOfLines={5}
                textAlignVertical="top"
              />
            )}
            name="first_name"
            rules={{ required: true }}
          />  
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={language === "EN" ? "Last Name" : "Nama Belakang"}
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
              />
            )}
            name="last_name"
            rules={{ required: true }}
          />
  
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={language === "EN" ? "Profile Name" : "Nama Profil"}
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
              />
            )}
            name="prof_name"
            rules={{ required: true }}
          />
           
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={"Tagline"}
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
              />
            )}
            name="tagline"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={
                  language === "EN" ? "No. Handphone" : "Nomor Handphone"
                }
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
                keyboardType="phone-pad"
              />
            )}
            name="phone"
            rules={{ required: true }}
          />

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
                value={true}
                status={watch("certificate") ? "checked" : "unchecked"}
                onPress={() => setValue("certificate", true)}
              />
              <Text>Yes</Text>
              <RadioButton
                color={COLORS.main}
                value={false}
                status={
                  watch("certificate") === false ? "checked" : "unchecked"
                }
                onPress={() => setValue("certificate", false)}
              />
              <Text>No</Text>
            </View>
  
          {errors?.phone && (
            <Text style={stylesModal.error}>{errors?.phone?.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder={
                  language === "EN" ? "Detail Address" : "Alamat Lengkap"
                }
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                style={stylesModal.input}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            )}
            name="detail_address"
            rules={{ required: true }}
          />
  
          {errors?.detail_address && (
            <Text style={stylesModal.error}>
              {errors?.detail_address?.message}
            </Text>
          )}
  
          <TouchableOpacity
            onPress={handleSubmit(onSubmitForm)}
            style={stylesModal.button}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {language === "EN" ? "Update" : "Perbarui"}
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={onClose} style={stylesModal.button}>
            <Text style={{ color: "white", textAlign: "center" }}>
              {language === "EN" ? "Close" : "Tutup"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  
  const stylesModal = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "white",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "gray",
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      marginTop: 15,
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
  