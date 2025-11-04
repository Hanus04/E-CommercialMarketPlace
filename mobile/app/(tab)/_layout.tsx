import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const TabsLayout = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  // const isLoading = useSelector((state: RootState) => state.user.isLoading);

  if (user === undefined) return null;

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00AEEF",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="heart-outline" size={size} color={color} />
              <View
                style={{
                  position: "absolute",
                  right: -10,
                  top: -5,
                  backgroundColor: "red",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>9</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubble-outline" size={size} color={color} />
              <View
                style={{
                  position: "absolute",
                  right: -10,
                  top: -5,
                  backgroundColor: "red",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>1</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          href: "/account",
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
