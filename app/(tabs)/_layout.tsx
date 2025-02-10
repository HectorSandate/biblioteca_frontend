
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../../src/redux/store";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* Proveedor de React Native Paper para los componentes de UI */}
      <PaperProvider>
        <Stack />
      </PaperProvider>
      <Toast position="bottom" visibilityTime={3000} bottomOffset={50} />
      {/* Proveedor de Toast */}
    </Provider>
  );
}
