import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {collection, deleteDoc, doc, getDoc, getDocs, query} from 'firebase/firestore';
import {db} from '../backend/firebase';
import {ThemeContext} from '../extras/ThemeContext'; // Import the ThemeContext

const ModuleContents = ({route}) => {
    const {moduleData} = route.params;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const {theme} = useContext(ThemeContext); // Consume the theme from the ThemeContext
    const [realUserRole, setRealUserRole] = useState('');
    const [viewAsUser, setViewAsUser] = useState(false);
    const [moduleDetails, setModuleDetails] = useState(moduleData);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            const userDataJson = await AsyncStorage.getItem('userObject');
            const userData = userDataJson ? JSON.parse(userDataJson) : {};
            setRealUserRole(userData.UserRole);

            const docRef = doc(db, 'Modules', moduleData.id);
            const docSnap = await getDoc(docRef);
            setModuleDetails(docSnap.exists() ? docSnap.data() : {});

            const quizzesQuery = query(collection(db, 'Modules', moduleData.id, 'Quizzes'));
            const querySnapshot = await getDocs(quizzesQuery);
            setQuizzes(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        };

        if (isFocused) fetchDetails();
    }, [isFocused, moduleData.id]);

    const onDeleteModule = async () => {
        Alert.alert("Delete Module", "Are you sure you want to delete this module?", [
            {text: "Cancel"},
            {
                text: "Yes", onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "Modules", moduleData.id));
                        Alert.alert("Success", "Module deleted successfully!");
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete the module.");
                        console.error("Error deleting module: ", error);
                    }
                }
            }
        ]);
    };

    // Dynamically adjust styles based on the theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 18,
            backgroundColor: theme === 'dark' ? '#0D1B2A' : '#FFF',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            marginBottom: 10,
        },
        content: {
            fontSize: 16,
            color: theme === 'dark' ? '#E0E1DD' : '#333',
            marginBottom: 20,
        },
        button: {
            backgroundColor: '#2196F3',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: 10,
        },
        buttonText: {
            color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF',
            fontSize: 16,
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        switchLabel: {
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            marginRight: 10,
        },
        deleteButton: {
            backgroundColor: '#F44336', // Red color for the delete button
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: 10,
        }
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{moduleDetails.ModuleName}</Text>
            <Text style={styles.content}>{moduleDetails.ModuleContent}</Text>

            {/* Switch for Admins to view as User */}
            {['SuperAdmin', 'Admin'].includes(realUserRole) && (
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>View as User:</Text>
                    <Switch
                        onValueChange={setViewAsUser}
                        value={viewAsUser}
                    />
                </View>
            )}

            {quizzes.map((quiz) => (
                <View key={quiz.id}>
                    {(['SuperAdmin', 'Admin'].includes(realUserRole) && !viewAsUser) && (
                        <>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('QuestionListScreen', {
                                    moduleId: moduleData.id,
                                    quizId: quiz.id
                                })}
                            >
                                <Text style={styles.buttonText}>View Questions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('UpdateModuleScreen', {
                                    moduleId: moduleData.id
                                })}
                            >
                                <Text style={styles.buttonText}>Edit Module</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('UpdateQuizScreen', {
                                    quizData: quiz,
                                    moduleId: moduleData.id,
                                    quizId: quiz.id
                                })}
                            >
                                <Text style={styles.buttonText}>Edit Quiz</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {(realUserRole === 'User' || viewAsUser) && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('ModuleQuizScreen', {
                                moduleId: moduleData.id,
                                quizId: quiz.id
                            })}
                        >
                            <Text style={styles.buttonText}>Take Quiz</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            {(['SuperAdmin', 'Admin'].includes(realUserRole) && !viewAsUser) && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={onDeleteModule}
                >
                    <Text style={styles.buttonText}>Delete Module</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default ModuleContents;
