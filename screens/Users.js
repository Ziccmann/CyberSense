// Users.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { db } from '../backend/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../extras/ThemeContext';
import { getThemeStyles } from '../extras/theme-styles'; // make sure the path is correct

const Users = () => {
    // Dynamic theme integration
    const { theme } = useContext(ThemeContext);
    const styles = getThemeStyles(theme); 
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loggedInUserRole, setLoggedInUserRole] = useState('');

    useEffect(() => {
        const checkRoleAndFetchUsers = async () => {
            const userDataJson = await AsyncStorage.getItem('userObject');
            if (userDataJson) {
                const userData = JSON.parse(userDataJson);
                setLoggedInUserRole(userData.UserRole); // Set logged in user's role
                if (userData.UserRole === 'SuperAdmin' || userData.UserRole === 'Admin') {
                    fetchUsers(userData.UserRole); // Fetch users based on role
                }
            }
        };

        if (isFocused) {
            checkRoleAndFetchUsers();
        }
    }, [isFocused]);

    const fetchUsers = async (role) => {
        let usersQuery;
        if (role === 'SuperAdmin') {
            usersQuery = query(collection(db, 'UserMD'), where('UserRole', '!=', 'SuperAdmin'));
        } else if (role === 'Admin') {
            usersQuery = query(collection(db, 'UserMD'), where('UserRole', '==', 'User'));
        } else {
            setUsers([]);
            return;
        }

        const querySnapshot = await getDocs(usersQuery);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUsers(fetchedUsers);
    };

    const onUserPress = (user) => {
        navigation.navigate('UsersUpdateScreen', { userData: user });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => onUserPress(item)}>
            <Text style={styles.dob}>{item.UserRole}</Text>
            <Text style={styles.name}>{item.UserFullName}</Text>
            <Text style={styles.dob}>{item.UserDOB}</Text>
            <Text style={styles.email}>{item.UserEmail}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/file-security.png')} style={styles.image} resizeMode='contain' />
            </View>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                // no need for style prop on FlatList
            />
            {(loggedInUserRole === 'SuperAdmin' || loggedInUserRole === 'Admin') && (
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUserScreen')}>
                    <Text style={styles.addButtonText}>Add User</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#0D1B2A',
//     },
//     itemContainer: {
//         backgroundColor: '#1B263B',
//         padding: 20,
//         marginVertical: 8,
//         borderRadius: 5,
//     },
//     name: {
//         fontSize: 18,
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//     },
//     dob: {
//         fontSize: 16,
//         color: '#E0E1DD',
//     },
//     email: {
//         fontSize: 16,
//         color: '#E0E1DD',
//     },
//     image: {
//         width: 100,
//         height: 80,
//     },
//     addButton: {
//         backgroundColor: '#4CAF50', // A green color for the add button
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     addButtonText: {
//         color: '#FFFFFF',
//         fontSize: 16,
//     },
// });

export default Users;
