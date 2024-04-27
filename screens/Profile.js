import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../extras/ThemeContext'; // Import the ThemeContext

const Profile = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [userInfo, setUserInfo] = useState({});
    const {theme} = useContext(ThemeContext); // Access the theme from the ThemeContext
    const styles = getStyles(theme); // Dynamic styles based on the theme

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userObject');
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('Error clearing the user data:', error);
        }
    };

    const getUserData = async () => {
        try {
            const userDataJson = await AsyncStorage.getItem('userObject');
            if (userDataJson != null) {
                setUserInfo(JSON.parse(userDataJson));
            }
        } catch (error) {
            console.error('Error fetching the user data:', error);
        }
    };

    const onPressUpdateProfile = () => {
        navigation.navigate('UserUpdateProfileScreen', {Item: userInfo});
    }

    useEffect(() => {
        if (isFocused) {
            getUserData();
        }
    }, [isFocused]);

    // Now we return the profile screen with user info
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/user.png')} // Replace with your image path
                style={styles.profilePic}
            />

            <Text style={styles.userInfo}>{userInfo.UserFullName || 'Your Name'}</Text>
            <Text style={styles.userInfo}>{userInfo.UserDOB || 'Date of Birth'}</Text>
            <Text style={styles.userInfo}>{userInfo.UserEmail || 'Email Address'}</Text>
            <Text style={styles.userInfo}>{userInfo.UserRole || 'User Role'}</Text>

            <TouchableOpacity style={styles.button} onPress={onPressUpdateProfile}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};



const getStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#0D1B2A' : '#FFF', // Color based on theme
            padding: 20,
            alignItems: 'center',
        },
        profilePic: {
            width: 120,
            height: 120,
            borderRadius: 60, // Makes the image round
            marginTop: 50,
            marginBottom: 20,
        },
        userInfo: {
            fontSize: 18,
            color: isDark ? '#FFFFFF' : '#000', // Text color based on theme
            marginBottom: 10,
        },
        button: {
            backgroundColor: isDark ? '#1B263B' : '#DDD', // Button color based on theme
            width: '90%', // Button width
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        buttonText: {
            color: isDark ? '#FFFFFF' : '#000', // Button text color based on theme
            fontSize: 16,
        },
        // ... other styles if needed
    });
};


export default Profile;
