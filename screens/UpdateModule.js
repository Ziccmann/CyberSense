import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {db} from '../backend/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../extras/ThemeContext';

const UpdateModule = ({route}) => {
    const {moduleId} = route.params;
    const navigation = useNavigation();
    const {theme} = useContext(ThemeContext);
    const [moduleDetails, setModuleDetails] = useState({
        ModuleName: '',
        ModuleDescription: '',
        ModuleDuration: '',
        ModuleContent: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            const moduleRef = doc(db, 'Modules', moduleId);
            try {
                const moduleSnap = await getDoc(moduleRef);
                if (moduleSnap.exists()) {
                    setModuleDetails(moduleSnap.data());
                } else {
                    Alert.alert('Error', 'Module not found.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error("Error fetching module details: ", error);
                Alert.alert('Error', 'Failed to fetch module details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchModuleDetails();
    }, [moduleId, navigation]);

    const onUpdateModule = async () => {
        if (!moduleDetails.ModuleName || !moduleDetails.ModuleDescription || !moduleDetails.ModuleDuration || !moduleDetails.ModuleContent) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        const moduleRef = doc(db, 'Modules', moduleId);
        try {
            await updateDoc(moduleRef, moduleDetails);
            Alert.alert('Success', 'Module updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error updating module: ", error);
            Alert.alert('Error', 'There was a problem updating the module.');
        }
    };

    // Define styles using a function to apply theme dynamically
    const getStyles = () => {
        return StyleSheet.create({
            container: {
                flex: 1,
                padding: 20,
                backgroundColor: theme === 'dark' ? '#0D1B2A' : '#FFF',
                alignItems: 'center',
                justifyContent: 'center',
            },
            title: {
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
                fontSize: 22,
                marginBottom: 20,
            },
            input: {
                width: '100%',
                padding: 10,
                marginVertical: 10,
                backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0',
                color: theme === 'dark' ? '#FFFFFF' : '#000000',
                borderRadius: 5,
                fontSize: 16,
            },
            label: {
            ontSize: 16,
            color: theme === 'dark' ? '#E0E1DD' : '#333333',
            marginBottom: 5,
            marginTop: 10,
            },
            button: {
                backgroundColor: '#3D556E',
                padding: 15,
                borderRadius: 5,
                width: '100%',
                marginTop: 20,
                alignItems: 'center',
            },
            buttonText: {
                color: '#FFFFFF',
                fontSize: 16,
            },
            imageView: {
                alignItems: 'center',
            },
            image: {
                width: 70,
                height: 50,
            },
        });
    };

    if (isLoading) {
        return <View style={getStyles().container}><ActivityIndicator size="large" color="#0000ff"/></View>;
    }

    const styles = getStyles();  // Apply dynamic styles

    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>Update Module</Text>
            <Text style={styles.label}>Module Name:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setModuleDetails({...moduleDetails, ModuleName: text})}
                value={moduleDetails.ModuleName}
                placeholder="Module Name"
                placeholderTextColor="#E0E1DD"
            />

            <Text style={styles.label}>Module Description:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setModuleDetails({...moduleDetails, ModuleDescription: text})}
                value={moduleDetails.ModuleDescription}
                placeholder="Module Description"
                placeholderTextColor="#E0E1DD"
            />

            <Text style={styles.label}>Module Duration:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setModuleDetails({...moduleDetails, ModuleDuration: text})}
                value={moduleDetails.ModuleDuration}
                placeholder="Module Duration"
                placeholderTextColor="#E0E1DD"
            />

            <Text style={styles.label}>Module Content:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setModuleDetails({...moduleDetails, ModuleContent: text})}
                value={moduleDetails.ModuleContent}
                placeholder="Module Content"
                placeholderTextColor="#E0E1DD"
            />
            <TouchableOpacity style={styles.button} onPress={onUpdateModule}>
                <Text style={styles.buttonText}>Update Module</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateModule;
