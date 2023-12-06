import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageHeader from "../components/common/page-header";
import BottomMenuBar from "../components/common/bottom-menu";
import COLORS from "../components/shared/COLORS";
import { FontAwesome5 } from "@expo/vector-icons";
import useFetch, { URL_API } from "../hooks/useFetch";
import axios from "axios";
import Counter from "../components/common/counter";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLanguageContext } from "../context/LanguageContext";

export default function MyCart() {
  const { data, fetchData } = useFetch("/get_cart");

  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigation = useNavigation();
  const router = useRoute();
  const { language } = useLanguageContext();

  const paymentMethods = [
    {
      title: "Mandiri",
      key: "MANDIRI",
      image: require(`../assets/atm-mandiri.png`),
    },
    { title: "BCA", key: "BCA", image: require(`../assets/atm-bca.png`) },
  ];

  const selectPaymentMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleActionQty = async (materialId, option) => {
    try {
      await axios.get(`${URL_API}/update_qty/${materialId}/${option}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayCourse = async () => {
    try {
      if (!selectedMethod) {
        return Alert.alert("Plase Selecet Virtual Account");
      }
      const response = await axios.get(`${URL_API}/pay?bank=${selectedMethod}`);
      if (response?.status === 200) {
        navigation.navigate("cart-detail", { id: response?.data?.pid });
      }
    } catch (error) {
      navigation.navigate("cart-detail", {
        id: "4cff9539-8f75-41b0-970e-346afba0c90f",
      });
      Alert.alert("Failed generate virtual account");
    }
  };

  const returnTypeService = (type) => {
    if (type === "REG" || type === "CTC") {
      return "Regular";
    } else if (type === "OKE") {
      return "Ekonomis";
    }
    return "Next Day";
  };

  useEffect(() => {
    if (router.params?.refresh_page) {
      fetchData();
    }
  }, [router]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 35,
          }}
        >
          {language === "EN" ? "My Cart" : "Keranjang Saya"} (
          {data?.data?.length || 0})
        </Text>
        {data?.data?.map((cart) => (
          <View
            key={cart?.id}
            style={{ flexDirection: "row", gap: 15, marginBottom: 20 }}
          >
            <Image
              source={{ uri: cart?.ms_EnterpriseCourse?.thumbnail }}
              style={{ width: 50, height: 50, borderRadius: 5 }}
            />
            <View>
              <Text ellipsizeMode="clip" numberOfLines={2} style={{ fontWeight: "700", flex: 1 }}>
                {cart?.ms_EnterpriseCourse?.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.gray,
                  marginTop: 2,
                  marginBottom: 5,
                }}
              >
                {language === "EN" ? "By" : "Dibuat Oleh"}{" "}
                {cart?.ms_EnterpriseCourse?.ms_User?.ms_EnterpriseProfile
                  ?.business_name || "AEDU"}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={{ fontWeight: "700" }}>
                  Rp{Number(cart?.ms_EnterpriseCourse?.price).toLocaleString()}
                </Text>
                {cart?.ms_EnterpriseCourse?.course_type === "Book" && (
                  <Counter
                    qty={cart?.qty}
                    addFunction={() => handleActionQty(cart?.id, "add")}
                    decFunction={() => handleActionQty(cart?.id, "dec")}
                  />
                )}
              </View>
              {cart?.ms_EnterpriseCourse?.course_type === "Book" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {language === "EN" ? "From" : "Dari"}
                    </Text>
                    <FontAwesome5 name="truck" size={14} color="black" />
                    <Text style={{ fontSize: 12 }}>
                      :{" "}
                      {
                        cart?.ms_EnterpriseCourse?.ms_User?.ms_EnterpriseProfile
                          ?.ms_City?.name
                      }
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 5,
                    }}
                    onPress={() =>
                      navigation.navigate("cart-address", {
                        material_id: cart?.id,
                      })
                    }
                  >
                    <Text style={{ fontSize: 12 }}>
                      {language === "EN" ? "To" : "Ke"}{" "}
                    </Text>
                    <FontAwesome5 name="house-user" size={14} color="black" />
                    <Text style={{ fontSize: 12 }}>
                      :{" "}
                      {cart?.deliver_to ||
                        (language === "EN"
                          ? "Input Your Address"
                          : "Masukkan Alamat Anda")}{" "}
                      {cart?.ongkir_type &&
                        `(${returnTypeService(cart?.ongkir_type)})`}{" "}
                      {cart?.ongkir_fee &&
                        `Rp${Number(cart?.ongkir_fee || 0)?.toLocaleString(
                          "id-ID"
                        )}`}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}

        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {language === "EN" ? "Payment Method" : "Metode Pembayaran"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Virtual Account :
        </Text>

        <View>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.methodContainer,
                selectedMethod === method.key && styles.selectedMethod,
              ]}
              onPress={() => selectPaymentMethod(method.key)}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image source={method.image} />
                <Text
                  style={{
                    color: selectedMethod === method.key ? "white" : "black",
                  }}
                >
                  {method.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {language === "EN" ? "Payment Details" : "Detail Pembayaran"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={styles.label}>
            <Text>{language === "EN" ? "Price" : "Harga"}</Text>
          </Text>
          <Text style={styles.value}>
            Rp {Number(data?.total || 0).toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={styles.label}>
            <Text>{language === "EN" ? "Delivery cost" : "Biaya ongkir"}</Text>
          </Text>
          <Text style={styles.value}>
            Rp{" "}
            {Number(
              data?.data?.reduce(
                (total, data) => total + (data?.ongkir_fee || 0),
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
              data?.total +
                data?.data?.reduce(
                  (total, data) => total + (data?.ongkir_fee || 0),
                  0
                )
            ).toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.buttonPay} onPress={handlePayCourse}>
          <Text style={{ color: "#fff", textAlign: "center" }}>
            <Text>{language === "EN" ? "Pay Now" : "Bayar Sekarang"}</Text>
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
  methodContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 8,
    borderRadius: 5,
  },
  selectedMethod: {
    backgroundColor: COLORS.main, // Warna latar belakang saat dipilih
  },
  label: {
    color: COLORS.gray,
  },
  buttonPay: {
    padding: 10,
    backgroundColor: COLORS.main,
    borderRadius: 5,
    marginTop: 20,
  },
});
