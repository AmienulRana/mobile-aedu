import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import COLORS from "../../shared/COLORS";

export default function AdsCard({ post }) {
  const [seeMore, setSeeMore] = useState(false);

  return (
    <View
      style={{
        paddingBottom: 5,
        borderBottomWidth: 1,
        backgroundColor: "white",
        paddingHorizontal: 3,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Image
          source={require("../../../assets/courses/course-2.png")}
          style={{ width: 50, height: 40, borderRadius: 5 }}
        />
        <View>
          <View style={{ marginTop: 1 }}>
            <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
              {post?.ms_User?.ms_EnterpriseProfile?.business_name ||
                "Business Name"}
            </Text>
            <Text style={{ color: "gray", fontSize: 12 }}>Promoted</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 3 }}>
        {post?.primary_text}
        <TouchableOpacity onPress={() => setSeeMore(!seeMore)}>
          <Text style={{ color: "gray" }}>{!seeMore ? "...see more" : ""}</Text>
        </TouchableOpacity>
      </Text>
      {seeMore && (
        <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 3 }}>
          {post?.ad_desc}
          <TouchableOpacity onPress={() => setSeeMore(!seeMore)}>
            <Text style={{ color: "gray" }}>{seeMore ? "...close" : ""}</Text>
          </TouchableOpacity>
        </Text>
      )}
      <View style={{ width: "100%", marginTop: 4 }}>
        <Image
          source={require("../../../assets/courses/course-2.png")}
          style={{ width: "100%", height: 250 }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 14 }} numberOfLines={2}>
          {post?.headline}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(post?.web_url)}>
          <Text style={{ color: COLORS.main, fontWeight: "bold" }}>
            {post?.call_to_action}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
