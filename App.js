import { StyleSheet } from "react-native";

import { ProfileProvider } from "./app/context/useProfileContext";
import StackNavigation from "./app/components/navigation/stack-navigation";
import { LanguageProvider } from "./app/context/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <StackNavigation />
      </ProfileProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
