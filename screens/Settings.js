// Settings.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { ThemeContext } from '../extras/ThemeContext';
import { useNavigation } from '@react-navigation/native';


const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const styles = getDynamicStyles(theme); // Use dynamic styles based on theme

    const onToggleTheme = () => {
        toggleTheme();
    };

    const goToChangePassword = () => {
        navigation.navigate('ChangePasswordScreen'); // Navigate to UsersUpdate screen
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
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.button} onPress={goToChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <View style={styles.themeToggle}>
                <Text style={styles.themeText}>Dark Theme</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={onToggleTheme}
                    value={theme === 'dark'}
                />
            </View>
        </View>
    );
};

// Function to return styles based on the theme
const getDynamicStyles = (theme) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#0D1B2A' : '#FFF', // Dark background for 'dark' theme
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#E0E1DD' : '#000', // Light text for 'dark' theme
      marginBottom: 20,
      textAlign: 'center',
    },
    changePasswordText: {
      color: isDark ? '#FFFFFF' : '#000', // Light text for 'dark' theme
      fontSize: 16,
      textAlign: 'center',
      padding: 10,
      marginTop: 20,
    },
    themeToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    themeText: {
      color: isDark ? '#FFFFFF' : '#000', // Light text for 'dark' theme
      fontSize: 16,
    },
    button: {
      backgroundColor: isDark ? '#1B263B' : '#DDD', // Button color based on theme
      width: '100%', // Button width
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
  },
  buttonText: {
      color: isDark ? '#FFFFFF' : '#000', // Button text color based on theme
      fontSize: 16,
  },
  imageView: {
    alignItems: 'center',
},
image: {
    width: 70,
    height: 50,
},
    // ... other styles
  });
};

export default Settings;
