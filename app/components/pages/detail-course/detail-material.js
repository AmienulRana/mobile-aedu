import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { CourseInformation } from "./information-detail";

export default function DetailMaterial({ data }) {
  return (
    <>
      <CourseInformation
        Icon={<FontAwesome5 name="weight" size={20} color="black" />}
        label="Weight"
        value={data?.course?.weight}
      />
      <CourseInformation
        Icon={<FontAwesome5 name="truck" size={18} color="black" />}
        label="Weight"
        value={"Jakarta Timur"}
      />
    </>
  );
}

const styles = StyleSheet.create({});
