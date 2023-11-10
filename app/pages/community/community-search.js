import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect } from "react";
import PageHeader from "../../components/common/page-header";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import BottomMenuBarCommunity from "../../components/common/bottom-menu-community";
import { Avatar } from "./home";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PageHeaderCommunity from "../../components/common/page-header-community";

export default function CommunitySearch() {
  const router = useRoute();
  const navigation = useNavigation();

  const { data: results, fetchData } = useFetch(
    `/comm/search/${router.params?.content}`,
    URL_API_COMM
  );
  useEffect(() => {
    fetchData();
    console.log(router.params);
  }, [router]);
  return (
    <>
      <StatusBar style={{ backgroundColor: "white" }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={{ marginTop: 30 }}></View>
        <Text style={{ fontSize: 16, fontWeight: 800 }}>Result Search</Text>
        <Text style={{ marginBottom: 15, marginTop: 5 }}>
          {results?.enterpriseUsers_count + results?.users_count} results for{" "}
          <Text style={{ fontWeight: "bold" }}>{router.params?.content}</Text>
        </Text>

        <View style={{ backgroundColor: "white", marginTop: 8, padding: 5 }}>
          {results?.users?.length > 0 && (
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              People
            </Text>
          )}
          {results?.users?.map((user, i) => (
            <View
              key={user?.id}
              style={{
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 40,
                }}
                onPress={() =>
                  navigation.navigate("community-profile-detail", {
                    user_id: user?.user_ref,
                  })
                }
              >
                <Avatar name={`${user?.first_name} ${user?.last_name}`} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14, color: COLORS.gray }}>
                    {user?.tagline || user?.role}
                  </Text>
                  {user?.location && (
                    <Text style={{ fontSize: 14, color: COLORS.gray }}>
                      {user?.location}, Indonesia
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Ionicons
                      name="md-globe-sharp"
                      size={14}
                      color={COLORS.gray}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        marginLeft: 5,
                        color: COLORS.gray,
                      }}
                    >
                      2 same community (React.js Developer and Next.js Dev)
                    </Text>
                  </View>
                </View>
                {/* <TouchableOpacity
              onPress={() => handleNavigateToMessages(user?.first_name, user?.last_name, user?.ms_User?.id)}
              style={{ position: 'absolute', top: '50%', right: 10, transform: [{ translateY: -50 }] }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                
                <TbMail size={24} />
                <Text style={{ fontSize: 16, color: COLORS.gray, marginLeft: 5 }}>
                  {TYPHOGRAPHY[language].NAVBAR.MESSAGES}
                </Text>
              </View>
            </TouchableOpacity> */}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomMenuBarCommunity />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
});
