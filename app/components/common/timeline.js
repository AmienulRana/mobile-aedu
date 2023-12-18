import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import COLORS from "../shared/COLORS";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function Timeline({ title, subTitle, description, ortherText, date, onPressIcon, onDelete }) {
  return (
    <View style={styles.timelineContainer}>
        <View style={styles.timelineEntry}>
          <View style={styles.timelineBullet} />
          <View style={styles.timelineContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.timelineTitle}>{title}</Text>
              <View style={{flexDirection: 'row', gap: 15, alignItems:'center'}}>
              <TouchableOpacity
                onPress={onPressIcon}
              >
                <FontAwesome5 name="pencil-alt" size={15} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDelete}
              >
                <FontAwesome name="trash" size={20} color={COLORS.red} />
              </TouchableOpacity>
            </View>

              </View>
            {subTitle && (
              <Text style={{ color: COLORS.gray }}>{subTitle}</Text>
            )}
            {date && (
              <Text style={{ color: COLORS.gray }}>{date}</Text>
            )}
            {ortherText && (
              <Text style={{ color: COLORS.gray }}>{ortherText}</Text>
            )}
            {description && (
              <Text style={styles.timelineDescription}>
                {description}
              </Text>
            )}
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    // flex: 1,
    // marginBottom: 16,
  },
  timelineEntry: {
    flexDirection: "row",
    paddingBottom: 10,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.main,
    marginLeft: 10,
  },
  timelineBullet: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.main,
    borderRadius: 8,
    marginTop: -10,
    marginLeft: -8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 8,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timelineDescription: {
    fontSize: 14,
    marginTop: 5,
  },
});
