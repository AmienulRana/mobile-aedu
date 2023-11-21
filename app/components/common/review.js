// components/Review.js

import React, { useState } from "react";
import { View, Text } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons"; // Ganti dengan ikon yang sesuai di React Native
import COLORS from "../shared/COLORS";
import { useLanguageContext } from "../../context/LanguageContext";

const ReviewItem = ({ isFilled, onClick }) => {
  return (
    <AntDesign
      name={isFilled ? "star" : "staro"}
      onPress={onClick}
      size={24}
      color={isFilled ? COLORS.orange : "gray"}
    />
  );
};

const descReviewEN = [
  "Very Poor",
  "Not Recommended",
  "Fair",
  "Good",
  "Excellent",
];
const descReviewID = [
  "Sangat Buruk",
  "Tidak Direkomendasikan",
  "Lumayan",
  "Bagus",
  "Sangat Bagus",
];

const Review = ({ totalStars, setTotalStars }) => {
  const [selectedStars, setSelectedStars] = useState(null);
  const { language } = useLanguageContext();

  const handleStarClick = (starIndex) => {
    setSelectedStars(starIndex);
    setTotalStars(starIndex);
  };

  return (
    <View style={{ position: "relative", marginVertical: 15 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: totalStars }, (_, index) => (
          <ReviewItem
            onClick={() => handleStarClick(index)}
            key={index}
            isFilled={selectedStars !== null && index <= selectedStars}
          />
        ))}
      </View>
      <Text style={{ position: "absolute", fontSize: 12, top: -20, right: 0 }}>
        {typeof selectedStars === "number" &&
          (language === "EN"
            ? descReviewEN[selectedStars]
            : descReviewID[selectedStars])}
      </Text>
    </View>
  );
};

export default Review;
