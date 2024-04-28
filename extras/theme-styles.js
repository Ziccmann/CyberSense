// theme-styles.js
import { StyleSheet } from 'react-native';

export const getThemeStyles = (theme) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: isDark ? '#0D1B2A' : '#FFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#E0E1DD' : '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    image: {
        width: 70,
        height: 50,
    },
    viewAsUserContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    viewAsUserText: {
      fontSize: 16,
      color: isDark ? '#E0E1DD' : '#333',
    },

    addButton: {
        backgroundColor: isDark ? '#4CAF50' : '#8BC34A', // Different shades for different themes
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },

    itemContainer: {
      backgroundColor: isDark ? '#1B263B' : '#E3E3E3', // Dark or light item background
      padding: 20,
      marginVertical: 8,
      borderRadius: 5,
    },
    name: {
      fontSize: 18,
      color: isDark ? '#FFFFFF' : '#333', // Dark or light text
      fontWeight: 'bold',
    },
    dob: {
      fontSize: 16,
      color: isDark ? '#E0E1DD' : '#333', // Dark or light text
    },
    email: {
      fontSize: 16,
      color: isDark ? '#E0E1DD' : '#333', // Dark or light text
    },
    image: {
      width: 70,
      height: 50,
  },
    
    listContent: {
      // Apply dynamic styles for your FlatList content container if needed
    },
    // Add any other dynamic styles needed for elements in your Home screen
  });

  
};
