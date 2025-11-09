import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = () => {
    // This is just UI for now
    alert("Một email đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn");
    router.push("/sign-in");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
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
          <Text style={styles.title}>Quên mật khẩu</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập email của bạn để đặt lại mật khẩu
          </Text>

          <View style={styles.formInput}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
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
                onPress={handleResetPassword}
              >
                <Text
                  style={{
                    color: "#f9f9f9ff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Gửi yêu cầu
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Nhớ mật khẩu? </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Đăng nhập</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
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
    marginBottom: 16,
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
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
});
