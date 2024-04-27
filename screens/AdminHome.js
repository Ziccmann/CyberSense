import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as store from '../extras/DataFunctions';  // Ensure this path is correct and functional

const AdminHome = () => {
    const navigation = useNavigation();
    const [userFullName, setUserFullName] = useState("");
    

    useEffect(() => {
        const fetchData = async () => {
            const data = await store.dataRetrieve();
            console.log("Fetched Data:", data);  // Debug: Check what is actually fetched
            if (data !== null) {
                const dataReturn = JSON.parse(data);
                console.log("Parsed Data:", dataReturn);  // Debug: Ensure data is parsed correctly
                setUserFullName(dataReturn.UserFullName);  // Assuming the key for user's name is UserFullName
                console.log("Set User Full Name:", dataReturn.UserFullName);  // Debug: Check the set name
            }
        };
        fetchData();
    }, []);

    const data = [
        { key: 'Modules', icon: require('../assets/modules.png'), screen: 'ModulesScreen' },
        { key: 'Take Quick Quiz', icon: require('../assets/quiz.png'), screen: 'QuizDifficultySelectorScreen' },
        { key: 'Profile', icon: require('../assets/verified.png'), screen: 'ProfileScreen' },
        { key: 'Users', icon: require('../assets/group.png'), screen: 'UsersScreen' },
        { key: 'Settings', icon: require('../assets/settings.png'), screen: 'SettingsScreen' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate(item.screen)}
        >
            <Image source={item.icon} style={styles.icon} resizeMode='contain' />
            <Text style={styles.itemText}>{item.key}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>Welcome, {userFullName || "Guest"}!</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                numColumns={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#0D1B2A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0E1DD',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flex: 1,
        margin: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B263B',
        borderRadius: 5,
    },
    itemText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    icon: {
        width: 100,
        height: 100,
    },
    image: {
        width: 70,
        height: 50,
    }
});

export default AdminHome;
