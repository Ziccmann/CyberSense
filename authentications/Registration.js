import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../assets/stylesheets/style';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../backend/firebase';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const Registration = ({ route, navigation }) => {
    const [fullname, setFullName] = useState('');
    const [dob, setDOB] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Automatically clear error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const onRegister = async () => {
        if (!fullname || !dob || !email || !password || !confirmPassword) {
            setErrorMessage('Please fill out all fields.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }
    
        const dobParts = dob.split('/');
        if (dobParts.length !== 3 || dobParts[0].length !== 2 || dobParts[1].length !== 2 || dobParts[2].length !== 4) {
            setErrorMessage('Invalid DOB format. Please use DD/MM/YYYY.');
            return;
        }
        const day = parseInt(dobParts[0], 10);
        const month = parseInt(dobParts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
        const year = parseInt(dobParts[2], 10);
        const dobDate = new Date(year, month, day);
    
        if (dobDate.getFullYear() !== year || dobDate.getMonth() !== month || dobDate.getDate() !== day) {
            setErrorMessage('Invalid DOB. Please check the date.');
            return;
        }
    
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setDoc(doc(db, 'UserMD', user.uid), {
                    UserFullName: fullname,
                    UserDOB: `${dobParts[0]}/${dobParts[1]}/${dobParts[2]}`,
                    AuthenticationID: user.uid,
                    UserEmail: email,
                    UserRole: role || "User"
                }).then(() => {
                    alert('Registration successful');
                    navigation.navigate('LoginScreen');
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                    setErrorMessage("Error writing user data to database.");
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    setErrorMessage('The email address is already in use.');
                } else {
                    setErrorMessage('Failed to register: ' + error.message);
                }
            });
    };
    
    
    const onLogin = () => {
        navigation.navigate('LoginScreen');
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
                placeholder='Full name'
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder='Email'
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder='DOB (DD/MM/YYYY)'
                onChangeText={setDOB}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder='Confirm password'
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={onRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInfo} onPress={onLogin}>
                <Text style={styles.buttonInfoText}>Already have an account? Click here to login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Registration;
