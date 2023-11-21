import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from './src/Login';
import HomeScreen from './src/Screens/HomeScreen';
import CustomersScreen from './src/Screens/CustomersScreen';

export default AppNavigator=()=>{

    const Stack = createNativeStackNavigator();

    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Customers" component={CustomersScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}