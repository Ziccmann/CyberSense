import React, {useContext, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {db} from '../backend/firebase';
import {doc, updateDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../extras/ThemeContext';

const UserUpdateProfile = ({navigation}) => {
    const [userFullName, setUserFullName] = useState('');
    const [userDOB, setUserDOB] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const isFocused = useIsFocused();
    const {theme} = useContext(ThemeContext);
    const styles = getDynamicStyles(theme);

    useEffect(() => {
        if (isFocused) {
            const getUserData = async () => {
                try {
                    const userDataJson = await AsyncStorage.getItem('userObject');
                    if (userDataJson != null) {
                        const userData = JSON.parse(userDataJson);
                        setUserFullName(userData.UserFullName);
                        setUserDOB(userData.UserDOB);
                        setUserEmail(userData.UserEmail);
                    }
                } catch (error) {
                    console.error('Error fetching the user data:', error);
                }
            };
            getUserData();
        }
    }, [isFocused]);

    const onPressUpdateProfile = async () => {
        if (userFullName && userDOB && userEmail) {
            try {
                const userDataJson = await AsyncStorage.getItem('userObject');
                const userData = JSON.parse(userDataJson || '{}');
                const userRef = doc(db, 'UserMD', userData.AuthenticationID);
                const updatedUserData = {
                    UserFullName: userFullName,
                    UserDOB: userDOB,
                    UserEmail: userEmail,
                };

                await updateDoc(userRef, updatedUserData);
                await AsyncStorage.setItem('userObject', JSON.stringify({...userData, ...updatedUserData}));
                alert('Profile updated successfully!');
                navigation.goBack();
            } catch (error) {
                console.error("Error updating profile: ", error);
                alert('Error updating profile');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.imageView}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>Update Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={setUserFullName}
                value={userFullName}
                placeholderTextColor={styles.placeholderTextColor.color}
            />
            <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                onChangeText={setUserDOB}
                value={userDOB}
                placeholderTextColor={styles.placeholderTextColor.color}
            />
            <TextInput
                style={[styles.input, styles.nonEditableInput]}
                placeholder="Email Address"
                value={userEmail}
                placeholderTextColor={styles.placeholderTextColor.color}
                editable={false}
            />
            <TouchableOpacity style={styles.button} onPress={onPressUpdateProfile}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const getDynamicStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
        container: {
            backgroundColor: isDark ? '#0D1B2A' : '#FFFFFF',
        },
        contentContainer: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageView: {
            alignItems: 'center',
        },
        image: {
            width: 70,
            height: 50,
        },
        title: {
            color: isDark ? '#FFFFFF' : '#000000',
            fontSize: 22,
            marginBottom: 20,
        },
        input: {
            width: '100%',
            padding: 10,
            marginVertical: 10,
            backgroundColor: isDark ? '#1B263B' : '#F0F0F0',
            color: isDark ? '#FFFFFF' : '#000000',
            borderRadius: 5,
            paddingHorizontal: 20,
        },
        nonEditableInput: {
            opacity: isDark ? 0.5 : 0.5,
        },
        placeholderTextColor: {
            color: isDark ? '#E0E1DD' : '#C7C7CD',
        },
        button: {
            backgroundColor: isDark ? '#3D556E' : '#1E90FF',
            width: '100%',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
        },
    });
};

export default UserUpdateProfile;
