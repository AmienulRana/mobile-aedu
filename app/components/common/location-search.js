import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { URL_API } from "../../hooks/useFetch";

export default function LocationSearch({ setLocation, location }) {
  const [locationJob, setLocationJob] = useState(location);
  const [locations, setLocations] = useState([]);

  const handleSearchLocation = async (text) => {
    setLocationJob(text);
    if (text.length === 0) setLocations([]);

    if (text.length >= 3) {
      try {
        const response = await axios.get(`${URL_API}/getLoc/${text}`);
        setLocations(response?.data?.loc);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelectLocation = (selectedLocation) => {
    setLocations([]);
    setLocationJob(selectedLocation.name);
    setLocation(selectedLocation.id, selectedLocation.name);
  };

  useEffect(() => {
    setLocationJob(location);
  }, [location]);

  return (
    <View>
      <TextInput
        onChangeText={handleSearchLocation}
        placeholder="City"
        value={locationJob}
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,.4)",
          marginBottom: 20,
          paddingHorizontal: 10,
          borderRadius: 4,
        }}
      />
      {locations?.length > 0 && (
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "rgba(0,0,0,0.3)",
            borderRadius: 5,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <FlatList
            data={locations}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>{item?.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
