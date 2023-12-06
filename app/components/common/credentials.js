import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import useFetch, { URL_API_ENTER } from "../../hooks/useFetch";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "../shared/COLORS";

export default function Credentials({
  selectedSkills,
  setSelectedSkills,
  classNameTitle,
  title = "Skills",
  credentials,
}) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const { data } = useFetch("/enter/get_creds", URL_API_ENTER); // Sesuaikan dengan API endpoint Anda
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    console.log(credentials);
    if (credentials && credentials.length > 0) {
      setSkillsData(credentials);
    } else {
      setSkillsData(
        data?.map((dat, i) => ({ name: dat?.cred_name, id: dat?.id }))
      );
    }
  }, [credentials, data]);

  const handleSearch = (value) => {
    setSkillInput(value);
    if (value === "") {
      setSkills([]);
    } else {
      const filteredData = skillsData.filter(
        (item) =>
          !selectedSkills?.includes(item) &&
          item?.name?.toLowerCase().includes(value.toLowerCase())
      );
      setSkills(filteredData);
    }
  };

  const handleSelectSkill = (item) => {
    setSelectedSkills((prevSkills) => [...prevSkills, item]);
    setSkills([]);
    setSkillInput("");
  };

  const handleRemoveSkill = (item) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== item.id || skill !== item)
    );
  };

  return (
    <ScrollView>
      <Text style={{ marginBottom: 8, marginTop: 20 }}>Suggestion {title}</Text>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}
      >
        {skillsData
          .slice(0, 3)
          .filter((skill) => !selectedSkills.includes(skill))
          .map((skill, i) => (
            <TouchableOpacity
              onPress={() => handleSelectSkill(skill)}
              key={i}
              style={{
                backgroundColor: "white",
                marginRight: 8,
                padding: 10,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                borderColor: COLORS.main,
                borderWidth: 1,
                gap: 15,
                alignItems: "center",
              }}
            >
              <Text style={{ color: COLORS.main }}>{skill?.name}</Text>
              <FontAwesome name="plus" size={14} color={COLORS.main} />
            </TouchableOpacity>
          ))}
      </View>
      <Text style={{ marginBottom: 8 }}>{title}</Text>
      <View style={{ marginBottom: 15, position: "relative" }}>
        <TextInput
          placeholder={`Search ${title}`}
          value={skillInput}
          style={{
            width: "100%",
            borderColor: "#C4C4C4",
            borderWidth: 1,
            paddingVertical: 10,
            paddingLeft: 10,
            borderRadius: 5,
            fontSize: 14,
          }}
          onChangeText={(text) => handleSearch(text)}
        />
        {skills.length > 0 && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              minWidth: 180,
              top: "100%",
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 10,
            }}
          >
            {skills.map((skill, i) => (
              <Text
                key={i}
                onPress={() => handleSelectSkill(skill)}
                style={{
                  padding: 10,
                  fontSize: 14,
                  color: "#646464",
                }}
              >
                {skill?.name}
              </Text>
            ))}
          </View>
        )}
      </View>
      {selectedSkills.length > 0 && (
        <>
          <Text style={{ marginBottom: 8 }}>Selected {title}</Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}
          >
            {selectedSkills.map((skill, i) => (
              <TouchableOpacity
                onPress={() => handleRemoveSkill(skill)}
                key={i}
                style={{
                  backgroundColor: "white",
                  marginRight: 8,
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderColor: COLORS.main,
                  borderWidth: 1,
                  gap: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: COLORS.main }}>{skill?.name || skill}</Text>
                <FontAwesome name="remove" size={14} color={COLORS.red} />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}
