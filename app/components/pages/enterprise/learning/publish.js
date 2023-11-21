import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"; // Sesuaikan dengan library ikon yang digunakan
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../../shared/COLORS";

const PublishCourse = ({ publishes }) => {
  const navigation = useNavigation();
  return (
    <>
      {publishes?.map((publish, i) => (
        <View
          key={i}
          style={{
            borderColor: COLORS.gray,
            borderWidth: 1,
            marginBottom: 20,
            flexDirection: "row",
          }}
        >
          <View style={{ position: "absolute", right: 4, top: 0 }}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="red"
            />
          </View>

          <Image
            source={{ uri: publish?.tl }}
            style={{ width: 60, height: 60, resizeMode: "cover" }}
          />
          <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  // Handle navigation to the course link here
                }}
                style={{ fontWeight: "bold", textDecorationLine: "underline" }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}
                >
                  {publish?.title}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    Liked: {publish?.tmp_Wishlists?.length}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    Impression : {publish?.tmp_Recentviewedcourses?.length}
                  </Text>
                </View>
                {publish?.learning_method === "Online" ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(
                        publish?.course_type === "Book"
                          ? "enterprise-purchased-material"
                          : "enterprise-purchased",
                        { learning_id: publish?.id }
                      );
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      Purchased : {publish?.ms_Payments?.length}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(
                        publish?.course_type === "Book"
                          ? "enterprise-purchased-material"
                          : "enterprise-purchased",
                        { learning_id: publish?.id }
                      );
                    }}
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    <Text
                      style={{ fontSize: 12, textDecorationLine: "underline" }}
                    >
                      {" "}
                      Purchased : {publish?.ms_Payments?.length}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text
                style={{ fontSize: 12, marginBottom: 1, fontWeight: "bold" }}
              >
                Type:{" "}
                {publish?.course_type === "Book"
                  ? "Learning Material"
                  : publish?.course_type}{" "}
                {publish?.course_type !== "Book" &&
                  `(${publish?.learning_method})`}
              </Text>
              {publish?.course_type === "Premium" && (
                <>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    Status: {publish?.status || "Close"}
                  </Text>
                  {publish?.learning_method === "Offline" && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("enterprise-purchased", {
                          learning_id: publish?.id,
                        });
                      }}
                    >
                      <Text>
                        See Participant ({publish?.ms_Payments?.length})
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              {publish?.course_type === "Subscription" && (
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  Status:{" "}
                  {publish?.learning_method === "Online"
                    ? "Open"
                    : publish?.status}
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {publish?.course_type === "Book" && (
                  <>
                    {publish?.ms_Payments?.filter(
                      (payment) => payment?.status === "Paid"
                    )?.length > 0 ? (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "lightcoral",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="clock-time-three"
                          size={20}
                          color="darkorange"
                        />
                        <Text>Pending Shipping</Text>
                      </TouchableOpacity>
                    ) : (
                      publish?.ms_Payments?.length > 0 && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#bbf7d0",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            marginTop: 2,
                            borderRadius: 5,
                          }}
                        >
                          <Text style={{ color: "#22c55e", fontSize: 12 }}>
                            Orders Processed
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default PublishCourse;
