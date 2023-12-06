import { useEffect, useState } from "react";
import { useLanguageContext } from "../../../context/LanguageContext";
import { URL_API } from "../../../hooks/useFetch";
import { Alert, Button, Modal, TouchableOpacity, View, StyleSheet, Text } from "react-native";
import COLORS from "../../shared/COLORS";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

export default function ModalReport ({ showModal, setShowModal}) {
    const {language} = useLanguageContext();
    const [reportReason, setReportReason] = useState([]);
    const [selectedReason, setSelectedReason] = useState('');
  
  
    const router = useRoute();
    useEffect(()  => {
      setReportReason(language === 'EN' ? [
        "Misinformation or Fake Information",
        "Promote Hate Speech / Violence",
        "Inappropriate / Adult Content",
        "Copyright / Intellectual Property Infringement",
        "Other Reason / Dont Like the subject matters",
      ] : [
        "Misinformasi atau Informasi Palsu",
        "Mempromosikan ujaran kebencian / kekerasan",
        "Konten yang Tidak Pantas / Dewasa",
        "Pelanggaran Hak Cipta / Kekayaan Intelektual",
        "Alasan Lain / Tidak Suka pokok bahasan",
      ])
    }, [language])
  
    const submitReport = async () => {
      try {
        const response = await axios.post(
          `${URL_API}/addReport/${router.params?.id}`,
          { issue: selectedReason }
        );
        if (response.status === 200) {
          setShowModal(false);
          Alert.alert(
            language === "EN"
              ? "Reported sent success!"
              : "Laporan berhasil dikirim"
          );
        }
      } catch (error) {
        Alert.alert(
          language === "EN" ? "Reported sent failed!" : "Gagal mengirim laporan"
        );
        console.log(error);
      }
    };
  
    return (
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {language === 'EN' ? "Report Learning" : "Laporkan Pembelajaran"}
            </Text>
            <Text style={styles.description}>
              {language === 'EN' ? "Flagging a learning will notify aedu team who will take appropriate action." : "Laporkan kursus ini akan memberi tau tim Aedu yang akan mengambil tindakan yang sesuai."}
            </Text>
            {reportReason.map((reason, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedReason(reason)}
                style={[
                  styles.reasonItem,
                  { backgroundColor: reason === selectedReason ? COLORS.main : 'transparent' },
                ]}
              >
                <Text style={[styles.reasonText, {color: reason === selectedReason ? 'white' : 'black'}]}>
                  {i + 1}. {reason}
                </Text>
              </TouchableOpacity>
            ))}
            <Button
              onPress={submitReport}
              disabled={!selectedReason}
              title={language === 'EN' ? 'Submit' : "Kirim"}
              color={COLORS.main}
            />
          </View>
        </View>
      </Modal>
    )
  }
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      alignItems: 'center',
    },
    modalContent: {
      padding: 10,
      width: "90%",
      borderRadius: 10,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 8,
    },
    description: {
      color: 'gray',
      marginBottom: 16,
    },
    reasonItem: {
      width: '100%',
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