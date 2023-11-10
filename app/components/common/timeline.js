import { StyleSheet, Text, View } from "react-native";
import React from "react";
import COLORS from "../shared/COLORS";

export default function Timeline({ data }) {
  return (
    <View style={styles.timelineContainer}>
      {data?.map((entry, index) => (
        <View key={index} style={styles.timelineEntry}>
          <View style={styles.timelineBullet} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>{entry.title}</Text>
            {entry?.subTitle && (
              <Text style={{ color: COLORS.gray }}>{entry.subTitle}</Text>
            )}
            {entry?.date && (
              <Text style={{ color: COLORS.gray }}>{entry.date}</Text>
            )}
            {entry?.ortherText && (
              <Text style={{ color: COLORS.gray }}>{entry.ortherText}</Text>
            )}
            {entry?.description && (
              <Text style={styles.timelineDescription}>
                {entry.description}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    flex: 1,
    marginBottom: 16,
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
