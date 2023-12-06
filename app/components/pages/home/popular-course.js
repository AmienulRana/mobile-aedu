import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BadgeCourse from "../../common/badge-course";
import useFetch from "../../../hooks/useFetch";
import { useLanguageContext } from "../../../context/LanguageContext";

export default function PopularCourse() {
  const navigation = useNavigation();
  const { data: courses } = useFetch("/top_course");
  const { language } = useLanguageContext();
  const router = useRoute();
  const [dataCourse, setDataCourse] = useState([]);

  const handleFilterCourse = (tab) => {
    // setTabActive(tab);


    const filteredCourses = courses?.filter((course) => {
      if (tab === "Learning Material" || tab === "Material Pembelajaran") {
        return course.course_type === "Book";
      } else if (tab === 'Health') {
        return course.course_cat_name === "Health";
      } else if (tab === 'Tech') {
        return course.course_cat_name === "Tech";
      } else if (tab === 'Art') {
        return course.course_cat_name === "Art";
      }
      return false;
    });
  
    setDataCourse(filteredCourses);
  };

  useEffect(() => {
    handleFilterCourse(router.params?.category);
  }, [router])

  return (
    <View style={styles.popularCourseContainer}>
      <Text style={styles.popularCourseTitle}>
        {language === 'EN' ?  "Seminar / Training" : "Seminar / Latihan"}
      </Text>
      {dataCourse?.length === 0 && (
        <Text style={{textAlign:'center', marginTop:25}}>{language === 'EN' ?  "No seminar / training found" : "Tidak ada seminar / latihan disini" }</Text>
      )}
      <View style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={dataCourse}
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
                source={{ uri: item?.ms_EnterpriseCourse?.thumbnail }}
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
              <Text style={styles.contentTitleCourse} numberOfLines={1} ellipsisMode="clip">
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
