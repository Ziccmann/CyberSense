import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const FinalResult = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const score = route.params?.score ?? 'No score';
    const passingScore = route.params?.passingScore ?? 75;

    const hasPassed = score >= passingScore;
    let badgeEarned = null;
    let badgeImage = require('../assets/question.png'); // Default image for no badge

    if (score >= 100) {
        badgeEarned = 'Platinum';
        badgeImage = require('../assets/platinum.png'); // Replace with actual platinum badge image
    } else if (score >= 90) {
        badgeEarned = 'Gold';
        badgeImage = require('../assets/winner.png'); // Replace with actual gold badge image
    } else if (score >= 80) {
        badgeEarned = 'Silver';
        badgeImage = require('../assets/2nd-place.png'); // Replace with actual silver badge image
    } else if (score >= 70) {
        badgeEarned = 'Bronze';
        badgeImage = require('../assets/3rd-place.png'); // Replace with actual bronze badge image
    }

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
        navigation.navigate('HomeScreen');
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
