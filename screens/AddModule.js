import React, {useContext, useState} from 'react';
import {StyleSheet, Text, Image, TextInput, TouchableOpacity, View} from 'react-native';
import {db} from '../backend/firebase';
import {doc, setDoc} from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../extras/ThemeContext'; // Make sure to import useNavigation


const AddModule = () => {
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [moduleDuration, setModuleDuration] = useState('');
    const [moduleDifficulty, setModuleDifficulty] = useState('');
    const [moduleContent, setModuleContent] = useState('');
    const navigation = useNavigation();
    const {theme} = useContext(ThemeContext);
    const styles = getDynamicStyles(theme);

    const onPressAddModule = async () => {
        if (moduleName && moduleDescription && moduleDuration && moduleDifficulty) {
            const moduleRef = doc(db, 'Modules', moduleName);
            try {
                await setDoc(moduleRef, {
                    ModuleName: moduleName,
                    ModuleDescription: moduleDescription,
                    ModuleDuration: moduleDuration,
                    ModuleDifficulty: moduleDifficulty,
                    ModuleContent: moduleContent
                });
                alert('Module added successfully!');
                navigation.navigate('ModulesScreen', {moduleAdded: true});
            } catch (error) {
                console.error("Error adding module: ", error);
                alert('Error adding module');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };
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
            {/* Rest of the UI elements using styles dynamically */}
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
            <TextInput style={styles.input} placeholder="Content URL" placeholderTextColor={styles.placeholderTextColor}
            onChangeText={setModuleContent}
            value={moduleContent}/>
            <TouchableOpacity style={styles.addButton} onPress={onPressAddModule}>
                <Text style={styles.addButtonText}>Add Module</Text>
            </TouchableOpacity>
        </View>
    );
};

const getDynamicStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
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

const pickerSelectStyles = StyleSheet.create({
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
