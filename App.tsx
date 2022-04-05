import React, { useMemo } from "react";
import { View, Text, Button } from "react-native";
import {
  NavigationContainer,
  LinkingOptions,
  useLinkTo,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Linking from "expo-linking";

type RootStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Settings: undefined;
};

type HomeStackParamList = {
  Home: undefined;
  Profile: {
    id: string;
    age?: number;
  };
};

const prefix = Linking.makeUrl("/");
const linking: LinkingOptions<RootStackParamList> = {
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
              id: (id) => `there, ${id}`,
              age: Number,
            },
            stringify: {
              id: (id) => id.replace("there, ", ""),
            },
          },
        },
      },
      Settings: "settings",
    },
  },
};

type HomeProps = StackScreenProps<HomeStackParamList, "Home">;
const Home: React.FC<HomeProps> = ({ navigation }) => {
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
};

type ProfileProps = StackScreenProps<HomeStackParamList, "Profile">;
const Profile: React.FC<ProfileProps> = ({ route }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello {route.params?.id || "Unknown"}!</Text>
      <Text>
        Type of age parameter is{" "}
        {route.params?.age ? typeof route.params.age : "undefined"}
      </Text>
    </View>
  );
};

type SettingsProps = StackScreenProps<RootStackParamList, "Settings">;
const Settings: React.FC<SettingsProps> = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>This is the Settings Page.</Text>
    </View>
  );
};

type HomeStackProps = StackScreenProps<RootStackParamList, "HomeStack">;
const HomeStack: React.FC<HomeStackProps> = () => {
  const MyStack = createStackNavigator<HomeStackParamList>();

  return (
    <MyStack.Navigator>
      <MyStack.Screen name="Home" component={Home} />
      <MyStack.Screen name="Profile" component={Profile} />
    </MyStack.Navigator>
  );
};

export default function App() {
  const MyTabs = createBottomTabNavigator<RootStackParamList>();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarIcon: () => null,
    }),
    []
  );

  return (
    <NavigationContainer linking={linking}>
      <MyTabs.Navigator screenOptions={screenOptions}>
        <MyTabs.Screen name="HomeStack" component={HomeStack} />
        <MyTabs.Screen name="Settings" component={Settings} />
      </MyTabs.Navigator>
    </NavigationContainer>
  );
}
