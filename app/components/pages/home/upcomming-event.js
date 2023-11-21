import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../../../hooks/useFetch";
import COLORS from "../../shared/COLORS";
import { useLanguageContext } from "../../../context/LanguageContext";

const images = [
  require("../../../assets/courses/course-1.png"),
  require("../../../assets/courses/course-2.png"),
  require("../../../assets/courses/course-3.png"),
];

export default function UpcommingEvent() {
  const navigation = useNavigation();
  const { data: continueLearning } = useFetch("/lp");
  const { language } = useLanguageContext();

  return (
    continueLearning?.length > 0 && (
      <View style={styles.continueLearnContainer}>
        <Text style={styles.continueLearnTitle}>
          {language === "EN" ? "Upcoming Event!" : "Acara Mendatang!"}
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={continueLearning}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("course-detail", {
                  id: item?.ms_EnterpriseCourse?.id,
                })
              }
              style={{ width: 200, marginRight: 20 }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    backgroundColor: COLORS.orange,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    fontSize: 12,
                    borderRadius: 2,
                    marginBottom: 8,
                    color: "white",
                  }}
                >
                  {index + 2} {language === "EN" ? "Days Left" : "Hari Lagi"}
                </Text>
              </View>
              <Image
                style={styles.continueLearnImage}
                source={images[index + 1]}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
                {item?.ms_EnterpriseCourse?.title}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(image, index) => index.toString()}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  continueLearnContainer: {
    marginTop: 30,
  },
  continueLearnTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  continueLearnImage: {
    width: 200,
    height: 117,
  },
});
