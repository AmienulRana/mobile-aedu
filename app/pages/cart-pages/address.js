import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import BottomMenuBar from "../../components/common/bottom-menu";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API } from "../../hooks/useFetch";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

export default function MyCart() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shippingOption, setShippingOption] = useState([]);
  const [shippingSelected, setShippingSelected] = useState("");
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    detail_address: "",
    saveAsDefault: false,
  });

  const router = useRoute();
  const { data: province } = useFetch("/ro_provinces");
  const { data: city, fetchData: fetchCity } = useFetch(
    `/ro_cities/${formData?.province}`
  );
  const navigation = useNavigation();

  const handleAddressSubmit = async () => {
    if (!formData?.detail_address || !shippingSelected) {
      return Alert.alert("Please input detail address and Shipping type");
    }

    const detailCity = city?.find((city) => city?.city_id == formData?.city);

    try {
      const filterDeliver = shippingOption?.[0]?.costs?.filter(
        (cost) => cost?.service === shippingSelected
      );
      const payload = {
        deliver_data: {
          ...filterDeliver?.[0],
          origin_details: {
            city_id: "154",
            province_id: "6",
            province: "DKI Jakarta",
            type: "Kota",
            city_name: "Jakarta Timur",
            postal_code: "13330",
          },
          destination_details: detailCity,
          tujuan: formData?.detail_address,
        },
      };
      const response = await axios.post(
        `${URL_API}/set_ongkir/${router.params?.material_id}`,
        payload
      );
      if (response.status === 200) {
        navigation.navigate("cart", { refresh_page: true });
      }
      setFormData({});
      setShippingOption([]);
    } catch (error) {
      Alert.alert("Failed to save address");
      console.log(error);
    }
  };

  const handleCheckOngkir = async () => {
    try {
      const response = await axios.post(
        `${URL_API}/ongkir_ui/${router.params?.material_id}`,
        {
          user_cid: formData.city,
        }
      );
      setShippingOption(response?.data?.ongkos?.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCity();
  }, [formData.province]);

  useEffect(() => {
    handleCheckOngkir();
  }, [formData.city]);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeader />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
            marginTop: 30,
          }}
        >
          Province :
        </Text>
        <View style={{ borderWidth: 1, borderColor: "gray", marginBottom: 20 }}>
          <RNPickerSelect
            placeholder="text"
            value={formData?.province}
            onValueChange={(value) =>
              setFormData({ ...formData, city: "", province: value })
            }
            items={province?.map((province) => ({
              label: province?.name,
              value: province?.ro_code,
            }))}
          />
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          City :
        </Text>
        <View style={{ borderWidth: 1, borderColor: "gray", marginBottom: 20 }}>
          <RNPickerSelect
            placeholder="text"
            value={formData?.city}
            useNativeAndroidPickerStyle
            onValueChange={(value) => setFormData({ ...formData, city: value })}
            items={city?.map((city) => ({
              label: city?.city_name,
              value: city?.city_id,
            }))}
            disabled={city?.length === 0}
          />
        </View>
        <View style={{ marginTop: -3 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Detail Address :
          </Text>
          <TextInput
            placeholder="Input your detail address"
            onChangeText={(value) =>
              setFormData({ ...formData, detail_address: value })
            }
            value={formData.detail_address}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              padding: 8,
              marginTop: 8,
            }}
          />
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 25,
            marginBottom: 10,
          }}
        >
          Choose Shipping (JNE)
        </Text>

        {formData?.province && formData?.city && (
          <View
            style={{
              marginTop: 8,
              gap: 10,
            }}
          >
            {shippingOption?.[0]?.costs?.map((costData) => (
              <TouchableOpacity
                onPress={() => setShippingSelected(costData?.service)}
                key={costData?.service}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLORS.main,
                  backgroundColor:
                    shippingSelected === costData?.service
                      ? COLORS.main
                      : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color:
                      shippingSelected === costData?.service
                        ? "white"
                        : COLORS.main,
                  }}
                >
                  {costData?.service === "REG" || costData?.service === "CTC"
                    ? "Regular"
                    : costData?.service === "OKE"
                    ? "Ekonomis"
                    : "Next Day"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                    color:
                      shippingSelected === costData?.service
                        ? "white"
                        : "black",
                  }}
                >
                  Rp {costData?.cost[0]?.value?.toLocaleString("id-ID")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    color:
                      shippingSelected === costData?.service
                        ? "white"
                        : "black",
                  }}
                >
                  Estimate {costData?.cost[0]?.etd?.replace("-", " Sampai ")}{" "}
                  Hari
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginTop: 16,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 5,
              alignSelf: "flex-end",
              width: 100,
              marginBottom: 20,
              borderColor: COLORS.main,
              borderWidth: 1,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{ color: COLORS.main, fontSize: 14, textAlign: "center" }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => }
            style={{
              backgroundColor: COLORS.main,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 5,
              alignSelf: "flex-end",
              width: 100,
              marginBottom: 20,
            }}
            onPress={handleAddressSubmit}
          >
            <Text style={{ color: "white", fontSize: 14, textAlign: "center" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
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

  label: {
    color: COLORS.gray,
  },
});
