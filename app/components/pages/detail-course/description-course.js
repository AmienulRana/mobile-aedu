import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import RenderHTML from "react-native-render-html";
import COLORS from "../../shared/COLORS";
import { useLanguageContext } from "../../../context/LanguageContext";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ModalReport from "./modal-report";

export default function DescriptionCourse({ data }) {
  const { width } = useWindowDimensions();
  const { language } = useLanguageContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {data?.course?.title}
        </Text>
        <Text style={{ color: COLORS.gray }}>
          {language === "EN" ? "By" : "Dibuat Oleh"}{" "}
          {data?.course?.ms_User?.ms_EnterpriseProfile?.business_name}
        </Text>
        <Image
          source={{ uri: data?.course?.thumbnail }}
          style={{
            height: 150,
            marginTop: 15,
            borderRadius: 10,
            width: width - 2 * 25,
          }}
        />
        <TouchableOpacity
        onPress={() => setShowModal(true)}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <FontAwesome name="flag" size={14} color={COLORS.gray} />
          <Text style={{ fontSize: 14, marginLeft: 8, color: COLORS.gray }}>
            {language === "EN" ? "Report" : "Laporkan"}
          </Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
          {language === "EN" ? "About Learning" : "Tentang Pembelajaran"}
        </Text>
        <View style={{ color: COLORS.gray, marginTop: 10 }}>
          <RenderHTML
            source={{ html: data?.course?.description }}
            contentWidth={width}
          />
        </View>
      </View>
      <ModalReport showModal={showModal} setShowModal={setShowModal} />

    </View>
  );
}

const styles = StyleSheet.create({});
