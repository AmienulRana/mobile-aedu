import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Linking } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import COLORS from "../../shared/COLORS";
import { useNavigation } from "@react-navigation/native";

function FinishCourse() {
  const navigation = useNavigation();
  const startConfetti = () => {
    // Implement your confetti celebration logic here
  };

  const openCertificateLink = () => {
    // Implement logic to open the certificate link here
    Linking.openURL("/certifiate/12312");
  };

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 30,
        height: 500,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Congratulation For Completion This Course!
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <Text>Get Your Certificate In </Text>
        <TouchableOpacity onPress={openCertificateLink}>
          <Text style={{ color: COLORS.main }}>Here</Text>
        </TouchableOpacity>
      </View>
      {/* Uncomment and implement your confetti button logic */}
      {/* <TouchableOpacity onPress={startConfetti} style={{ marginTop: 10 }}>
        <Text>Celebrate!</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => navigation.navigate("my-course")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "gray" }}>Back To My Course</Text>
      </TouchableOpacity>
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={true}
        fadeOut={true}
      />
    </View>
  );
}

export default FinishCourse;
