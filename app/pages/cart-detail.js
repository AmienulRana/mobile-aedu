import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/common/page-header";
import BottomMenuBar from "../components/common/bottom-menu";
import COLORS from "../components/shared/COLORS";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Level from "../components/common/level";
import useFetch, { URL_API } from "../hooks/useFetch";
import axios from "axios";
import RenderHTML from "react-native-render-html";
import moment from "moment/moment";
import Counter from "../components/common/counter";
import { useNavigation, useRoute } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";

export default function CartDetail() {
  const router = useRoute();
  const navigation = useNavigation();
  const { data, fetchData } = useFetch(`/get_xendVA/${router.params?.id}`);
  const copyToClipboard = (text) => {
    Clipboard?.setString?.("test hello");
    // Alert.alert(`Successfully copy to clipboard, ${text}`);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View
          style={{
            backgroundColor: "white",
            marginTop: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity>
                {data?.bank_code === "BCA" ? (
                  <Image
                    source={require("../assets/atm-bca.png")}
                    style={{ width: 100, height: 100 }}
                  />
                ) : (
                  <Image
                    source={require("../assets/atm-mandiri.png")}
                    style={{ width: 70, height: 30 }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              <Text style={{ fontSize: 14, marginLeft: 5, width: 100 }}>
                {data?.bank_code}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 12 }}>
                Pay before :{" "}
                {moment(new Date(data?.expiration_date)).format(
                  "DD/MM/YY HH:mm"
                )}{" "}
              </Text>
              {/* <Countdown
            date={new Date(data.expiration_date || '')}
            onComplete={() => navigation.push('/')} // Replace with your navigation logic
            renderer={({ minutes, hours, seconds }) => (
              <CountdownRender
                minutes={minutes}
                hours={hours}
                seconds={seconds}
                withDays={false}
              />
            )}
          /> */}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 15,
              marginTop: 2,
              marginBottom: 15,
            }}
          >
            <View>
              <Text style={{ fontSize: 14, color: "gray" }}>
                Virtual Account
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {data?.account_number}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                color: "gray",
              }}
              onPress={() => copyToClipboard(data?.account_number || "")}
            >
              <Text style={{ fontSize: 14, marginRight: 5 }}>Copy</Text>
              {/* {!isCopied ? (
            <Image source={require('copy-icon.png')} style={{ width: 24, height: 24 }} />
          ) : (
            <Image source={require('check-icon.png')} style={{ width: 24, height: 24 }} />
          )} */}
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 14, color: "gray" }}>
                Total Transfer
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Rp{data?.expected_amount?.toLocaleString("id-ID")}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                color: "gray",
              }}
              onPress={() =>
                copyToClipboard(data?.expected_amount.toString() || "")
              }
            >
              <Text style={{ fontSize: 14, marginRight: 5 }}>Copy</Text>
              {/* {!isCopied ? (
            <Image source={require('copy-icon.png')} style={{ width: 24, height: 24 }} />
          ) : (
            <Image source={require('check-icon.png')} style={{ width: 24, height: 24 }} />
          )} */}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontWeight: "700", marginTop: 25, marginBottom: 10 }}>
          Product Detail :
        </Text>

        {data?.details?.map((product) => (
          <View
            key={product?.id}
            style={{
              flexDirection: "row",
              gap: 20,
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "gray",
            }}
          >
            <Image
              source={require("../assets/courses/course-1.png")} // Ganti dengan path gambar yang sesuai
              style={{
                width: 50,
                height: 50,
                borderRadius: 5,
                borderWidth: 1,
              }}
            />
            <View>
              <Text style={{ fontSize: 14 }}>
                {product?.ms_EnterpriseCourse?.title} ({product?.qty || "1"})
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: COLORS.main }}
              >
                Rp {Number(product?.single_price).toLocaleString("id-ID")}
              </Text>
              {/* <Text style={{ fontSize: 14, color: "gray" }}>
                To: {product?.deliver_to}, JNE ({product?.ongkir_type})
              </Text>
              <Text style={{ fontSize: 14, color: "gray", marginTop: 2 }}>
                Ongkir: Rp{" "}
                {Number(product?.deliver_fee || 0).toLocaleString("id-ID")}
              </Text> */}
            </View>
          </View>
        ))}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
            marginTop: 25,
          }}
        >
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>
            Rp {Number(data?.expected_amount || 0).toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={styles.label}>Delivery cost</Text>
          <Text style={styles.value}>
            Rp{" "}
            {Number(
              data?.details?.reduce(
                (total, data) => total + (data?.deliver_fee || 0),
                0
              ) || 0
            )?.toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={styles.label}>Total Transfer</Text>
          <Text style={styles.value}>
            Rp
            {Number(
              data?.expected_amount +
                data?.details?.reduce(
                  (total, data) => total + (data?.deliver_fee || 0),
                  0
                )
            ).toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.main,
            padding: 10,
            borderRadius: 5,
            marginTop: 15,
          }}
          onPress={() => navigation.navigate("my-course")}
        >
          <Text
            style={{ fontWeight: "bold", color: "white", textAlign: "center" }}
          >
            Ok
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomMenuBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
});
