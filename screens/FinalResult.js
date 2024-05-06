import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const FinalResult = () => {
    const navigation = useNavigation(); // Navigation instance
    const route = useRoute(); // Route instance
    const score = route.params?.score ?? 'No score'; // Extract score from route params, default to 'No score' if not available
    const passingScore = route.params?.passingScore ?? 75; // Extract passing score from route params, default to 75

    const hasPassed = score >= passingScore; // Check if the user has passed
    let badgeEarned = null; // Initialize variable to hold badge type
    let badgeImage = require('../assets/question.png'); // Default badge image

    // Determine badge type and image based on score
    if (score >= 100) {
        badgeEarned = 'Platinum';
        badgeImage = require('../assets/platinum.png'); // Platinum badge image
    } else if (score >= 90) {
        badgeEarned = 'Gold';
        badgeImage = require('../assets/winner.png'); // Gold badge image
    } else if (score >= 80) {
        badgeEarned = 'Silver';
        badgeImage = require('../assets/2nd-place.png'); // Silver badge image
    } else if (score >= 70) {
        badgeEarned = 'Bronze';
        badgeImage = require('../assets/3rd-place.png'); // Bronze badge image
    }

    const styles = StyleSheet.create({
        // Styles for various components
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
        },
        badgeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
        },
        badgeText: {
            fontSize: 20,
            color: '#FFFFFF',
            marginRight: 10,
        },
        badgeImage: {
            width: 50,
            height: 50,
        },
    });

    const onPressHome = () => {
        navigation.navigate('HomeScreen'); // Navigate to home screen
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Result</Text>
            <Text style={styles.scoreText}>Your Score: {score}%</Text>
            <Text style={styles.resultMessage}>
                {hasPassed ? 'Congratulations! You passed!' : 'You did not pass. Try again!'}
            </Text>
            {badgeEarned && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>You earned a {badgeEarned} badge</Text>
                    <Image source={badgeImage} style={styles.badgeImage} />
                </View>
            )}
            <Image source={hasPassed ? require('../assets/happy.png') : require('../assets/sad.png')} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={onPressHome}>
                <Text style={styles.buttonText}>HOME</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FinalResult;
