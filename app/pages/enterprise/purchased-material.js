import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
  Button,
  Alert,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/page-header";
import { useNavigation, useRoute } from "@react-navigation/native";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import BottomMenuBar from "../../components/common/bottom-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomMenuEnterprise from "../../components/common/bottom-menu-enterprise";
import COLORS from "../../components/shared/COLORS";
import moment from "moment/moment";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PageHeaderCommunity from "../../components/common/page-header-community";
import axios from "axios";

export default function PurchasedMaterialEnterprise() {
  const navigation = useNavigation();
  const router = useRoute();
  const [showModal, setShowModal] = useState(false);
  const [resiNumber, setResiNumber] = useState("");
  const [orderId, setOrderId] = useState("");

  const { data, fetchData } = useFetch(
    `/enter/purchase_list/${router?.params?.learning_id}`,
    URL_API_ENTER
  );

  const handleSendResi = async () => {
    try {
      const response = await axios.post(
        `${URL_API_ENTER}/enter/add_resi/${orderId}`,
        { resi: resiNumber }
      );
      setResiNumber("");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to add resi");
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontWeight: 800, fontSize: 18 }}>
            Order List ({data?.payments?.length})
          </Text>
          <View style={styles.table}>
            {data?.payments?.map((rowData, index) => (
              <View style={styles.card} key={index}>
                <View
                  style={{
                    paddingBottom: 5,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderColor: "rgba(0,0,0,0.4)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Entypo name="book" size={24} color={COLORS.main} />
                    <View>
                      <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
                        Material
                      </Text>
                      <Text style={{ fontSize: 12, color: COLORS.gray }}>
                        {moment(rowData?.createdAt).format("DD MMM YYYY")}
                      </Text>
                    </View>
                  </View>
                  {!rowData?.resi && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff2b3",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginTop: 2,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: "#da975a", fontWeight: 700 }}>
                        Pending Shipping
                      </Text>
                    </TouchableOpacity>
                  )}
                  {rowData?.resi && !rowData?.est && (
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#bbf7d0",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ color: "#22c55e", fontSize: 12 }}>
                          {"Orders Processed"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {rowData?.resi &&
                    moment().diff(moment(rowData?.est), "days") < 1 && (
                      <View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#bbf7d0",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            marginTop: 2,
                            borderRadius: 5,
                          }}
                        >
                          <Text style={{ color: "#22c55e", fontSize: 12 }}>
                            Delivered
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  {rowData?.est &&
                    moment().diff(moment(rowData?.est), "days") > 1 && (
                      <View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#bbf7d0",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            marginTop: 2,
                            borderRadius: 5,
                          }}
                        >
                          <Text style={{ color: "#22c55e", fontSize: 12 }}>
                            Finish
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>

                <Text style={styles.cardText}>
                  Material Name :{" "}
                  <Text style={{ fontWeight: 900 }}>
                    {rowData?.ms_EnterpriseCourse?.title}
                  </Text>
                </Text>
                <Text style={styles.cardText}>
                  Quantity :{" "}
                  <Text style={{ fontWeight: 900 }}>{rowData.qty}</Text>
                </Text>
                <Text style={styles.cardText}>
                  Destination Address :{" "}
                  <Text style={{ fontWeight: 900 }}>{rowData.deliver_to}</Text>
                </Text>

                <Text style={{ marginVertical: 10, textAlign: "center" }}>
                  Nomor Resi
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                    setOrderId(rowData?.id);
                  }}
                  style={[
                    styles.cardFooter,
                    { borderWidth: 1, borderColor: "rgba(0,0,0,0.2" },
                  ]}
                >
                  <Text style={styles.cardText}>{rowData?.resi}</Text>
                  <FontAwesome size={18} color={COLORS.main} name="pencil" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardButton}>
                  <Ionicons
                    name="print"
                    size={18}
                    color="white"
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardButtonText}>Cetak label</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <Modal
          onRequestClose={() => setShowModal(false)}
          visible={showModal}
          animationType="slide"
          style={{ height: 300 }}
          transparent
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                backgroundColor: "white",
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Resi Number
              </Text>
              <TextInput
                value={resiNumber}
                onChangeText={(text) => setResiNumber(text)}
                placeholder="Paste resi number here!"
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  width: 300,
                  padding: 5,
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity
                style={[styles.cardButton, { width: 200 }]}
                onPress={handleSendResi}
              >
                <Text style={{ color: "white" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomMenuEnterprise />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
  },
  table: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardButton: {
    backgroundColor: COLORS.main,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    justifyContent: "center",
  },
  cardIcon: {
    marginRight: 5,
  },
  cardButtonText: {
    color: "white",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
});
