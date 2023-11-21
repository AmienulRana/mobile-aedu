import moment from "moment/moment";
import { Linking } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { averageRating } from "../../utils/helper";
import COLORS from "../../shared/COLORS";
import { useLanguageContext } from "../../../context/LanguageContext";

export function CourseInformation({ Icon, label, value }) {
  return (
    <View style={styles.infoCourseWrapper}>
      {Icon}
      <Text style={{ flex: 1 }}>
        {label && `${label}:`} {value}
      </Text>
    </View>
  );
}

export default function InformationDetail({ data }) {
  const { language } = useLanguageContext();
  return (
    <>
      <CourseInformation
        Icon={<Feather name="book-open" size={20} color="black" />}
        label={language === "EN" ? "Learning Method" : "Metode Pembelajaran"}
        value={data?.course?.learning_method}
      />
      <CourseInformation
        Icon={<Ionicons name="location-outline" size={20} color="black" />}
        label={language === "EN" ? "Location" : "Lokasi"}
        value={`${data?.course?.address}, ${data?.course?.ms_City?.name}`}
      />

      <CourseInformation
        Icon={<MaterialIcons name="date-range" size={20} color="black" />}
        label={language === "EN" ? "Start Date" : "Tanggal Mulai"}
        value={
          moment(data?.course?.start_date).format("DD MMMM YYYY | hh:mm") +
          " WIB"
        }
      />
      <CourseInformation
        Icon={<MaterialIcons name="language" size={20} color="black" />}
        label={language === "EN" ? "Language" : "Bahasa"}
        value={data?.course?.language}
      />
      <CourseInformation
        Icon={<Feather name="clock" size={20} color="black" />}
        value={data?.course?.approx_time}
        label={language === "EN" ? "Duration" : "Durasi"}
      />
      <CourseInformation
        Icon={
          <MaterialCommunityIcons
            name="certificate-outline"
            size={20}
            color="black"
          />
        }
        label={language === "EN" ? "Certificate" : "Sertifikat"}
        value={
          data?.course?.certificate
            ? language === "EN"
              ? "Yes"
              : "Ya"
            : language === "EN"
            ? "No"
            : "Tidak"
        }
      />
      <View style={styles.infoCourseWrapper}>
        <MaterialCommunityIcons name="key-outline" size={20} color="black" />
        <View style={{ flexDirection: "row" }}>
          <Text>{language === "EN" ? "Credentials" : "Kredensial"}:</Text>

          {data?.course?.ms_CourseCreds?.map((credential, i) => (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://learning.aedu.id/credentials/preview/${credential?.ms_Credential?.id}`
                )
              }
              activeOpacity={0.4}
              key={credential?.id}
            >
              <Text style={{ color: COLORS.main }}>
                {credential?.ms_Credential?.cred_name}
                {i === data?.course?.ms_CourseCreds?.length - 1 ? "" : ", "}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  infoCourseWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 9,
    flex: 1,
  },
});
