import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { db } from '../backend/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "firebase/auth";

const AddUser = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [dob, setDOB] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const onPressAdd = async () => {
        if (fullName && dob && email && role) {
            const auth = getAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, "temporaryPassword123");
                const user = userCredential.user;
                
                await setDoc(doc(db, 'UserMD', user.uid), {
                    UserFullName: fullName,
                    UserDOB: dob,
                    UserEmail: email,
                    UserRole: role,
                    AuthenticationID: user.uid
                });

                await sendPasswordResetEmail(auth, email);
                alert('User added successfully. Password reset email sent.');
                navigation.goBack();
            } catch (error) {
                alert(`Failed to add user: ${error.message}`);
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add User</Text>
            <TextInput
                placeholderTextColor="#E0E1DD" 
                style={styles.input}
                placeholder="Full Name"
                onChangeText={setFullName}
                value={fullName}
            />
            <TextInput
                placeholderTextColor="#E0E1DD" 
                style={styles.input}
                placeholder="Date of Birth"
                onChangeText={setDOB}
                value={dob}
            />
            <TextInput
                placeholderTextColor="#E0E1DD" 
                style={styles.input}
                placeholder="Email Address"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholderTextColor="#E0E1DD" 
                style={styles.input}
                placeholder="Role"
                onChangeText={setRole}
                value={role}
            />
            <TouchableOpacity style={styles.button} onPress={onPressAdd}>
                <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1B2A',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 22,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#1B263B',
        color: '#FFFFFF',
        borderRadius: 5,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default AddUser;
