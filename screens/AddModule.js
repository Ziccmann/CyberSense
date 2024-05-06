import React, { useContext, useState } from 'react';
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../backend/firebase';
import { doc, setDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../extras/ThemeContext';

// Main component for adding a module
const AddModule = () => {
    // State hooks for form inputs
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [moduleDuration, setModuleDuration] = useState('');
    const [moduleDifficulty, setModuleDifficulty] = useState('');
    const [moduleContent, setModuleContent] = useState('');

    // Hooks to use navigation and theming context
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const styles = getDynamicStyles(theme);

    // Function to handle the module addition
    const onPressAddModule = async () => {
        // Check if all fields are filled
        if (moduleName && moduleDescription && moduleDuration && moduleDifficulty) {
            // Creating a reference to a new document in the 'Modules' collection with the moduleName as the document ID
            const moduleRef = doc(db, 'Modules', moduleName);
            try {
                // Attempt to set the document with form data
                await setDoc(moduleRef, {
                    ModuleName: moduleName,
                    ModuleDescription: moduleDescription,
                    ModuleDuration: moduleDuration,
                    ModuleDifficulty: moduleDifficulty,
                    ModuleContent: moduleContent
                });
                // Success feedback and navigating back to the modules screen
                alert('Module added successfully!');
                navigation.navigate('ModulesScreen', { moduleAdded: true });
            } catch (error) {
                // Error handling
                console.error("Error adding module: ", error);
                alert('Error adding module');
            }
        } else {
            // Alert if not all fields are filled
            alert('Please fill in all fields.');
        }
    };

    // Component rendering
    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
            <Text style={styles.title}>Add Module</Text>
            {/* Inputs to capture module data */}
            <TextInput style={styles.input} placeholder="Module Name" placeholderTextColor={styles.placeholderTextColor}
                       onChangeText={setModuleName}
                       value={moduleName}/>
            <TextInput style={styles.input} placeholder="Module Description"
                       placeholderTextColor={styles.placeholderTextColor}
                       onChangeText={setModuleDescription}
                       value={moduleDescription}/>
            <TextInput style={styles.input} placeholder="Module Duration"  placeholderTextColor={styles.placeholderTextColor}
            onChangeText={setModuleDuration}
            value={moduleDuration}/>
            {/* Picker select for difficulty level */}
            <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: "Select difficulty...", value: null}}
                onValueChange={(value) => setModuleDifficulty(value)}
                items={[
                    {label: "Beginner", value: "Beginner"},
                    {label: "Pro", value: "Pro"},
                    {label: "Expert", value: "Expert"},
                ]}
            />
            {/* Input for content URL */}
            <TextInput style={styles.input} placeholder="Content URL" placeholderTextColor={styles.placeholderTextColor}
            onChangeText={setModuleContent}
            value={moduleContent}/>
            {/* Button to trigger module addition */}
            <TouchableOpacity style={styles.addButton} onPress={onPressAddModule}>
                <Text style={styles.addButtonText}>Add Module</Text>
            </TouchableOpacity>
        </View>
    );
};

// Function to get styles dynamically based on the theme
const getDynamicStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
        // Styles are omitted for brevity
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDark ? '#0D1B2A' : '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            width: '100%',
            padding: 10,
            marginVertical: 10,
            backgroundColor: isDark ? '#1B263B' : '#E0E0E0',
            color: isDark ? '#FFFFFF' : '#000',
            borderRadius: 5,
        },
        imageView: {
            alignItems: 'center',
        },
        image: {
            width: 70,
            height: 50,
        },
        addButton: {
            backgroundColor: isDark ? '#4CAF50' : '#8BC34A', // Dark or light add button
            padding: 10,
            width: '100%',
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        addButtonText: {
            color: isDark ? '#FFFFFF' : '#000',
            fontSize: 16,
        },
        title: {
            color: isDark ? '#FFFFFF' : '#000',
            fontSize: 22,
            marginBottom: 20,
        },
        placeholderTextColor: isDark ? '#E0E1DD' : '#C7C7CD',
    });
};

// Styles for the RNPickerSelect component
const pickerSelectStyles = StyleSheet.create({
    // Styles are omitted for brevity
    inputIOS: {
        color: 'white',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },
    inputAndroid: {
        color: 'gray',
    },
});

export default AddModule;
