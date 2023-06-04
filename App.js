import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import GoalScreen from './GoalScreen';

const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    display: "none"
                }
            }}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Goal" component={GoalScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
