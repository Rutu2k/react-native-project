import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for products
const ProductsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: 'Product Details',
        })}
      />
    </Stack.Navigator>
  );
};

// Tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5A31F4',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          title: 'Products',
          tabBarLabel: 'Products',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // User is signed in
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          // User is not signed in
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AppNavigator;
