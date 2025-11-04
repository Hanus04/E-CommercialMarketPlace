import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn } from "@/features/user/userSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fetchOrdersByCustomer } from "@/features/user/userSlice";

export default function SignInScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const handleLogin = () => {
    dispatch(signIn({ userName, password }));
  };

  // useEffect(() => {
  //   if (currentUser) {
  //     router.push("/")
  //   }
  // }, [currentUser])
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchOrdersByCustomer(currentUser.customerId));
      router.push("/");
    }
  }, [currentUser]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.title}>Chào bạn đến với Mini Super</Text>

        <View style={styles.formInput}>
          <TextInput
            placeholder="Tên đăng nhập"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button title="Đăng nhập" onPress={handleLogin} />
          </View>
        </View>

        {status === "loading" && <Text>Đang đăng nhập...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  img: {
    height: height * 0.3,
    width: "80%",
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    color: "#FF6633",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 40,
  },
  formInput: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
