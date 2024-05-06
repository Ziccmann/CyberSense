import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../backend/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const EditQuestions = ({ route }) => {
  const { moduleData, quizData } = route.params; // Extract moduleData and quizData from route parameters
  const [questions, setQuestions] = useState([]); // State to hold questions
  const navigation = useNavigation(); // Navigation instance
  const isFocused = useIsFocused(); // Check if screen is focused

  useEffect(() => {
    // Function to fetch questions from Firestore
    const fetchQuestions = async () => {
      const questionsQuery = query(
        collection(db, 'Modules', moduleData.id, 'Quizzes', quizData.id, 'Questions')
      ); // Query to fetch questions from Firestore
      const querySnapshot = await getDocs(questionsQuery); // Fetch documents from Firestore
      const fetchedQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })); // Map documents to array of question objects
      setQuestions(fetchedQuestions); // Update questions state with fetched questions
    };

    // Fetch questions when the screen is focused
    if (isFocused) {
      fetchQuestions();
    }
  }, [isFocused, moduleData.id, quizData.id]); // Dependency array includes isFocused, moduleData.id, and quizData.id

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Questions for {quizData.QuizName}</Text>

      {/* Render each question as a TouchableOpacity */}
      {questions.map((question, index) => (
        <TouchableOpacity
          key={question.id}
          style={styles.listItem}
          onPress={() => navigation.navigate('EditQuestionDetailScreen', {
            questionData: question,
            ModuleName: moduleData.ModuleName,
            QuizName: quizData.QuizName
          })}
        >
          <Text style={styles.listItemText}>{question.QuestionText}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0D1B2A',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#1B263B',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  listItemText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default EditQuestions;
