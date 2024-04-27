import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../backend/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const UsersUpdate = ({ route, navigation }) => {
    const { userData } = route.params;
    const [fullName, setFullName] = useState(userData.UserFullName);
    const [dob, setDOB] = useState(userData.UserDOB);
    const [email, setEmail] = useState(userData.UserEmail);
    const [role, setRole] = useState(userData.UserRole);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            // No need to re-fetch roles here since they are now static
            setFullName(userData.UserFullName);
            setDOB(userData.UserDOB);
            setEmail(userData.UserEmail);
            setRole(userData.UserRole);
        }
    }, [isFocused, userData]);

    const updateUserData = async () => {
        if (fullName && dob && role) {
            try {
                await updateDoc(doc(db, 'UserMD', userData.id), {
                    UserFullName: fullName,
                    UserDOB: dob,
                    UserRole: role,
                });
                alert('User updated successfully');
                navigation.goBack();
            } catch (error) {
                console.error('Failed to update user:', error);
                alert('Failed to update user');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const deleteUser = async () => {
        try {
            await deleteDoc(doc(db, 'UserMD', userData.id));
            alert('User deleted successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const rolesOptions = [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Full Name:</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDOB} />
            <Text style={styles.label}>Email:</Text>
            <TextInput style={[styles.input, styles.nonEditable]} value={email} editable={false} />
            <Text style={styles.label}>Role:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                value={role}
                onValueChange={(value) => setRole(value)}
                items={rolesOptions}
                placeholder={{ label: "Select a role...", value: null }}
            />
            <TouchableOpacity style={styles.updateButton} onPress={updateUserData}>
                <Text style={styles.buttonText}>Update User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteUser}>
                <Text style={styles.buttonText}>Delete User</Text>
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
    label: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1B263B',
        color: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 16,
        width: '100%',
    },
    nonEditable: {
        opacity: 0.5,
    },
    updateButton: {
        backgroundColor: '#3D556E',
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: '#F44336',
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

const pickerSelectStyles = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: '#1B263B',
        marginBottom: 10,
    },
    inputAndroid: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: '#1B263B',
        marginBottom: 10,
    },
};


export default UsersUpdate;
