import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useLanguageContext } from "../../context/LanguageContext";
import { Alert } from "react-native";
import COLORS from "../../components/shared/COLORS";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { URL_API } from "../../hooks/useFetch";

export default function ActionJournal() {
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

  const navigation = useNavigation();
  const router = useRoute();

  const { language } = useLanguageContext();
  const onSubmitForm = async (data) => {
    try {
      const fd = new FormData();
      fd.append("title", data?.title);
      fd.append("desc", watch("desc"));
      fd.append("link", data?.url);
      const response = await axios.post(`${URL_API}/add_sciworks`, fd);
      if (response.status === 200) {
        navigation.push('profile')
      }
    } catch (error) {
      Alert.alert(
        language === "EN" ? "Failed to update journal" : "Gagal memperbarui jurnal"
      );
      console.log(error);
    }
  };
  return (
    <View style={stylesModal.container}>
        {router?.params?.certificate ? (
      <Text style={stylesModal.title}>
        {language === "EN" ? "Edit Medical Journal" : "Ubah Jurnal Medis"}
      </Text>
        ) : (
      <Text style={stylesModal.title}>
        {language === "EN" ? "Add Medical Journal" : "Tambah Jurnal Medis"}
      </Text>
        )}

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

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={stylesModal.button}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {language === "EN" ? "Close" : "Tutup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const stylesModal = StyleSheet.create({
  container: {
    paddingTop: 40,
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
