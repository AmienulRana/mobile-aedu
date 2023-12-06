import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../../../hooks/useFetch";
import { useLanguageContext } from "../../../context/LanguageContext";

const images = [
  require("../../../assets/courses/course-1.png"),
  require("../../../assets/courses/course-2.png"),
  require("../../../assets/courses/course-3.png"),
];

export default function ContinueLearn() {
  const navigation = useNavigation();
  const { data: continueLearning } = useFetch("/lp");
  const { language } = useLanguageContext();

  return (
    continueLearning?.length > 0 && (
      <View style={styles.continueLearnContainer}>
        <Text style={styles.continueLearnTitle}>
          {language === 'EN' ? 'Continue Learning' : 'Lanjut belajar'} 
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={continueLearning}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("course-detail", {
                  id: item?.ms_EnterpriseCourse?.id,
                })
              }
            >
              <Image
                style={styles.continueLearnImage}
                source={{ uri: item?.ms_EnterpriseCourse?.thumbnail }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
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
    marginRight: 15,
  },
});
