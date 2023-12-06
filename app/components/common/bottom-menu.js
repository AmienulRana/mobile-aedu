import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import {
  NavigationContext,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import COLORS from "../shared/COLORS";

const BottomMenuBar = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useContext(NavigationContext);
  const router = useRoute();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return !isKeyboardVisible ? (
    <View style={styles.menuBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate(router?.name === 'discover' ? "discover" : router?.name === 'home' ? "discover" : "discover")}
        style={styles.menuItem}
      >
        <Ionicons
          name="home"
          size={24}
          color={(router.name === "home" || router.name === "discover" ) ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("my-course")}
        style={styles.menuItem}
      >
        <Feather
          name="book-open"
          size={24}
          color={router.name === "my-course" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      {/* {router?.name !== 'discover' && (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("community-home")}
      >
        <Ionicons
          name="md-globe-sharp"
          size={24}
          color={true ? COLORS.gray : "black"}
        />
      </TouchableOpacity>

      )} */}
      <TouchableOpacity style={styles.menuItem}>
        <FontAwesome
          onPress={() => navigation.navigate("cart")}
          name="shopping-cart"
          size={24}
          color={router.name?.includes("cart") ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("profile")}
        style={styles.menuItem}
      >
        <FontAwesome
          name="user"
          size={24}
          color={router.name === "profile" ? COLORS.main : COLORS.gray}
        />
      </TouchableOpacity>
    </View>
  ) : null;
};

export default BottomMenuBar;

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    height: 50,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderWidth: 0.2,
    borderColor: "#eaeaea",
  },
});
