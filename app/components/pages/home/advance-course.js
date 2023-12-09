import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import BadgeCourse from "../../common/badge-course";
import COLORS from "../../shared/COLORS";
import { useLanguageContext } from "../../../context/LanguageContext";

const images = [
  {
    title: "Basic Python",
    lession: 15,
    image: require("../../../assets/courses/popular-2.png"),
  },
  {
    title: "Basic React Js",
    lession: 10,
    image: require("../../../assets/courses/popular-3.png"),
  },
];

export default function AdvanceCourse({ courses }) {
  const navigation = useNavigation();
  const [tabActive, setTabActive] = useState("Technology");
  const [dataCourse, setDataCourse] = useState(courses);
  const { language } = useLanguageContext();
  const router = useRoute();

  const categoriesEN = [
    "Health",
    "Technology",
    "Art Desain",
    "Learning Material",
  ];
  const categoriesID = [
    "Kesehatan",
    "Teknologi",
    "Art Desain",
    "Material Pembelajaran",
  ];

  const handleFilterCourse = (tab) => {

    const filteredCourses = courses?.filter((course) => {
      if (tab === "Learning Material" || tab === "Material Pembelajaran") {
        return course?.course_type === "Book";
      } else if (tab === 'Health') {
        return course?.course_cat_name === "Health";
      } else if (tab === 'Tech') {
        return course?.course_cat_name === "Tech";
      } else if (tab === 'Art') {
        return course?.course_cat_name === "Art";
      }
      return [];
    });

    console.log('handle filter func', courses);
  
    setDataCourse(filteredCourses || []);
  };

  useEffect(() => {
    setTabActive(language === "EN" ? categoriesEN[0] : categoriesID[0]);
  }, [language]);

  useEffect(() => {
      handleFilterCourse(router.params?.category);
    // console.log('depen course', router?.params)
  }, [courses])


  return (
    <View style={styles.advanceCourseContainer}>
      <Text style={styles.advanceCourseTitle}>
        {language === "EN" ? "Learn Now" : "Belajar Sekarang"}
      </Text>
      <View style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
         {/* <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={language === "EN" ? categoriesEN : categoriesID}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleFilterCourse(item)}
              style={{ marginBottom: 20 }}
            >
              <Text style={styles.tab(tabActive, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        /> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={dataCourse}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("course-detail", { id: item?.id })
              }
              style={styles.advanceCourseContent}
            >
              <Image
                style={styles.advanceCourseImage}
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
                <BadgeCourse courseType={item?.course_type} />
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.contentTitleCourse}
              >
                {item.title}
              </Text>
              <Text style={styles.contentLessionCourse}>
                Rp{Number(item.price).toLocaleString("id-ID")}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(image, index) => index.toString()}
        />
      </View>
      {dataCourse?.length === 0 && (
        <Text style={{textAlign:'center', marginTop:5}}>{language === 'EN' ?  "No courses / workshop found" : "Tidak ada kursus / workshop disini" }</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  advanceCourseContainer: {
    marginTop: 15,
    marginBottom: 30,
  },
  advanceCourseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  advanceCourseContent: {
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
  advanceCourseImage: {
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
  tab: (tabActive, item) => {
    return {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderWidth: tabActive !== item ? 1 : 0,
      borderColor: COLORS.gray,
      color: tabActive === item ? "#fff" : COLORS.gray,
      borderRadius: 100,
      marginRight: 15,
      backgroundColor: tabActive === item ? COLORS.main : "#fff",
    };
  },
});
