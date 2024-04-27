import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db } from '../backend/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../extras/ThemeContext'; // Import the ThemeContext

const Modules = () => {
    const [modules, setModules] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { theme } = useContext(ThemeContext); // Use ThemeContext here
    const styles = getStyles(theme); // Get dynamic styles based on theme
    const [originalUserRole, setOriginalUserRole] = useState('');
    const [isViewingAsUser, setIsViewingAsUser] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Modules'));
                const fetchedModules = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setModules(fetchedModules);
            } catch (error) {
                console.error("Error fetching modules: ", error);
            }
        };

        const getUserRole = async () => {
            const userDataJson = await AsyncStorage.getItem('userObject');
            if (userDataJson) {
                const userData = JSON.parse(userDataJson);
                setOriginalUserRole(userData.UserRole);
            }
        };

        getUserRole();
        if (isFocused) {
            fetchModules();
        }
    }, [isFocused]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('viewAsUser').then(value => {
                setIsViewingAsUser(value === 'true');
            });
        });
        return unsubscribe;
    }, [navigation]);

    const onModulePress = (module) => {
        navigation.navigate('ModuleContentsScreen', { moduleData: module });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => onModulePress(item)}>
            <Text style={styles.title}>{item.ModuleName}</Text>
            <Text style={styles.description}>{item.ModuleDescription}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/file-security.png')} style={styles.image} resizeMode='contain' />
            </View>
            <FlatList data={modules} renderItem={renderItem} keyExtractor={item => item.id} />
            {(originalUserRole === 'SuperAdmin' || originalUserRole === 'Admin') && !isViewingAsUser && (
                <View>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddModuleScreen')}>
                        <Text style={styles.addButtonText}>Add Module</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddQuizScreen')}>
                        <Text style={styles.addButtonText}>Add Quiz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddQuestionScreen')}>
                        <Text style={styles.addButtonText}>Add Question</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};


const getStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDark ? '#0D1B2A' : '#FFF', // Dark or light background
        },
        itemContainer: {
            backgroundColor: isDark ? '#1B263B' : '#DDD', // Dark or light item background
            padding: 20,
            marginVertical: 8,
            borderRadius: 5,
        },
        title: {
            fontSize: 18,
            color: isDark ? '#FFFFFF' : '#000', // Dark or light text
            fontWeight: 'bold',
        },
        description: {
            fontSize: 14,
            color: isDark ? '#E0E1DD' : '#333', // Dark or light text
            marginTop: 4,
        },
        image: {
            width: 100,
            height: 80,
        },
        addButton: {
            backgroundColor: isDark ? '#4CAF50' : '#8BC34A', // Dark or light add button
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        addButtonText: {
            color: isDark ? '#FFFFFF' : '#000', // Dark or light button text
            fontSize: 16,
        },
        // ... other styles
    });
};
export default Modules;