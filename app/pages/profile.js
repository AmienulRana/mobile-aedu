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
import BottomMenuBar from "../components/common/bottom-menu";
import COLORS from "../components/shared/COLORS";
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Timeline from "../components/common/timeline";
import useFetch, { URL_API } from "../hooks/useFetch";
import moment from "moment/moment";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageContext } from "../context/LanguageContext";

export default function Profile() {
  const { data: token } = useFetch("/getToken");
  const { data: experienceData } = useFetch("/get_exp");
  const { data: educationData } = useFetch("/get_edu");
  const {
    data: userProfile,
    fetchData: fetchUserProfile,
    isLoading,
  } = useFetch(`/getProfile?token=${token?.token}`);
  const { data: certificate, fetchData: fetchCertificate } = useFetch(
    `/ext_certs/${userProfile?.profile?.user_ref}`
  );

  const [experienceTimeline, setExperienceTimeline] = useState([]);
  const [educationTimeline, setEducationTimeline] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAbout, setShowModalAbout] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const { language } = useLanguageContext();

  const [imageSource, setImageSource] = useState(null);

  const chooseImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Failed to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageSource({ uri: result.assets[0].uri });
    }
  };
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${URL_API}/logout`);
      if (response.status === 200) {
        await AsyncStorage.removeItem("login-mode");
        navigation.navigate("login");
      }
    } catch (error) {
      Alert.alert("Failed to logout");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
    if (!isLoading) {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const changeStructure = experienceData?.exp_data?.map((experience) => ({
      title: experience?.title,
      description: experience?.Description || "Description Jobs",
      ortherText: experience?.location_type,
      date: `${moment(experience?.start_date).format("MMMM YYYY")} - ${
        experience?.currently_working
          ? "Now"
          : moment(experience?.end_date).format("MMMM YYYY")
      }`,
      subTitle: `${experience?.company} · ${experience?.employment_type}`,
    }));
    setExperienceTimeline(changeStructure);
  }, [experienceData]);
  useEffect(() => {
    const changeStructure = educationData?.edu_data?.map((education) => ({
      title: education?.school,
      date: `${moment(education?.grad_date).format("MMMM YYYY")}`,
      subTitle: `${education?.degree} · ${education?.study_field}`,
    }));
    setEducationTimeline(changeStructure);
  }, [educationData]);

  useEffect(() => {
    fetchUserProfile();
  }, [token]);
  useEffect(() => {
    fetchCertificate();
  }, [userProfile]);
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ backgroundColor: "white", padding: 5 }}>
          <View style={styles.bannerProfile}></View>
          {/* <Button title="Pilih Gambar" /> */}
          <TouchableOpacity
            onPress={chooseImage}
            activeOpacity={1}
            style={[styles.avatarProfile, { position: "relative" }]}
          >
            {imageSource ? (
              <Image
                source={{ uri: imageSource.uri }}
                style={{ width: 120, height: 120, borderRadius: 100 }}
              />
            ) : (
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                {userProfile?.profile?.first_name?.substring(0, 1)}
              </Text>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 10,
                right: imageSource ? -18 : -10,
                borderWidth: 1,
                borderColor: COLORS.main,
                backgroundColor: "white",
                padding: 8,
                borderRadius: 100,
              }}
            >
              <FontAwesome name="camera" size={14} color={COLORS.main} />
            </View>
          </TouchableOpacity>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {userProfile?.profile?.first_name}{" "}
                {userProfile?.profile?.last_name}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <FontAwesome5 name="pencil-alt" size={15} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16 }}>
              {userProfile?.profile?.tagline}
            </Text>

            <View style={{ marginTop: 5, flexDirection: "row", gap: 7 }}>
              <Ionicons name="location" size={20} color={COLORS.gray} />
              <Text style={{ fontSize: 16 }}>Medan, Sumatera Utara</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {language === "EN" ? "About Me" : "Tentang Saya"}
            </Text>

            <TouchableOpacity onPress={() => setShowModalAbout(true)}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 15, flexDirection: "row", gap: 7 }}>
            <Text style={{ fontSize: 16 }}>{userProfile?.profile?.about}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Personal Information" : "Informasi Pribadi"}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"}{" "}
              {language === "EN" ? "Marital status" : "Status Pernikahan"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.marital_stats}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Gender" : "Jenis Kelamin"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.gender}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Religion" : "Agama"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {userProfile?.profile?.religion}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>
              {"\u2022"} {language === "EN" ? "Age" : "Usia"}:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {moment().diff(
                moment(userProfile?.profile?.dateofbirth),
                "years"
              )}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Experience" : "Pengalaman"}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <Timeline data={experienceTimeline} />
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Certificate" : "Sertifikat"}
            </Text>

            <TouchableOpacity onPress={() => setShowModal(true)}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          {certificate?.map((certif) => (
            <View key={certif?.id} style={styles.WrapperCertificate}>
              <View style={styles.header}>
                <Text style={styles.title}>{certif?.cert_title}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.organization}>{certif?.organization}</Text>
                <Text style={styles.date}>
                  Issued {moment(certif?.issue_date).format("YYYY")}{" "}
                  {`- Expires ${moment(certif?.expired_date).format("YYYY")}`}
                </Text>
                <View style={styles.credential}>
                  <Text style={styles.credentialText}>
                    Credential ID {certif?.cert_id}
                  </Text>
                  <EvilIcons
                    name="external-link"
                    size={24}
                    color="black"
                    onPress={() =>
                      Linking.openURL(certif?.url || "https://google.com")
                    }
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Education" : "Pendidikan"}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <Timeline data={educationTimeline} />
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {language === "EN" ? "Medical Journal" : "Jurnal Medis"}
            </Text>
            <TouchableOpacity onPress={() => setShowModal("journal")}>
              <FontAwesome5 name="pencil-alt" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginBottom: 12,
              paddingBottom: 12,
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Journal Title
              </Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {language === "EN" ? "Link to Journal" : "Link ke jurnal"}
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://google.com")}
                >
                  <EvilIcons name="external-link" size={24} color="black" />
                </TouchableOpacity>
              </Text>
              <Text style={{ fontSize: 14, marginTop: 6 }}>
                this is description to jurnal
              </Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "white", padding: 5, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            Digital Portfolio
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 3,
              marginBottom: 30,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {language === "EN"
                ? "Download digital portfolio"
                : "Unduh portofolio digital"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://learning.aedu.id/digital-portfolio/${userProfile?.profile?.user_ref}`
                )
              }
            >
              <Text style={{ fontSize: 16, color: COLORS.main }}>
                {language === "EN" ? "in here!" : "di sini!"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={[styles.buttonLogout, {backgroundColor: 'transparent', color: 'red', borderColor: 'red', borderWidth: 2}]}>
            {language === "EN" ? "Logout" : "Keluar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://learning.aedu.id/remove-account')}>
          <Text style={styles.buttonLogout}>
            {language === "EN" ? "Delete Account" : "Hapus Akun"}
          </Text>
        </TouchableOpacity>
        <ModalInformation
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          profile={userProfile?.profile}
        />
        <ModalJournal
          isVisible={showModal === "journal"}
          onClose={() => setShowModal(false)}
        />
        <ModalAbout
          isVisible={showModalAbout}
          onClose={() => setShowModalAbout(false)}
          profile={userProfile?.profile}
        />
      </ScrollView>
      <BottomMenuBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    position: "relative",
    marginTop: StatusBar.currentHeight,
  },
  buttonLogout: {
    backgroundColor: COLORS.red,
    padding: 14,
    marginVertical: 30,
    color: "white",
    textAlign: "center",
    borderRadius: 15,
  },
  bannerProfile: {
    height: 200,
    width: "auto",
    backgroundColor: "#E0E0E0",
  },
  avatarProfile: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginLeft: 20,
    marginTop: -40,
    marginBottom: 15,
    // transform: [{ translateY: -50 }],
  },
  WrapperCertificate: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  organization: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    marginTop: 5,
  },
  credential: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  credentialText: {
    fontSize: 14,
  },
});

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
          {language === "EN" ? "Your Information" : "Informasi Anda"}
        </Text>

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              placeholder={language === "EN" ? "First Name" : "Nama Depan"}
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              style={stylesModal.input}
            />
          )}
          name="first_name"
          rules={{ required: true }}
        />
        {errors?.first_name && (
          <Text style={stylesModal.error}>{errors?.first_name?.message}</Text>
        )}

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

        {errors?.last_name && (
          <Text style={stylesModal.error}>{errors?.last_name?.message}</Text>
        )}
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
        {errors?.prof_name && (
          <Text style={stylesModal.error}>{errors?.prof_name?.message}</Text>
        )}

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
        <Text style={{ color: COLORS.gray }}>
          {language === "EN" ? "Ex:" : "Contoh:"} Frontend Developer at
          Tokopedia | Mentor | Web3 Developer
        </Text>
        {errors?.tagline && (
          <Text style={stylesModal.error}>{errors?.tagline?.message}</Text>
        )}

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
export function ModalJournal({ isVisible, onClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      link: "",
      desc: "",
    },
  });

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
      try {

        const fd = new FormData();
        fd.append('title', data?.title);
        fd.append('desc', watch('description'));
        fd.append('link', data?.url);
        const response = await axios.post(`${URL_API}/add_sciworks`, fd);
        if (response.status === 200) {
          onClose();
        }
      } catch (error) {
        Alert.alert(language === 'EN' ? 'Failed to save journal' : 'Gagal menyimpan jurnal')
        console.log(error);
      }
    }
  return (
    <Modal animationType="slide" visible={isVisible} onBackdropPress={onClose}>
      <View style={stylesModal.container}>
        <Text style={stylesModal.title}>
          {language === "EN" ? "Medical Journal" : "Jurnal Medis"}
        </Text>

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              placeholder={language === "EN" ? "Title" : "Judul"}
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              style={stylesModal.input}
            />
          )}
          name="title"
          rules={{ required: true }}
        />

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              placeholder={language === "EN" ? "Description" : "Deskripsi"}
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              style={stylesModal.input}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          )}
          name="desc"
          rules={{ required: true }}
        />

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              placeholder={
                language === "EN" ? "URL Journal Medical" : "URL Jurnal Medis"
              }
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              style={stylesModal.input}
            />
          )}
          name="link"
          rules={{ required: true }}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmitForm)}
          style={stylesModal.button}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {language === "EN" ? "Save" : "Simpan"}
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
export function ModalAbout({ isVisible, onClose, profile }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      about: "",
    },
  });

  const onSubmitForm = async (data) => {
    try {
      const response = await axios.put(`${URL_API}/updateAbout`, {
        ...data,
      });
      if (response.status === 200) {
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setValue("about", profile?.about);
  }, [profile]);
  return (
    <Modal animationType="slide" visible={isVisible} onBackdropPress={onClose}>
      <View style={stylesModal.container}>
        <Text style={stylesModal.title}>About Me</Text>
        <Text style={{ marginTop: 30, color: COLORS.gray }}>
          You can write about your years of experience, industry, or skills.
          People also talk about their achievements or previous job experiences.
        </Text>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              placeholder=""
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              style={stylesModal.input}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          )}
          name="about"
          rules={{ required: true }}
        />
        {errors?.about && (
          <Text style={stylesModal.error}>{errors?.about?.message}</Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmitForm)}
          style={stylesModal.button}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={stylesModal.button}>
          <Text style={{ color: "white", textAlign: "center" }}>Close</Text>
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
