import React from "react";
import { View, Text, Button } from "react-native";
import {
  useLinking,
  NavigationContainer,
  getPathFromState,
  useNavigationState
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Linking } from "expo";

const prefix = Linking.makeUrl("/");
const config = {
  HomeStack: {
    path: "stack",
    initialRouteName: "Profile",
    screens: {
      Home: "home",
      Profile: {
        path: "user/:id/:age",
        parse: {
          id: id => `there, ${id}`,
          age: Number
        }
      }
    }
  },
  Settings: "settings"
};
export default function App() {
  const ref = React.useRef();

  const { getInitialState } = useLinking(ref, {
    prefixes: [prefix],
    config
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    getInitialState()
      .catch(() => {})
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  function Home({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Go to Wojciech's profile"
          onPress={() =>
            navigation.navigate("Profile", { id: "Wojciech", age: 22 })
          }
        />
        <Button
          title="Go to unknown profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Text>
          {getPathFromState(
            useNavigationState(state => state),
            config
          )}
        </Text>
        <Text>{JSON.stringify(useNavigationState(state => state))}</Text>
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
        <Text>
          {getPathFromState(
            useNavigationState(state => state),
            config
          )}
        </Text>
        <Text>{JSON.stringify(useNavigationState(state => state))}</Text>
      </View>
    );
  }

  function Settings() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          {getPathFromState(
            useNavigationState(state => state),
            config
          )}
        </Text>
        <Text>{JSON.stringify(useNavigationState(state => state))}</Text>
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

  return (
    <NavigationContainer initialState={initialState} ref={ref}>
      <MyTabs.Navigator>
        <MyTabs.Screen name="HomeStack" component={HomeStack} />
        <MyTabs.Screen name="Settings" component={Settings} />
      </MyTabs.Navigator>
    </NavigationContainer>
  );
}
