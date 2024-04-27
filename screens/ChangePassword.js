import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { ThemeContext } from '../extras/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you have this installed

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useContext(ThemeContext);
  const styles = getDynamicStyles(theme);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
    return () => clearTimeout(timer);  // Cleanup the timer when component unmounts or errorMessage changes
  }, [errorMessage]);


   // Function to toggle password visibility
   const toggleOldPasswordVisibility = () => {
    setIsOldPasswordVisible(!isOldPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleChangePassword = async () => {
    setErrorMessage(''); // Clear any existing errors

    if (!oldPassword || !newPassword || !confirmPassword) {
        setErrorMessage("Please fill in all fields.");
        return;
    }
    
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMessage("New password must be different from the old password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (!user) {
      setErrorMessage("No user is currently signed in.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Your password has been changed successfully.");
    } catch (error) {
      console.log(error); // Log full error to see all details during debugging
      switch (error.code) {
        case 'auth/wrong-password':
          setErrorMessage("The old password is incorrect.");
          break;

        default:
          setErrorMessage("The old password is incorrect.");
          break;
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Old Password"
          secureTextEntry={!isOldPasswordVisible} // Use the state to control the text visibility
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleOldPasswordVisibility}
        >
          <Icon
            name={isOldPasswordVisible ? 'eye' : 'eye-slash'} // Change the icon based on the state
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry={!isNewPasswordVisible} // Use the state to control the text visibility
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleNewPasswordVisibility}
        >
          <Icon
            name={isNewPasswordVisible ? 'eye' : 'eye-slash'} // Change the icon based on the state
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry={!isConfirmPasswordVisible} // Use the state to control the text visibility
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleConfirmPasswordVisibility}
        >
          <Icon
            name={isConfirmPasswordVisible ? 'eye' : 'eye-slash'} // Change the icon based on the state
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#E0E1DD' : '#000',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: isDark ? '#E0E1DD' : '#CCC',
      backgroundColor: isDark ? '#12232E' : '#FFF',
      color: isDark ? '#E0E1DD' : '#333',
      borderRadius: 5,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 10,
      textAlign: 'center',
    },
    button: {
      backgroundColor: isDark ? '#1B263B' : '#4CAF50',
      padding: 15,
      borderRadius: 5,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
      },
      input: {
        flex: 1,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: isDark ? '#E0E1DD' : '#CCC',
        backgroundColor: isDark ? '#12232E' : '#FFF',
        color: isDark ? '#E0E1DD' : '#333',
        borderRadius: 5,
        paddingRight: 40, // Make room for the icon
      },
      eyeIcon: {
        position: 'absolute',
        right: 10,
        zIndex: 1, // Ensure the icon is clickable by setting zIndex
      },
  });
};

export default ChangePassword;
