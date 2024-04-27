import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {db} from '../backend/firebase';
import {deleteDoc, doc, getDoc, updateDoc} from 'firebase/firestore';
import {ThemeContext} from '../extras/ThemeContext'; // Import the ThemeContext

const UpdateQuestion = ({route}) => {
    const {questionId, moduleId, quizId} = route.params;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const {theme} = useContext(ThemeContext); // Consume the theme from the ThemeContext
    const [questionDetails, setQuestionDetails] = useState({
        QuestionText: '',
        Options: ['', '', '', ''],
        CorrectOption: '',
    });

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            if (!isFocused) return;
            const questionRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId, 'Questions', questionId);
            const docSnap = await getDoc(questionRef);
            if (docSnap.exists()) {
                setQuestionDetails(docSnap.data());
            } else {
                Alert.alert('Error', 'No such question found!');
                navigation.goBack();
            }
        };

        fetchQuestionDetails();
    }, [isFocused, moduleId, quizId, questionId, navigation]);

    const handleUpdateQuestion = async () => {
        if (
            !questionDetails.QuestionText.trim() ||
            questionDetails.Options.some(opt => !opt.trim()) ||
            !questionDetails.CorrectOption.trim()
        ) {
            Alert.alert('Error', 'All fields must be filled in.');
            return;
        }

        try {
            const questionRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId, 'Questions', questionId);
            await updateDoc(questionRef, questionDetails);
            Alert.alert('Success', 'Question updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating question:', error);
            Alert.alert('Error', 'There was an error updating the question.');
        }
    };

    const handleOptionChange = (text, index) => {
        const newOptions = [...questionDetails.Options];
        newOptions[index] = text;
        setQuestionDetails({...questionDetails, Options: newOptions});
    };

    const onDeleteQuestion = async () => {
        Alert.alert("Delete Question", "Are you sure you want to delete this question?", [
            {text: "Cancel"},
            {
                text: "Yes", onPress: async () => {
                    try {
                        const questionRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId, 'Questions', questionId);
                        await deleteDoc(questionRef);
                        Alert.alert('Success', 'Question deleted successfully!');
                        navigation.goBack();
                    } catch (error) {
                        console.error('Error deleting question:', error);
                        Alert.alert('Error', 'Failed to delete the question.');
                    }
                }
            },
        ]);
    };

    // Dynamically adjust styles based on the theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme === 'dark' ? '#0D1B2A' : '#FFF',
        },
        title: {
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            color: theme === 'dark' ? '#E0E1DD' : '#333333',
            marginBottom: 5,
            marginTop: 10,
        },
        input: {
            backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0',
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
            marginBottom: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
            height: 30,
            fontSize: 16,
        },
        button: {
            backgroundColor: theme === 'dark' ? '#3D556E' : '#1E90FF',
            width: '100%',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonText: {
            color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF',
            fontSize: 16,
        },
        deleteButton: {
            backgroundColor: '#F44336',
            padding: 15,
            borderRadius: 5,
            width: '100%',
            marginTop: 20,
            alignItems: 'center',
        },
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Update Question</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setQuestionDetails({...questionDetails, QuestionText: text})}
                value={questionDetails.QuestionText}
                placeholder="Enter the question text"
            />
            {questionDetails.Options.map((option, index) => (
                <View key={index}>
                    <Text style={styles.label}>{`Option ${index + 1}:`}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleOptionChange(text, index)}
                        value={option}
                        placeholder={`Enter option ${index + 1}`}
                    />
                </View>
            ))}
            <Text style={styles.label}>Correct Option:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setQuestionDetails({...questionDetails, CorrectOption: text})}
                value={questionDetails.CorrectOption}
                placeholder="Enter the correct option"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateQuestion}>
                <Text style={styles.buttonText}>Update Question</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDeleteQuestion}>
                <Text style={styles.buttonText}>Delete Question</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default UpdateQuestion;
