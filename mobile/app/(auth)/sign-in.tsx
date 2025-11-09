import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn } from "@/features/user/userSlice";
import { useRouter, Link } from "expo-router";

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
    if (currentUser) router.push("/");
  }, [currentUser]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // 👈 chỉnh cao hơn để không bị che
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
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
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF6633",
                  height: 40,
                  borderRadius: 8,
                  width: "80%",

                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleLogin}
              >
                <Text
                  style={{
                    color: "#f9f9f9ff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Chưa có tài khoản? </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Đăng ký</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View style={[styles.linkContainer, { marginTop: 10 }]}>
              <Link href="/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {status === "loading" && <Text>Đang đăng nhập...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: -50,
  },
  inner: {
    marginTop: -40,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  img: {
    height: height * 0.3,
    width: "80%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#666",
  },
  link: {
    fontSize: 16,
    color: "#FF6633",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
