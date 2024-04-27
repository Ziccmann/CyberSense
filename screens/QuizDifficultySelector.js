import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../backend/firebase';
import { collection, getDocs } from 'firebase/firestore';

const QuizDifficultySelector = () => {
    const navigation = useNavigation();
    const [difficulties, setDifficulties] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        const fetchDifficulties = async () => {
            try {
                const uniqueDifficulties = new Set();
                const modulesSnapshot = await getDocs(collection(db, "Modules"));
                for (const moduleDoc of modulesSnapshot.docs) {
                    const quizzesSnapshot = await getDocs(collection(db, `Modules/${moduleDoc.id}/Quizzes`));
                    quizzesSnapshot.forEach((quizDoc) => {
                        uniqueDifficulties.add(quizDoc.data().QuizDifficulty);
                    });
                }
                setDifficulties(Array.from(uniqueDifficulties).map(difficulty => ({ label: difficulty, value: difficulty })));
            } catch (error) {
                console.error("Error fetching difficulties:", error);
                alert('Failed to fetch difficulties');
            }
        };
        fetchDifficulties();
    }, []);

    const onPressStart = () => {
        if (selectedDifficulty) {
            console.log("Selected Difficulty:", selectedDifficulty); // Debug: Check selected difficulty
            navigation.navigate('QuizScreen', { difficulty: selectedDifficulty });
        } else {
            alert('Please select a difficulty to start the quiz.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/test.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.buttonText}>How good do you think you understand Cybersecurity?</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedDifficulty(value)}
                items={difficulties}
                placeholder={{ label: "Select difficulty...", value: null }}
                style={pickerSelectStyles}
            />
            <TouchableOpacity style={styles.button} onPress={onPressStart}>
                <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles remain the same as provided earlier

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D1B2A',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    image: {
        width: 300,
        height: 300,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1B263B',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
        backgroundColor: '#1B263B',
        marginTop: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'white',
        paddingRight: 30,
        backgroundColor: '#1B263B',
        marginTop: 20,
    },
    iconContainer: {
        top: 5,
        right: 15,
    },
};

export default QuizDifficultySelector;
