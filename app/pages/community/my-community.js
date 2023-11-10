import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { getTimeAgoString } from "../../components/utils/helper";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function MyCommunity() {
  const navigation = useNavigation();
  const {
    data: communitys,
    isLoading,
    fetchData: getMyCommunity,
  } = useFetch("/comm/communities", URL_API_COMM);
  const { data: groups, fetchData: getAllCommunity } = useFetch(
    "/comm/getGroups",
    URL_API_COMM
  );

  const handleJoinCommunity = async (id_community) => {
    try {
      await axios.get(`${URL_API_COMM}/comm/join_community/${id_community}`);
      getMyCommunity();
      getAllCommunity();
      Alert.alert("Congrats!", "You recently joined the Community");
    } catch (error) {
      Alert.alert("Failed to join this Community");
      console.log(error);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 30, backgroundColor: COLORS.main }}></View>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>My Community</Text>
        {!isLoading && communitys?.length === 0 && (
          <Text style={{ textAlign: "center" }}>You no have community</Text>
        )}
        {!isLoading &&
          communitys?.map((community) => (
            <View
              key={community?.id}
              style={{ marginTop: 15, flexDirection: "row", gap: 7 }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image
                  style={{ width: 60, height: 60, borderRadius: 5 }}
                  source={require("../../assets/courses/course-2.png")}
                />
                <View>
                  <Text style={{ fontSize: 10, color: COLORS.gray }}>
                    PUBLIC COMMUNITY
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("community-detail", {
                        community_id: community?.id,
                      })
                    }
                  >
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>
                      {community?.group_name}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{ fontSize: 12, color: COLORS.gray, marginTop: 5 }}
                  >
                    {community?.ms_CommGrpMembers?.length} Members
                  </Text>
                </View>
              </View>
            </View>
          ))}

        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 30 }}>
          Orther Community
        </Text>

        {!isLoading &&
          groups?.map(
            (group) =>
              group?.ms_CommGrpMembers?.find((member) => member?.uid !== 2) && (
                <View key={group?.id} style={{ marginTop: 20, gap: 7 }}>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Image
                      style={{ width: 60, height: 60, borderRadius: 5 }}
                      source={require("../../assets/courses/course-2.png")}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 15,
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, color: COLORS.gray }}>
                          PUBLIC COMMUNITY
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("community-detail", {
                              community_id: group?.id,
                            })
                          }
                        >
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ fontSize: 16, fontWeight: 600 }}
                          >
                            {group?.group_name}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.gray,
                            marginTop: 5,
                          }}
                        >
                          {group?.ms_CommGrpMembers?.length} Members
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleJoinCommunity(group?.id)}
                        style={{
                          borderColor: COLORS.main,
                          borderWidth: 1,
                          // paddingVertical: 6,
                          marginTop: 10,
                          borderRadius: 100,
                          height: 30,
                          width: 70,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{ textAlign: "center", color: COLORS.main }}
                        >
                          Join
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
          )}

        {/* <View style={{ paddingVertical: 15 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={["All Jobs", "My Jobs", "Save Jobs"]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setTabActive(item)}
                  style={{ marginBottom: 20 }}
                >
                  <Text style={styles.tab(tabActive, item)}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View> */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
    marginBottom: 30,
  },
  tab: (tabActive, item) => {
    return {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderWidth: tabActive !== item ? 1 : 0,
      borderColor: COLORS.gray,
      color: tabActive === item ? "#fff" : COLORS.gray,
      borderRadius: 100,
      marginRight: 15,
      backgroundColor: tabActive === item ? COLORS.main : "#fff",
    };
  },
});
