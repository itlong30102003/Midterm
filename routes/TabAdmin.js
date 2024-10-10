import {  } from "@react-navigation/material-bottom-tabs";
import Customer from "../adminscreens/Customer";
import Setting from "../adminscreens/Setting";
import Transaction from "../adminscreens/Transaction";
import Home from "../adminscreens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator()
const TabAdmin =()=>{
    <Tab.Navigator 
        screenOptions={{
            headerShown:false
        }}
    >
        <Tab.Screen name="home" component={Home}/>
        <Tab.Screen name="transaction" component={Transaction}/>
        <Tab.Screen name="customer" component={Customer}/>
        <Tab.Screen name="setting" component={Setting}/>
    </Tab.Navigator>
}
export default TabAdmin;