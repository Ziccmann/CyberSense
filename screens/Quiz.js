import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../backend/firebase';

const Quiz = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { difficulty } = route.params;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch questions from Firestore
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const modulesQuery = query(collection(db, 'Modules'), where('ModuleDifficulty', '==', difficulty));
                const modulesSnapshot = await getDocs(modulesQuery);
                let fetchedQuestions = [];
                for (const moduleDoc of modulesSnapshot.docs) {
                    const quizzesSnapshot = await getDocs(collection(db, `Modules/${moduleDoc.id}/Quizzes`));
                    for (const quizDoc of quizzesSnapshot.docs) {
                        const questionsSnapshot = await getDocs(collection(db, `Modules/${moduleDoc.id}/Quizzes/${quizDoc.id}/Questions`));
                        questionsSnapshot.forEach(questionDoc => {
                            fetchedQuestions.push({ ...questionDoc.data(), id: questionDoc.id });
                        });
                    }
                }
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
                Alert.alert('Error', 'There was an issue loading the questions.');
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [difficulty]);

    const handleAnswerSelection = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const navigateToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const navigateToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishQuiz = () => {
        const correctCount = questions.reduce((acc, question) => {
            return acc + (selectedAnswers[question.id] === question.CorrectOption ? 1 : 0);
        }, 0);
        const scorePercentage = Math.round((correctCount / questions.length) * 100);
        setScore(scorePercentage);  // Update the state with the final score percentage
        navigation.navigate('QuickFinalResultScreen', { score: scorePercentage });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFFFFF" />
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
                        key={index}
                        style={[
                            styles.option,
                            selectedAnswers[currentQuestion.id] === option ? styles.selectedOption : styles.option
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
                    <Text style={styles.navigationButtonText}>
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                    </Text>
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

export default Quiz;
