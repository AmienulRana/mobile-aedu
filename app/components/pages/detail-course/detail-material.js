import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { CourseInformation } from "./information-detail";
import { useLanguageContext } from "../../../context/LanguageContext";

export default function DetailMaterial({ data }) {
  const { language } = useLanguageContext();
  return (
    <>
      <CourseInformation
        Icon={<FontAwesome5 name="weight" size={20} color="black" />}
        label={language === "EN" ? "Weight" : "Berat"}
        value={data?.course?.weight}
      />
      <CourseInformation
        Icon={<FontAwesome5 name="truck" size={18} color="black" />}
        label={language === "EN" ? "Location" : "Lokasi"}
        value={"Jakarta Timur"}
      />
    </>
  );
}

const styles = StyleSheet.create({});
