import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BadgeCourse = ({ courseType, size = "sm" | "md" }) => {
  let badgeText;
  let badgeStyle;

  if (courseType === "Subscription") {
    badgeText = "Pro";
    badgeStyle = styles.subscriptionBadge;
  } else if (courseType === "Premium") {
    badgeText = "Premium";
    badgeStyle = styles.premiumBadge;
  } else if (courseType === "Book") {
    badgeText = "Materials";
    badgeStyle = styles.bookBadge;
  } else {
    badgeText = "Free";
    badgeStyle = styles.freeBadge;
  }
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      <View style={[badgeStyle, styles.badgeWrapper, styles[size]]}>
        {courseType == "Subscription" && (
          <MaterialCommunityIcons
            name="check-decagram"
            size={16}
            color="white"
          />
        )}
        <Text style={styles.badgeText(courseType)}>{badgeText}</Text>
      </View>
    </View>
  );
};

export default BadgeCourse;

const styles = StyleSheet.create({
  subscriptionBadge: {
    backgroundColor: "#2e25ad",
  },
  premiumBadge: {
    backgroundColor: "rgba(255, 183, 76, 0.1)",
  },
  bookBadge: {
    backgroundColor: "rgba(255, 183, 76, 0.1)",
  },
  freeBadge: {
    backgroundColor: "rgba(0, 128, 0, 0.1)",
  },
  badgeWrapper: {
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 5,
    width: 80,
    maxWidth: 150,
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: (courseType) => {
    return {
      fontWeight: "bold",
      fontSize: 12,
      color: courseType === "Subscription" ? "white" : "#d97706",
    };
  },
  md: {},
  sm: {},
});
