import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import RenderHTML from "react-native-render-html";
import COLORS from "../../shared/COLORS";

export default function DescriptionCourse({ data }) {
  const { width } = useWindowDimensions();

  return (
    <View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {data?.course?.title}
        </Text>
        <Text style={{ color: COLORS.gray }}>
          By {data?.course?.ms_User?.ms_EnterpriseProfile?.business_name}
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
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
          About Course
        </Text>
        <View style={{ color: COLORS.gray, marginTop: 10 }}>
          <RenderHTML
            source={{ html: data?.course?.description }}
            contentWidth={width}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
