import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db } from '../backend/firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { ThemeContext } from '../extras/ThemeContext'; // Import the ThemeContext

// Main component for adding a question
const AddQuestion = () => {
    const [moduleName, setModuleName] = useState('');
    const [quizName, setQuizName] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState('');
    const [modules, setModules] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const { theme } = useContext(ThemeContext); // Consume the theme from the ThemeContext

    useEffect(() => {
        // Fetch modules when component mounts
        const fetchModules = async () => {
            const modulesArray = [];
            const snapshot = await getDocs(collection(db, "Modules"));
            snapshot.forEach(doc => {
                modulesArray.push({ label: doc.data().ModuleName, value: doc.id });
            });
            setModules(modulesArray);
        };
        fetchModules();
    }, []);

    useEffect(() => {
        // Fetch quizzes when moduleName changes
        const fetchQuizzes = async () => {
            if (!moduleName) return;
            const quizzesArray = [];
            const snapshot = await getDocs(collection(db, `Modules/${moduleName}/Quizzes`));
            snapshot.forEach(doc => {
                quizzesArray.push({ label: doc.data().QuizName, value: doc.id });
            });
            setQuizzes(quizzesArray);
        };
        fetchQuizzes();
    }, [moduleName]);

    const handleAddQuestion = async () => {
        // Validate inputs and add question to database
        if (!quizName || !moduleName || !questionText || options.some(option => option.trim() === '') || !correctOption) {
            Alert.alert('Error', 'Please ensure all fields are filled and all options are provided.');
            return;
        }

        const questionRef = doc(db, `Modules/${moduleName}/Quizzes/${quizName}/Questions`, questionText);

        try {
            await setDoc(questionRef, {
                QuestionText: questionText,
                Options: options,
                CorrectOption: correctOption
            });
            Alert.alert('Success', 'Question added successfully!');
            // Reset form fields after successful addition
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectOption('');
        } catch (error) {
            console.error("Error adding question: ", error);
            Alert.alert('Error', 'Failed to add question: ' + error.message);
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
            marginTop: 10,
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
            fontSize: 22,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFFFFF' : '#000',
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
            <Text style={styles.title}>Add a Question</Text>
            {/* Dropdown to select module */}
            <RNPickerSelect
                onValueChange={(value) => setModuleName(value)}
                items={modules}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a module...", value: null }}
            />
            {/* Dropdown to select quiz */}
            <RNPickerSelect
                onValueChange={(value) => setQuizName(value)}
                items={quizzes}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a quiz...", value: null }}
            />
            {/* Input field for question text */}
            <TextInput style={styles.input} placeholder="Question Text" placeholderTextColor={styles.placeholderTextColor} value={questionText} onChangeText={setQuestionText} />
            {/* Input fields for options */}
            {options.map((option, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor={styles.placeholderTextColor}
                    value={option}
                    onChangeText={text => {
                        let newOptions = [...options];
                        newOptions[index] = text;
                        setOptions(newOptions);
                    }}
                />
            ))}
            {/* Input field for correct option */}
            <TextInput style={styles.input} placeholder="Correct Option" placeholderTextColor={styles.placeholderTextColor} value={correctOption} onChangeText={setCorrectOption} />
            {/* Button to add question */}
            <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
                <Text style={styles.buttonText}>Add Question</Text>
            </TouchableOpacity>
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30,
    },
    inputAndroid: {
        color: 'gray',
    },
});

export default AddQuestion;
