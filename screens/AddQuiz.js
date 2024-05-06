import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { db } from '../backend/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { ThemeContext } from '../extras/ThemeContext'; // Import the ThemeContext

// Function to fetch modules from Firestore
const fetchModules = async () => {
    const modulesArray = [];
    const querySnapshot = await getDocs(collection(db, "Modules"));
    querySnapshot.forEach((doc) => {
        // Ensure that the ModuleName field exists and is not empty
        if (doc.data().ModuleName) {
            modulesArray.push({ label: doc.data().ModuleName, value: doc.data().ModuleName });
        }
    });
    return modulesArray;
};

const AddQuiz = () => {
    const [selectedModuleName, setSelectedModuleName] = useState('');
    const [moduleOptions, setModuleOptions] = useState([]);
    const [quizName, setQuizName] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizDifficulty, setQuizDifficulty] = useState('');
    const [passingScore, setPassingScore] = useState('');
    const { theme } = useContext(ThemeContext); // Consume the theme from the ThemeContext

    useEffect(() => {
        // Load modules when component mounts
        const loadModules = async () => {
            const modules = await fetchModules();
            setModuleOptions(modules);
            if (modules.length > 0) {
                setSelectedModuleName(modules[0].value); // Automatically select the first module as default
            }
        };
        loadModules();
    }, []);

    const handleAddQuiz = async () => {
        // Validate inputs and add quiz to database
        if (!quizName || !quizDescription || !passingScore || !selectedModuleName || !quizDifficulty) {
            Alert.alert('Error', 'Please fill in all fields to add a quiz.');
            return;
        }

        // Create a new document reference for the quiz in the selected module's quiz subcollection
        const quizRef = doc(db, `Modules/${selectedModuleName}/Quizzes`, quizName);

        try {
            await setDoc(quizRef, {
                QuizName: quizName,
                QuizDescription: quizDescription,
                PassingScore: parseInt(passingScore, 10),
                QuizDifficulty: quizDifficulty, // Add the QuizDifficulty to the document
            });
            Alert.alert('Success', 'Quiz added successfully!');
            setQuizName('');
            setQuizDescription('');
            setPassingScore('');
        } catch (error) {
            console.error("Error adding quiz: ", error);
            Alert.alert('Error', 'Failed to add quiz: ' + error.message);
        }
    };

    // Dynamically adjust styles based on the theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme === 'dark' ? '#0D1B2A' : '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            width: '100%',
            padding: 10,
            marginVertical: 10,
            backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0',
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            borderRadius: 5,
        },
        button: {
            backgroundColor: theme === 'dark' ? '#4CAF50' : '#8BC34A',
            padding: 10,
            width: '100%',
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 15,
        },
        imageView: {
            alignItems: 'center',
        },
        image: {
            width: 70,
            height: 50,
        },
        buttonText: {
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            fontSize: 16,
        },
        title: {
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            fontSize: 22,
            marginBottom: 20,
        },
        placeholderTextColor: {
            color: theme === 'dark' ? '#E0E1DD' : '#C7C7CD',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>Add Quiz to Module</Text>
            {/* Dropdown to select module */}
            <RNPickerSelect
                onValueChange={(value) => setSelectedModuleName(value)}
                items={moduleOptions}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a module...', value: null }}
                value={selectedModuleName}
            />
            {/* Input fields for quiz details */}
            <TextInput style={styles.input} placeholder="Quiz Name" placeholderTextColor={styles.placeholderTextColor} onChangeText={setQuizName} value={quizName} />
            <TextInput style={styles.input} placeholder="Quiz Description" placeholderTextColor={styles.placeholderTextColor} onChangeText={setQuizDescription} value={quizDescription} />
            <TextInput style={styles.input} placeholder="Passing Score" placeholderTextColor={styles.placeholderTextColor} keyboardType="numeric" onChangeText={setPassingScore} value={passingScore} />
            {/* Dropdown to select quiz difficulty */}
            <RNPickerSelect
                onValueChange={(value) => setQuizDifficulty(value)}
                items={[
                    { label: "Beginner", value: "Beginner" },
                    { label: "Pro", value: "Pro" },
                    { label: "Expert", value: "Expert" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select quiz difficulty...', value: null }}
                value={quizDifficulty}
            />
            {/* Button to add quiz */}
            <TouchableOpacity style={styles.button} onPress={handleAddQuiz}>
                <Text style={styles.buttonText}>Add Quiz</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles for the picker select dropdown
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: 'white',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },
    inputAndroid: {
        color: 'gray',
    },
});

export default AddQuiz;
