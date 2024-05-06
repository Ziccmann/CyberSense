import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../extras/ThemeContext';
import { db } from '../backend/firebase';

const Modules = () => {
    const [modules, setModules] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme); // Get styles based on theme
    const [originalUserRole, setOriginalUserRole] = useState('');
    const [isViewingAsUser, setIsViewingAsUser] = useState(false);

    useEffect(() => {
        // Fetch modules when the screen is focused
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

        // Get the user role from AsyncStorage
        const getUserRole = async () => {
            const userDataJson = await AsyncStorage.getItem('userObject');
            if (userDataJson) {
                const userData = JSON.parse(userDataJson);
                setOriginalUserRole(userData.UserRole);
            }
        };

        getUserRole(); // Get user role on component mount
        if (isFocused) {
            fetchModules(); // Fetch modules when screen is focused
        }
    }, [isFocused]); // Re-fetch modules when the screen is focused

    // Update 'isViewingAsUser' state when the navigation focus changes
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('viewAsUser').then(value => {
                setIsViewingAsUser(value === 'true');
            });
        });
        return unsubscribe; // Cleanup listener on component unmount
    }, [navigation]); // Re-subscribe when navigation changes

    // Function to handle module press
    const onModulePress = (module) => {
        navigation.navigate('ModuleContentsScreen', { moduleData: module });
    };

    // Render item for FlatList
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
                    {/* Buttons for adding modules, quizzes, and questions */}
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

// Function to get styles based on theme
const getStyles = (theme) => {
    const isDark = theme === 'dark'; // Check if the theme is dark
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDark ? '#0D1B2A' : '#FFF', // Set background color based on theme
        },
        itemContainer: {
            backgroundColor: isDark ? '#1B263B' : '#DDD', // Set item background color based on theme
            padding: 20,
            marginVertical: 8,
            borderRadius: 5,
        },
        title: {
            fontSize: 18,
            color: isDark ? '#FFFFFF' : '#000', // Set text color based on theme
            fontWeight: 'bold',
        },
        description: {
            fontSize: 14,
            color: isDark ? '#E0E1DD' : '#333', // Set text color based on theme
            marginTop: 4,
        },
        image: {
            width: 70,
            height: 50,
        },
        addButton: {
            backgroundColor: isDark ? '#4CAF50' : '#8BC34A', // Set button background color based on theme
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        addButtonText: {
            color: isDark ? '#FFFFFF' : '#000', // Set button text color based on theme
            fontSize: 16,
        },
    });
};

export default Modules;
