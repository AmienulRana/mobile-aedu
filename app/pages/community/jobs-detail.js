import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { getTimeAgoString } from "../../components/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import axios from "axios";
import { useProfileContext } from "../../context/useProfileContext";
import { useLanguageContext } from "../../context/LanguageContext";

export default function CommunityJobsDetail() {
  const { data: jobs } = useFetch("/comm/allJobs", URL_API_COMM);
  const { width } = useWindowDimensions();
  const [detailJobs, setDetailJobs] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();
  const { profileContext } = useProfileContext();
  const { language } = useLanguageContext();

  const router = useRoute();

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleApplyJob = async () => {
    try {
      const response = await axios.get(
        `${URL_API_COMM}/comm/apply_job/${detailJobs?.id}`
      );
      if (response?.status === 200) {
        closeModal();
        Alert.alert("Congratulations!", "We have sent your digital portfolio!");
        navigation?.goBack();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Failed sent your digital portfolio!");
    }
  };

  useEffect(() => {
    const filterJobs = jobs?.find((job) => job?.id === router.params?.id_jobs);
    setDetailJobs(filterJobs);
  }, [router, jobs]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {language === "EN" ? "Back" : "Kembali"}
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.jobName}>{detailJobs?.job_name}</Text>
          <Text style={styles.companyInfo}>
            {detailJobs?.ms_User?.ms_EnterpriseProfile?.business_name} |{" "}
            {detailJobs?.employer} {language === "EN" ? "Applicant" : "Pelamar"}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              {/* <TfiBag style={styles.icon} /> */}
              <Text style={styles.detailText}>{detailJobs?.job_type}</Text>
            </View>
            <View style={styles.detailItem}>
              {/* <RiHotelLine style={styles.icon} /> */}
              <Text style={styles.detailText}>
                1 - 10 {language === "EN" ? "Employee" : "Karyawan"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              {/* <IoLocationOutline style={styles.icon} /> */}
              <Text style={styles.detailText}>
                {detailJobs?.ms_City?.name}, Indonesia (On-Site)
              </Text>
            </View>
          </View>

          {!profileContext?.enterpise && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>
                  {language === "EN" ? "Apply Job" : "Lamar Pekerjaan"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {language === "EN" ? "Save Job" : "Simpan"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.skillTitle}>
            {language === "EN" ? "Skills:" : "Keahlian:"}
          </Text>
          <View style={styles.skillsContainer}>
            {detailJobs?.skills?.split(",").map((skill, i) => (
              <View key={i} style={styles.skill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.jobDescriptionTitle}>
            {language === "EN" ? "About the job:" : "Tentang pekerjaan:"}
          </Text>

          <RenderHTML
            style={styles.jobDescription}
            contentWidth={width}
            source={{ html: detailJobs?.description }}
          />

          <View style={styles.extraDetailsContainer}>
            <View style={styles.extraDetail}>
              <Text style={styles.extraDetailTitle}>
                {language === "EN" ? "Qualification:" : "Kualifikasi:"}
              </Text>
              <Text style={styles.extraDetailText}>{detailJobs?.degree}</Text>
            </View>
            <View style={styles.extraDetail}>
              <Text style={styles.extraDetailTitle}>
                {language === "EN" ? "Experience:" : "Pengalaman:"}
              </Text>
              <Text style={styles.extraDetailText}>{detailJobs?.exp}</Text>
            </View>
            <View style={styles.extraDetail}>
              <Text style={styles.extraDetailTitle}>
                {language === "EN" ? "Language:" : "Bahasa:"}
              </Text>
              <Text style={styles.extraDetailText}>{detailJobs?.language}</Text>
            </View>
          </View>

          <Text style={styles.companyInfoTitle}>
            {language === "EN" ? "About the Company:" : "Tentang Perusahaan:"}
          </Text>

          <Text style={styles.companyInfoText}>
            marketing, PR, business development, fundraising, initial coin
            offering (ICO), tokenomics, startups, blockchain, advertising,
            community building, business plan, investor deck, influencer
            marketing, bounty campaigns, blockchain development, crypto
            marketing, NFT Marketing, NFT Development, smart contract
            development, non fungible token development, initial dex offering
            (IDO), crypto exchange listings, and blockchain advisory
          </Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {
            closeModal();
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            />
            <View
              style={{
                width: "80%",
                maxHeight: 350,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {language === "EN"
                  ? "We will send your digital portfolio to "
                  : "Kami akan mengirimkan portofolio digital Anda kepada "}
                <Text style={{ color: COLORS.main }}>
                  {detailJobs?.ms_User?.ms_EnterpriseProfile?.business_name}
                </Text>
              </Text>
              <Text style={{ textAlign: "center" }}>
                {language === "EN" ? "Are you sure?" : "Apakah Anda yakin?"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 120,
                    paddingVertical: 10,
                    borderRadius: 5,
                    backgroundColor: "white",
                    color: COLORS.primary,
                    borderWidth: 1,
                    borderColor: COLORS.main,
                  }}
                  onPress={() => setIsVisible(false)}
                >
                  <Text style={{ color: COLORS.main, textAlign: "center" }}>
                    {language === "EN" ? "Cancel" : "Batal"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 120,
                    paddingVertical: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.main,
                  }}
                  onPress={handleApplyJob}
                >
                  <Text style={{ color: "#FFF", textAlign: "center" }}>
                    {language === "EN" ? "Yes, Sure" : "Ya, Tentu"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  jobName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  companyInfo: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 6,
    gap: 20,
    marginBottom: 10,
  },
  applyButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.main,
    borderRadius: 25,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  saveButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.main,
    borderRadius: 25,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.main,
  },
  skillTitle: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skill: {
    backgroundColor: COLORS.main,
    borderRadius: 25,
  },
  skillText: {
    fontSize: 14,
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  jobDescriptionTitle: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
  },
  jobDescription: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.gray,
  },
  extraDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    marginTop: 20,
  },
  extraDetail: {
    flex: 1,
  },
  extraDetailTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  extraDetailText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  companyInfoTitle: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
  },
  companyInfoText: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.gray,
  },
});
