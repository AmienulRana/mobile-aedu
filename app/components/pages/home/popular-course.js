import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BadgeCourse from "../../common/badge-course";
import useFetch from "../../../hooks/useFetch";
import { useLanguageContext } from "../../../context/LanguageContext";

export default function PopularCourse() {
  const navigation = useNavigation();
  const { data: courses } = useFetch("/top_course");
  const { language } = useLanguageContext();

  return (
    <View style={styles.popularCourseContainer}>
      <Text style={styles.popularCourseTitle}>
        {language === "EN" ? "Popular Course" : "Kursus Populer"}
      </Text>
      <View style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={courses}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("course-detail", {
                  id: item?.ms_EnterpriseCourse?.id,
                })
              }
              style={styles.popularCourseContent}
            >
              <Image
                style={styles.popularCourseImage}
                source={{ uri: item.thumbnail }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 15,
                  marginTop: 5,
                }}
              >
                <BadgeCourse
                  courseType={item?.ms_EnterpriseCourse?.course_type}
                />
              </View>
              <Text style={styles.contentTitleCourse}>
                {item?.ms_EnterpriseCourse?.title}
              </Text>
              <Text style={styles.contentLessionCourse}>
                Rp
                {Number(item?.ms_EnterpriseCourse?.price).toLocaleString(
                  "id-ID"
                )}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(image, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popularCourseContainer: {
    marginTop: 30,
  },
  popularCourseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  popularCourseContent: {
    marginRight: 15,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000", // Warna bayangan
    shadowOffset: {
      width: 0,
      height: 2,
    }, // Ukuran offset bayangan
    shadowOpacity: 0.2, // Opasitas bayangan
    shadowRadius: 3, // Radius bayangan
    width: 200,
  },
  popularCourseImage: {
    width: 200,
    height: 117,
    marginBottom: 10,
  },
  contentTitleCourse: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  contentLessionCourse: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
