import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../../components/shared/COLORS";
import useFetch, { URL_API_COMM } from "../../hooks/useFetch";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTimeAgoString } from "../../components/utils/helper";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import moment from "moment/moment";
import { Avatar } from "./home";
import axios from "axios";

export function RowMessage({
  id,
  username,
  message,
  timeMessage,
  allIdToDelete,
  typeMessage = "sent",
  handleCheckToDelete,
}) {
  function formatTimeMessage(inputTime) {
    const currentTime = moment();
    const inputMoment = moment(inputTime);
    const formattedDateString = inputMoment.format("DD/MM/YYYY");

    const isYesterday = currentTime
      .clone()
      .subtract(1, "days")
      .isSame(inputMoment, "day");
    const timeDiffMinutes = currentTime.diff(inputMoment, "minutes");
    const hours = Math.floor(timeDiffMinutes / 60);
    const minutes = timeDiffMinutes % 60;
    if (isYesterday) return "yesterday";

    if (formattedDateString === currentTime.format("DD/MM/YYYY")) {
      if (hours === 0) {
        return `${minutes || 1} Minutes ago`;
      } else {
        return `${hours} Hours ago`;
      }
    }

    return formattedDateString;
  }

  return (
    <Pressable
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderColor: COLORS.gray,
        backgroundColor: pressed
          ? "#f6f6f6"
          : allIdToDelete?.includes(id)
          ? "#f3f3f3"
          : "white",
      })}
      delayLongPress={500}
      onPress={() =>
        allIdToDelete?.length > 0 && handleCheckToDelete?.(id || "")
      }
      onLongPress={() => handleCheckToDelete?.(id || "")}
    >
      {/* {typeMessage === "inbox" && (
        <CheckBox
          onValueChange={(value) => handleCheckToDelete?.(id || "")}
          value={allIdToDelete?.includes(id || "")}
        />
      )} */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Avatar name={username} size={40} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>{username}</Text>
            <Text style={{ fontSize: 16 }}>{message}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 12, color: "gray" }}>
              {formatTimeMessage(timeMessage)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CommunityMessage() {
  const [tabActive, setTabActive] = useState("Inbox");
  const navigation = useNavigation();
  const router = useRoute();
  const { data: inboxMessages, fetchData: getInboxMessage } = useFetch(
    "/comm/inbox",
    URL_API_COMM
  );
  const { data: sendMessages, fetchData: getSendMesssage } = useFetch(
    "/comm/getSendMsg",
    URL_API_COMM
  );
  const { data: connectionList } = useFetch(
    "/comm/connectionMsglist ",
    URL_API_COMM
  );

  useFetch("/comm/readall_message", URL_API_COMM);

  const [allIdToDelete, setAllIdToDelete] = useState([]);
  const [searchConnections, setSearchConnections] = useState([
    {
      id: "",
      username: "",
      tagline: "",
    },
  ]);
  const [receiveUser, setReceiveUser] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedConnetion, setSelectedConnection] = useState({
    id: "",
    username: "",
    tagline: "",
  });

  const handleSentMessage = async () => {
    try {
      const response = await axios.post(
        `${URL_API_COMM}/comm/directChat/${selectedConnetion?.id}`,
        { msg: message }
      );
      if (response?.status === 200) {
        setShowModal(false);
        setMessage("");
        getSendMesssage();
        setSelectedConnection({});
        setReceiveUser("");
        setTabActive("Sent");
      }
    } catch (error) {
      Alert.alert("Failed sent your message");
      console.log(error);
    }
  };

  const handleCheckToDelete = (id) => {
    if (id === "all") {
      if (allIdToDelete.length === inboxMessages.length)
        return setAllIdToDelete([]);
      const getIdMessage = inboxMessages?.map((message) => message?.id);
      setAllIdToDelete(getIdMessage);
    } else {
      const updatedIdList = allIdToDelete.includes(id)
        ? allIdToDelete.filter((messageId) => messageId !== id)
        : [...allIdToDelete, id];
      setAllIdToDelete(updatedIdList);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await axios.post(`${URL_API_COMM}/comm/delete_post_batch`, {
        ids: allIdToDelete,
      });
      getInboxMessage();
      Alert.alert("Success to delete message!");
      setAllIdToDelete([]);
    } catch (error) {
      Alert.alert("Failed to delete message!");
    }
  };

  const newStructureUser = () => {
    const users = connectionList?.rows?.map((connection) => ({
      id: connection?.follows,
      username: `${connection?.fol?.ms_Profile?.first_name} ${connection?.fol?.ms_Profile?.last_name}`,
      tagline:
        connection?.fol?.ms_Profile?.tagline ||
        connection?.fol?.ms_Profile?.role,
    }));
    return users;
  };
  const handleSearchConnection = (text) => {
    setReceiveUser(text);
    const filterUser = newStructureUser()?.filter((user) =>
      user?.username?.toLowerCase().includes(text?.toLowerCase())
    );
    setSearchConnections(filterUser);
  };

  useEffect(() => {
    if (router?.params?.username) {
      console.log(router.params);
      setReceiveUser(router?.params?.username);
      setSelectedConnection(router?.params);
      setShowModal(true);
    }
  }, [router]);

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

        <View style={{ paddingVertical: 15 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={["Inbox", "Sent"]}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setTabActive(item)}
                style={{ marginBottom: 20, width: 100 }}
              >
                <Text style={styles.tab(tabActive, item)}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        {allIdToDelete?.length > 0 && (
          <TouchableOpacity
            style={{
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
            onPress={handleDeleteMessage}
          >
            <Text style={{ color: "red" }}>
              Delete ({allIdToDelete?.length})
            </Text>
          </TouchableOpacity>
        )}

        {tabActive === "Inbox" &&
          inboxMessages
            ?.sort((a, b) => {
              const timeA = new Date(a?.createdAt).getTime();
              const timeB = new Date(b?.createdAt).getTime();
              return timeB - timeA;
            })
            ?.map((message, index) => (
              <RowMessage
                id={message?.id}
                key={index}
                username={
                  message?.snder?.ms_EnterpriseProfile?.business_name ||
                  `${message?.snder?.ms_Profile?.first_name} ${message?.snder?.ms_Profile?.last_name}`
                }
                message={message?.msg}
                timeMessage={message?.createdAt}
                allIdToDelete={allIdToDelete}
                typeMessage="inbox"
                handleCheckToDelete={handleCheckToDelete}
              />
            ))}
        {tabActive === "Sent" &&
          sendMessages
            ?.sort((a, b) => {
              const timeA = new Date(a?.createdAt).getTime();
              const timeB = new Date(b?.createdAt).getTime();
              return timeB - timeA;
            })
            ?.map((message, index) => (
              <RowMessage
                key={index}
                timeMessage={message?.createdAt}
                message={message?.msg}
                username={
                  message?.rc?.ms_EnterpriseProfile?.business_name ||
                  `${message?.rc?.ms_Profile?.first_name} ${message?.rc?.ms_Profile?.last_name}`
                }
              />
            ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          width: 60,
          height: 60,
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: COLORS.main,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <FontAwesome name="pencil" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Message
          </Text>
          <Text>From : Me</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 2,
              borderBottomWidth: 1,
              paddingBottom: 3,
            }}
          >
            <Text>To Connection : </Text>
            <TextInput
              value={receiveUser}
              onChangeText={handleSearchConnection}
              style={{ flex: 1, borderWidth: 0 }}
            />
            <View
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 1000,
              }}
            >
              {receiveUser &&
                selectedConnetion?.username !== receiveUser &&
                searchConnections?.map((connection) => (
                  <View
                    style={{
                      backgroundColor: "white",
                      width: 300,
                      padding: 10,
                      borderRadius: 5,
                      marginTop: 5,
                      zIndex: 100,
                    }}
                    key={connection?.id}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setReceiveUser(connection?.username);
                        setSelectedConnection(connection);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          paddingBottom: 10,
                          borderBottomWidth: 1,
                          marginBottom: 5,
                        }}
                      >
                        <Avatar name={connection?.username} size={40} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 14,
                              color: "black",
                            }}
                          >
                            {connection?.username}
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            {connection?.tagline}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
          {receiveUser && searchConnections?.length === 0 && (
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: "red",
                marginTop: 3,
              }}
            >
              *Cannot find user bri {receiveUser}
            </Text>
          )}
          <TextInput
            multiline={true}
            numberOfLines={3}
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Send Your Message Here!"
            style={{
              fontSize: 14,
              height: 100,
              borderWidth: 1,
              borderColor: "black",
              marginTop: 30,
              zIndex: -1,
              padding: 10,
            }}
            textAlignVertical="top"
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={handleSentMessage}
              style={{
                backgroundColor: COLORS.main,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginTop: 10,
                width: 80,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  tab: (tabActive, item) => {
    return {
      textAlign: "center",
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
