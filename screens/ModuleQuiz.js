import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {arrayUnion, collection, doc, getDocs, serverTimestamp, setDoc} from 'firebase/firestore';
import {auth, db} from '../backend/firebase';

const ModuleQuiz = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {moduleId, quizId} = route.params;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const questionsSnapshot = await getDocs(collection(db, 'Modules', moduleId, 'Quizzes', quizId, 'Questions'));
                const fetchedQuestions = questionsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
                Alert.alert('Error', 'There was an issue loading the questions.');
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [moduleId, quizId]);

    const handleAnswerSelection = (questionId, option) => {
        setSelectedAnswers(prev => ({...prev, [questionId]: option}));
    };

    const navigateToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const navigateToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };


    const finishQuiz = async () => {
        const correctAnswers = questions.filter(question => selectedAnswers[question.id] === question.CorrectOption);
        const scorePercentage = Math.round((correctAnswers.length / questions.length) * 100);
        const badgeEarned = getBadge(scorePercentage); // You'll define this function based on your badge logic

        const user = auth.currentUser; // Make sure you have access to the authenticated user
        if (user) {
            const userProgressRef = doc(db, 'UserMD', user.uid, 'Progress', moduleId);
            const progressUpdate = {
                CompletedModules: arrayUnion(moduleId),
                ModuleScores: {
                    [moduleId]: scorePercentage
                },
                LastCompleted: serverTimestamp(),
                BadgesEarned: badgeEarned, // Assuming you only store the latest badge
                // Add other fields as necessary
            };

            try {
                // If you want to create a new document for each module completion
                await setDoc(userProgressRef, progressUpdate, {merge: true});

                // Navigate to the results page with the necessary parameters
                navigation.navigate('FinalResultsScreen', {
                    score: scorePercentage,
                    // Include other data as needed
                });
            } catch (error) {
                console.error('Error saving quiz results: ', error);
                Alert.alert('Error', 'There was a problem saving your quiz results.');
            }
        } else {
            Alert.alert('Error', 'You must be logged in to save your progress.');
        }
    };

    // Call this function to get the badge based on the score
    const getBadge = (score) => {
        if (score >= 100) return 'Platinum';
        if (score >= 90) return 'Gold';
        if (score >= 80) return 'Silver';
        if (score >= 70) return 'Bronze';
        return null; // or return 'Participant' or any other default badge
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>No questions available.</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.QuestionText}</Text>
            <View style={styles.optionsContainer}>
                {currentQuestion.Options.map((option, index) => (
                    <TouchableOpacity
                        key={`${currentQuestionIndex}-${index}`}
                        style={[
                            styles.option,
                            selectedAnswers[currentQuestion.id] === option ? styles.selectedOption : {},
                        ]}
                        onPress={() => handleAnswerSelection(currentQuestion.id, option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.navigationButtons}>
                {currentQuestionIndex > 0 && (
                    <TouchableOpacity
                        style={styles.prevButton}
                        onPress={navigateToPreviousQuestion}
                    >
                        <Text style={styles.navigationButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={navigateToNextQuestion}
                >
                    <Text
                        style={styles.navigationButtonText}>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D1B2A',
    },
    questionText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        width: '100%',
        marginVertical: 10,
    },
    option: {
        backgroundColor: '#1B263B',
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#4CAF50',
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    messageText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    prevButton: {
        backgroundColor: '#3D556E',
        padding: 10,
        borderRadius: 5,
    },
    nextButton: {
        backgroundColor: '#3D556E',
        padding: 10,
        borderRadius: 5,
    },
    navigationButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default ModuleQuiz;
