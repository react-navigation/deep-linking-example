import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer, LinkingOptions, useLinkTo } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Linking from "expo-linking";

const prefix = Linking.makeUrl("/");
const linking: LinkingOptions = {
  prefixes: [prefix],
  config: {
    screens: {
      HomeStack: {
        path: "stack",
        initialRouteName: "Home",
        screens: {
          Home: "home",
          Profile: {
            path: "user/:id/:age",
            parse: {
              id: id => `there, ${id}`,
              age: Number,
            },
            stringify: {
              id: id => id.replace("there, ", ""),
            },
          },
        },
      },
      Settings: "settings",
    },
  },
};

function Home({ navigation }) {
  const linkTo = useLinkTo();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Go to Wojciech's profile"
        onPress={() => linkTo("/stack/user/Wojciech/22")}
      />
      <Button
        title="Go to unknown profile"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}

function Profile({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello {route.params?.id || "Unknown"}!</Text>
      <Text>
        Type of age parameter is{" "}
        {route.params?.age ? typeof route.params.age : "undefined"}
      </Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>This is the Settings Page.</Text>
    </View>
  );
}

const HomeStack = () => {
  const MyStack = createStackNavigator();

  return (
    <MyStack.Navigator>
      <MyStack.Screen name="Home" component={Home} />
      <MyStack.Screen name="Profile" component={Profile} />
    </MyStack.Navigator>
  );
};
const MyTabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <MyTabs.Navigator>
        <MyTabs.Screen name="HomeStack" component={HomeStack} />
        <MyTabs.Screen name="Settings" component={Settings} />
      </MyTabs.Navigator>
    </NavigationContainer>
  );
}
