import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const QuickFinalResult = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // Retrieve the score and the passingScore from route.params
    const score = route.params?.score ?? 'No score';
    const passingScore = route.params?.passingScore ?? 75; // Default to 50 if not provided

    const hasPassed = score >= passingScore;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0D1B2A',
        },
        headerText: {
            fontSize: 24,
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: 30,
        },
        scoreText: {
            fontSize: 22,
            color: hasPassed ? '#00FF00' : '#FF0000', // Green for pass, red for fail
            fontWeight: 'bold',
            marginBottom: 10,
        },
        resultMessage: {
            fontSize: 18,
            color: '#FFFFFF',
            marginBottom: 20,
        },
        containerBanner: {
            marginBottom: 20,
        },
        image: {
          width: 200, 
          height: 200, 
          resizeMode: 'contain' 
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

    const onPressHome = () => {
        navigation.navigate('HomeScreen');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Result</Text>
            {/* Display the score as a whole number percentage */}
            <Text style={styles.scoreText}>Your Score: {score}%</Text>
            <Text style={styles.resultMessage}>
                {hasPassed ? 'Congratulations! You passed!' : 'You did not pass. Try again!'}
            </Text>
            <Image source={hasPassed ? require('../assets/happy.png') : require('../assets/sad.png')} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={onPressHome}>
                <Text style={styles.buttonText}>HOME</Text>
            </TouchableOpacity>
        </View>
    );
};

export default QuickFinalResult;
