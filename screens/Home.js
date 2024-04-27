import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../extras/ThemeContext';
import { getThemeStyles } from '../extras/theme-styles'; // Ensure this is the correct path to your theme styles

const Home = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext); // Access the theme from the ThemeContext
  const themeStyles = getThemeStyles(theme); // Get styles for the current theme
  const [userFullName, setUserFullName] = useState('Guest');
  const [originalUserRole, setOriginalUserRole] = useState('User');
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDataJson = await AsyncStorage.getItem('userObject');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        setOriginalUserRole(userData.UserRole);
        setUserFullName(userData.UserFullName || 'Guest');
      }
    };

    fetchUserData();
  }, []);

    const getMenuData = () => {
        let menuItems = [
            { key: 'Modules', icon: require('../assets/modules.png'), screen: 'ModulesScreen' },
            { key: 'Profile', icon: require('../assets/verified.png'), screen: 'ProfileScreen' },
            { key: 'Discussions', icon: require('../assets/brainstorming.png'), screen: 'DiscussionForumScreen' },
            { key: 'Settings', icon: require('../assets/settings.png'), screen: 'SettingsScreen' }
        ];

        if (!isViewingAsUser && (originalUserRole === 'SuperAdmin' || originalUserRole === 'Admin')) {
            menuItems.push({ key: 'Users', icon: require('../assets/group.png'), screen: 'UsersScreen' });
        }

        if (isViewingAsUser || originalUserRole === 'User') {
            menuItems.push({ key: 'Take Quick Quiz', icon: require('../assets/quiz.png'), screen: 'QuizDifficultySelectorScreen' });
            menuItems.push({ key: 'Progress Tracker', icon: require('../assets/growth.png'), screen: 'ProgressTrackerScreen' });
        }

        return menuItems;
    };

    const toggleViewAsUser = () => {
        setIsViewingAsUser(!isViewingAsUser);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.screen)}>
            <Image source={item.icon} style={styles.icon} resizeMode='contain' />
            <Text style={styles.itemText}>{item.key}</Text>
        </TouchableOpacity>
    );

    return (
    <View style={themeStyles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/file-security.png')} style={themeStyles.image} resizeMode='contain' />
      </View>
      <Text style={themeStyles.title}>Welcome, {userFullName}!</Text>
      {(originalUserRole === 'SuperAdmin' || originalUserRole === 'Admin') && (
        <View style={themeStyles.viewAsUserContainer}>
          <Text style={themeStyles.viewAsUserText}>User View Mode:</Text>
          <Switch onValueChange={toggleViewAsUser} value={isViewingAsUser} />
        </View>
      )}
      <FlatList
        data={getMenuData()}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        numColumns={2}
        contentContainerStyle={themeStyles.listContent} // Apply dynamic styles if needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#0D1B2A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0E1DD',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flex: 1,
        margin: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B263B',
        borderRadius: 5,
    },
    itemText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    icon: {
        width: 100,
        height: 100,
    },
    image: {
        width: 70,
        height: 50,
    },
    viewAsUserContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    viewAsUserText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginRight: 10,
    }
});

export default Home;
 