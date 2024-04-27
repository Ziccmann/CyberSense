import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {db} from '../backend/firebase';
import {deleteDoc, doc, getDoc, updateDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const UpdateQuiz = ({route}) => {
    const {quizId, moduleId} = route.params;
    const navigation = useNavigation();

    // State for the quiz fields
    const [quizDetails, setQuizDetails] = useState({
        QuizName: '',
        QuizDescription: '',
        QuizDifficulty: '',
        PassingScore: ''
    });

    // Fetch the current quiz details
    useEffect(() => {
        const fetchQuizDetails = async () => {
            const quizRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId);
            const quizSnap = await getDoc(quizRef);
            if (quizSnap.exists()) {
                setQuizDetails(quizSnap.data());
            } else {
                Alert.alert('Error', 'Quiz not found.');
                navigation.goBack();
            }
        };

        fetchQuizDetails();
    }, [quizId, moduleId, navigation]);

    const onUpdateQuiz = async () => {
        if (!quizDetails.QuizName || !quizDetails.QuizDescription || !quizDetails.QuizDifficulty || !quizDetails.PassingScore) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        const quizRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId);
        try {
            await updateDoc(quizRef, {
                QuizName: quizDetails.QuizName,
                QuizDescription: quizDetails.QuizDescription,
                QuizDifficulty: quizDetails.QuizDifficulty,
                PassingScore: parseInt(quizDetails.PassingScore, 10) // Convert the score to a number
            });
            Alert.alert('Success', 'Quiz updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error updating quiz: ", error);
            Alert.alert('Error', 'There was a problem updating the quiz.');
        }
    };

    const onDeleteQuiz = async () => {
        // Confirmation dialog before proceeding with deletion
        Alert.alert(
            "Delete Quiz",
            "Are you sure you want to delete this quiz?",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Yes",
                    onPress: async () => {
                        const quizRef = doc(db, 'Modules', moduleId, 'Quizzes', quizId);
                        try {
                            await deleteDoc(quizRef);
                            Alert.alert('Success', 'Quiz deleted successfully!');
                            navigation.goBack();  // Navigate back after successful deletion
                        } catch (error) {
                            console.error('Error deleting quiz:', error);
                            Alert.alert('Error', 'Failed to delete the quiz.');
                        }
                    }
                },
            ],
            {cancelable: false}  // This will require the user to choose an option without dismissing the alert on tap outside
        );
    };


    const handleChange = (name, value) => {
        setQuizDetails(prev => ({...prev, [name]: value}));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Quiz</Text>

            <Text style={styles.label}>Quiz Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Quiz Name"
                onChangeText={(text) => handleChange('QuizName', text)}
                value={quizDetails.QuizName}
            />

            <Text style={styles.label}>Quiz Description:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Quiz Description"
                onChangeText={(text) => handleChange('QuizDescription', text)}
                value={quizDetails.QuizDescription}
            />

            <Text style={styles.label}>Quiz Difficulty:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Quiz Difficulty"
                onChangeText={(text) => handleChange('QuizDifficulty', text)}
                value={quizDetails.QuizDifficulty}
            />

            <Text style={styles.label}>Passing Score:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Passing Score"
                keyboardType="numeric"
                onChangeText={(text) => handleChange('PassingScore', text)}
                value={quizDetails.PassingScore.toString()}
            />

            <TouchableOpacity style={styles.button} onPress={onUpdateQuiz}>
                <Text style={styles.buttonText}>Update Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onDeleteQuiz}>
                <Text style={styles.buttonText}>Delete Quiz</Text>
            </TouchableOpacity>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D1B2A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 22,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#1B263B',
        color: '#FFFFFF',
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        color: '#E0E1DD',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#3D556E',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#F44336', // Red color for the delete button
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        padding: 15,
        width: '100%',
    },
});

export default UpdateQuiz;
