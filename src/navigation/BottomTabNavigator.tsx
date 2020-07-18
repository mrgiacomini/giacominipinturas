import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions, CommonActions  } from '@react-navigation/native';
import * as React from 'react';
import {View, Image} from 'react-native';
import { useAuth } from "../contexts/auth";
import Colors from '../constants/Colors';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList } from '../../types';
import { Button } from 'react-native-paper';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {

  return (
    <BottomTab.Navigator
      tabBarOptions={{ activeTintColor: Colors['light'].tint }}>
      <BottomTab.Screen
        name="Clientes"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <Ionicons size={30} style={{ marginBottom: -3 }}  name="ios-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Cadastro"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }}  name="home-plus" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Nota"
        component={TabThreeNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5  size={30} style={{ marginBottom: -3 }} name="file-invoice-dollar" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const stackNavigationOptions = () => {
    const { isLoggedIn, user, logout } = useAuth();
    
    return {
      headerTitle: 'Giacomini Pinturas',
      headerTintColor: Colors['light'].tint,
      headerTitleStyle: {
        fontWeight: 'bold',              
      },
      headerRight: ()=> 
      ( isLoggedIn ?       
          (<View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20, marginTop: 6 }}
              source={{uri: user.facebook?.picture?.data?.url}}
            />
            <Button onPress={logout}>
              <MaterialCommunityIcons size={30} name="logout" color={Colors['light'].tint} />
            </Button>
          </View>)
        : null
      ),
      
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler(); // Switch tab
        if (navigation.state.index > 0) { // In case the stack is not positioned at the first screen
          navigation.dispatch(StackActions.popToTop());
        }
      }
    }
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator 
      screenOptions={stackNavigationOptions}
      initialRouteName='ListaClientes'
    >
      <TabOneStack.Screen
        name="ListaClientes"
        component={TabOneScreen}
      />
      <TabOneStack.Screen
        name="EditaCliente"
        component={TabTwoScreen}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator
      screenOptions={stackNavigationOptions}
    >
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
      />
    </TabTwoStack.Navigator>
  );
}


const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
  return (
    <TabTwoStack.Navigator
      screenOptions={stackNavigationOptions}
    >
      <TabThreeStack.Screen
        name="TabThreeScreen"
        component={TabThreeScreen}
      />
    </TabTwoStack.Navigator>
  );
}
