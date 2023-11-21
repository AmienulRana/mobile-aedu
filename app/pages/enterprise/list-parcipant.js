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
  StatusBar,
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

export default function ListParticipantEnterprise() {
  const navigation = useNavigation();
  const router = useRoute();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [userToCheckin, setUserToCheckin] = useState({});

  const [score, setScore] = useState(0);
  const [scoreOf, setScoreOf] = useState(0);

  const { data, fetchData } = useFetch(
    `/enter/pl/${router?.params?.learning_id}`,
    URL_API_ENTER
  );

  const handleSendResi = async () => {
    try {
      const response = await axios.post(
        `${URL_API_ENTER}/enter/add_resi/${orderId}`,
        { resi: message }
      );
      setMessage("");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to add resi");
    }
  };

  const handleMessageUsers = async () => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/remind_students/${router.params?.learning_id}`
      );
      Alert.alert("Successfully send message!");
      setShowModal("");
      setMessage("");
    } catch (error) {
      Alert.alert("Failed send message!");
      console.log(error);
    }
  };
  const handleCompleteCourse = async () => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/finish_course/${router?.params?.learning_id}`
      );
      if (response.status === 200) {
        Alert.alert("Successfully Complete this course");
        navigation.push("enterprise-learning");
        setShowModal("");
      }
    } catch (error) {
      Alert.alert("Failed Complete this course");
      console.log(error);
    }
  };

  const showAlertCompleteCourse = () => {
    Alert.alert(
      "Are you sure to end this course?",
      `Complete user ${
        data?.pl?.filter((user) => user.status === "Success")?.length
      } From ${
        data?.pl?.length
      }\n\nUsers who have not completed will not get any credentials or certificates from AEDU+`,
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes, Sure",
          onPress: () => handleCompleteCourse(),
        },
      ]
    );
  };

  const handleCreateScore = async () => {
    try {
      const response = await axios.post(`${URL_API_ENTER}/enter/input_score`, {
        course_id: router?.params?.learning_id,
        users: orderId,
        nilai: score,
        score_outof: scoreOf,
      });
      if (response.status === 200) {
        setShowModal("");
        fetchData();
        Alert.alert("Succesfully sent score to users!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Failed sent score to users!");
    }
  };

  const handlePresent = async () => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/presence_record/${userToCheckin?.id}`
      );
      fetchData();
      Alert.alert("This users successfully check-in");
      setShowModal("");
    } catch (error) {
      Alert.alert("Error Check-in", "This user already check-in");
      console.log(error);
    }
  };

  const handleSendCertificate = async (dataUser) => {
    try {
      const response = await axios.get(
        `${URL_API_ENTER}/enter/complete_and_cert/${router?.params?.learning_id}/${dataUser?.uid}`
      );
      if (response.status === 200) {
        Alert.alert(
          "Congratulations!",
          `${rowData?.ms_User?.ms_Profile?.prof_name} has completed this course`
        );
      }
    } catch (error) {
      Alert.alert("Error!", `Opps! failed to completed this user`);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PageHeaderCommunity />
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: 800, fontSize: 18 }}>
              List Paticipants ({data?.pl?.length})
            </Text>
            <TouchableOpacity
              onPress={showAlertCompleteCourse}
              style={[styles.cardButton, { background: COLORS.orange }]}
            >
              <Text style={styles.cardButtonText}>End Course</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            {data?.pl?.map((rowData, index) => (
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
                        Course
                      </Text>
                      {/* <Text style={{ fontSize: 12, color: COLORS.gray }}>
                        {moment(rowData?.createdAt).format("DD MMM YYYY")}
                      </Text> */}
                    </View>
                  </View>
                  {rowData?.status === "Pending" ? (
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
                        {rowData?.status}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            rowData?.status == "Trial"
                              ? "#ef444417"
                              : "#bbf7d0",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              rowData?.status === "Trial"
                                ? "#ef4444"
                                : "#22c55e",
                            fontSize: 12,
                          }}
                        >
                          {rowData?.status === "Success"
                            ? "Complete"
                            : rowData?.status}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <Text style={styles.cardText}>
                  Course Name :{" "}
                  <Text style={{ fontWeight: 900 }}>
                    {rowData?.ms_EnterpriseCourse?.title}
                  </Text>
                </Text>
                <Text style={styles.cardText}>
                  Name :{" "}
                  <Text style={{ fontWeight: 900 }}>
                    {rowData?.ms_User?.ms_Profile?.prof_name}
                  </Text>
                </Text>
                <Text style={styles.cardText}>
                  Score :{" "}
                  <Text style={{ fontWeight: 900 }}>
                    {rowData?.ms_User?.tmp_RowCalls?.[0]?.score || 0} /{" "}
                    {rowData?.ms_User?.tmp_RowCalls?.[0]?.score_outof || 0}
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal("message");
                      setOrderId(rowData?.id);
                    }}
                    style={[
                      styles.cardFooter,
                      {
                        marginTop: 10,
                        backgroundColor: COLORS.primary,
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <Text style={[styles.cardText, { color: "white" }]}>
                      Message
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardButton, { background: COLORS.orange }]}
                    onPress={() => {
                      setShowModal("check-in");
                      setUserToCheckin(rowData);
                    }}
                  >
                    <Text style={styles.cardButtonText}>
                      Check In{" "}
                      {rowData?.ms_User?.tmp_RowCalls?.[0]?.days?.split(",")
                        ?.length || 0}{" "}
                      / {data?.cl || 0}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                    opacity: rowData?.status === "Success" ? 0.7 : 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal("score");
                      setOrderId(rowData?.uid);
                    }}
                    style={[
                      styles.cardFooter,
                      {
                        borderWidth: 1,
                        borderColor: COLORS.main,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text style={[styles.cardText, { color: COLORS.main }]}>
                      Score
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Confirmation",
                        "by clicking OK the user will automatically finish this course, and will get credentials and certificates from Aedu+ ",
                        [
                          {
                            text: "Cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => handleSendCertificate(rowData),
                          },
                        ]
                      );
                    }}
                    style={[
                      styles.cardFooter,
                      { backgroundColor: COLORS.mediumgreen, marginTop: 15 },
                    ]}
                  >
                    <Text style={[styles.cardText, { color: "white" }]}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Modal
          onRequestClose={() => setShowModal("")}
          visible={showModal === "message"}
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
                height: 300,
                width: "90%",
                backgroundColor: "white",
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Message user
              </Text>
              <Text style={{ color: COLORS.gray, marginBottom: 10 }}>
                Message users to continue their payment, or send any message to
                remind them
              </Text>
              <TextInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder="Write your message here!"
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  width: 300,
                  padding: 5,
                  marginBottom: 10,
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.cardButton]}
                onPress={handleMessageUsers}
              >
                <Text style={{ color: "white" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          onRequestClose={() => setShowModal("")}
          visible={showModal === "score"}
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
                height: 300,
                width: "90%",
                backgroundColor: "white",
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Score users
              </Text>
              <Text style={{ color: COLORS.gray, marginBottom: 10 }}>
                This is the value that will be displayed on the user
                certificate, please rate it to the best of your score.
              </Text>
              <TextInput
                value={score}
                onChangeText={(num) => setScore(num)}
                placeholder="Ex: 90"
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  width: 300,
                  padding: 5,
                  marginBottom: 10,
                }}
                keyboardType="number"
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  gap: 10,
                  marginHorizontal: 10,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{ width: 100, borderWidth: 1, borderColor: "gray" }}
                />
                <Text style={{ fontSize: 14, color: "gray" }}>Of</Text>
                <View
                  style={{ width: 100, borderWidth: 1, borderColor: "gray" }}
                />
              </View>
              <TextInput
                value={scoreOf}
                onChangeText={(num) => setScoreOf(num)}
                placeholder="Ex: 90"
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  width: 300,
                  padding: 5,
                  marginBottom: 10,
                }}
                keyboardType="number"
              />
              <TouchableOpacity
                style={[styles.cardButton]}
                onPress={handleCreateScore}
              >
                <Text style={{ color: "white" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          onRequestClose={() => setShowModal("")}
          visible={showModal === "check-in"}
          animationType="slide"
        >
          <View style={{ flex: 1, padding: 15 }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: COLORS.main,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  AEDU
                </Text>
                <Text style={{ fontSize: 12 }}>
                  ORDER #
                  {userToCheckin?.id
                    ?.replaceAll("-", "")
                    ?.toUpperCase()
                    ?.substring(0, 14)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginBottom: 5,
                }}
              >
                <Text style={{ color: "gray" }}>
                  {moment(
                    userToCheckin?.ms_EnterpriseCourse?.start_date
                  ).format("DD MMMM YYYY")}
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.main,
                  borderRadius: 5,
                  padding: 8,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Ticket Name
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginVertical: 1,
                      }}
                    >
                      {userToCheckin?.ms_User?.ms_Profile?.prof_name}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Course
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginVertical: 1,
                      }}
                    >
                      {userToCheckin?.ms_EnterpriseCourse?.title}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Payment Status
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginVertical: 1,
                        color:
                          userToCheckin?.status === "Paid" ? "green" : "red",
                      }}
                    >
                      {userToCheckin?.status}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handlePresent}
                  style={styles.cardButton}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginRight: 3,
                    }}
                  >
                    Check In{" "}
                    {userToCheckin?.ms_User?.tmp_RowCalls?.[0]?.days?.split(",")
                      ?.length || 0}{" "}
                    / {data?.cl}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <StatusBar backgroundColor="white" barStyle="light-content" />

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
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
});
