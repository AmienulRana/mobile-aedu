import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useLanguageContext } from "../../context/LanguageContext";
import { URL_API, URL_API_COMM } from "../../hooks/useFetch";
import COLORS from "../../components/shared/COLORS";
import BackHeader from "../../components/common/back-header";

export default function ReportPost() {
  const { language } = useLanguageContext();
  const [reportReason, setReportReason] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");

  const router = useRoute();
  const navigation = useNavigation();
  useEffect(() => {
    setReportReason(
      language === "ID"
        ? [
            "Spam",
            "Pelanggaran Hak Cipta",
            "Pelanggaran Privasi",
            "Penipuan",
            "Tidak Suka Kontent Ini",
          ]
        : [
            "Spam",
            "Copyright infringement",
            "Breach of Privacy",
            "Fraud",
            "Don't Like This Content",
          ]
    );
  }, [language]);

  const submitReport = async () => {
    try {
      const response = await axios.post(
        `${URL_API_COMM}/comm/report_post/${router.params?.post_id}`,
        { issue: selectedReason }
      );
      if (response.status === 200) {
        Alert.alert(
          language === "EN"
            ? "Reported sent success!"
            : "Laporan berhasil dikirim"
        );
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        language === "EN" ? "Reported sent failed!" : "Gagal mengirim laporan"
      );
      console.log(error);
    }
  };

  return (
    <>
      <View style={{ padding: 15 }}>
        <BackHeader />
      </View>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {language === "EN" ? "Report Post" : "Laporkan Postingan"}
          </Text>
          <Text style={styles.description}>
            {language === "EN"
              ? "Flagging a post will notify aedu team who will take appropriate action."
              : "Laporkan postingan ini akan memberi tau tim aedu  yang akan mengambil tindakan yang sesuai."}
          </Text>
          {reportReason.map((reason, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedReason(reason)}
              style={[
                styles.reasonItem,
                {
                  backgroundColor:
                    reason === selectedReason ? COLORS.main : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.reasonText,
                  { color: reason === selectedReason ? "white" : "black" },
                ]}
              >
                {i + 1}. {reason}
              </Text>
            </TouchableOpacity>
          ))}
          <Button
            onPress={submitReport}
            disabled={!selectedReason}
            title={language === "EN" ? "Submit" : "Kirim"}
            color={COLORS.main}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  modalContent: {
    padding: 10,
    width: "90%",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: "gray",
    marginBottom: 16,
  },
  reasonItem: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.main,
    borderRadius: 5,
  },
  reasonText: {
    fontSize: 14,
  },
});
