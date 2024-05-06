import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../backend/firebase';
import { ThemeContext } from '../extras/ThemeContext'; // Import the ThemeContext

const QuestionList = ({ route }) => {
    const { moduleId, quizId } = route.params;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { theme } = useContext(ThemeContext); // Consume the theme from the ThemeContext
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
         // Fetch question lists from Firestore
        const fetchQuestions = async () => {
            if (moduleId && quizId) {
                const questionsRef = collection(db, 'Modules', moduleId, 'Quizzes', quizId, 'Questions');
                const querySnapshot = await getDocs(questionsRef);
                const fetchedQuestions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(fetchedQuestions);
            }
        };

        if (isFocused) {
            fetchQuestions();
        }
    }, [isFocused, moduleId, quizId]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => navigation.navigate('UpdateQuestionScreen', {
                questionId: item.id, // Passing the question ID to the Edit screen
                moduleId,
                quizId,
            })}
        >
            <Text style={styles.content}>{item.QuestionText}</Text>
        </TouchableOpacity>
    );

    // Dynamically adjust styles based on the theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme === 'dark' ? '#0D1B2A' : '#FFF',
        },
        itemContainer: {
            backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0',
            padding: 20,
            marginVertical: 8,
            borderRadius: 5,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFFFFF' : '#000',
            marginBottom: 20,
            alignSelf: 'center',
        },
        content: {
            fontSize: 16,
            color: theme === 'dark' ? '#E0E1DD' : '#333',
            marginBottom: 10,
        },
    });

    return (
        <View style={styles.container}>
            <FlatList 
                data={questions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={() => (
                    <Text style={styles.title}>{`Questions for Quiz: ${quizId}`}</Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.content}>No questions available.</Text>
                )}
            />
        </View>
    );
};

export default QuestionList;
