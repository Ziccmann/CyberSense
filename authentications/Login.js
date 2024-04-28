import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../assets/stylesheets/style';
import * as store from '../extras/DataFunctions';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../backend/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Login = ({ route, navigation }) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [attemptCounts, setAttemptCounts] = useState({});

    // Function to clear error message
    useEffect(() => {
        let timer;
        if (errorMessage) {
            timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);  // Clears the error message after 5 seconds
        }
        return () => clearTimeout(timer);  // Clear the timer when the component unmounts or the errorMessage changes
    }, [errorMessage]);

    // Check if user is already logged in
    const getUserObject = async () => {
        const data = await store.dataRetrieve();
        if (data) {
            const dataReturn = JSON.parse(data);
            if (dataReturn.loggedIn) {
                navigation.navigate('HomeScreen');
                alert('Logged in successfully')
            }
        }
    };

    useEffect(() => {
        getUserObject();
    }, [navigation]);

    const onPressLoginUser = async () => {
        if (!email || !password) {
            setErrorMessage('Email and password fields cannot be empty.');
            return;
        }

        const userAttempts = attemptCounts[email] || { count: 0, timestamp: Date.now() };
        if (userAttempts.count >= 6) {
            const timePassed = Date.now() - userAttempts.timestamp;
            if (timePassed < 5 * 60 * 1000) {
                setErrorMessage(`Too many attempts. Please try again in 5 minutes.`);
                return;
            }
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user.uid;
                const q = query(collection(db, "UserMD"), where("AuthenticationID", "==", user));
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs.map(doc => doc.data())[0];

                const data = {
                    UserFullName: userData.UserFullName,
                    UserEmail: userData.UserEmail,
                    UserDOB: userData.UserDOB,
                    UserRole: userData.UserRole,
                    AuthenticationID: userData.AuthenticationID,
                    loggedIn: true
                };
                await store.dataStorage(data)
                navigation.navigate('HomeScreen');
                alert('Logged in successfully')
            })
            .catch(error => {
                const newAttempts = {
                    count: userAttempts.count + 1,
                    timestamp: Date.now()
                };
                setAttemptCounts({ ...attemptCounts, [email]: newAttempts });
                setErrorMessage('Invalid login details. Please try again.');
            });
    };

    const onPressRegister = () => {
        navigation.navigate('RegistrationScreen');
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>CYBERSENSE</Text>
            <TextInput
                style={styles.input}
                placeholder='Email'
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={onPressLoginUser}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInfo} onPress={onPressRegister}>
                <Text style={styles.buttonInfoText}>Do not have an account? Click here to Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;
