import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../backend/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ThemeContext } from '../extras/ThemeContext'; // Import the ThemeContext

const ProgressTracker = () => {
  const { theme } = useContext(ThemeContext); // Consume the theme from the ThemeContext
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
     // Fetch progress data from Firestore
    const fetchProgress = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const progressCollectionRef = collection(db, 'UserMD', user.uid, 'Progress');
        getDocs(progressCollectionRef)
          .then((querySnapshot) => {
            const userProgress = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              userProgress.push({
                moduleName: doc.id,
                score: data.ModuleScores[doc.id],
                badgeEarned: data.BadgesEarned || 'None',
                lastCompleted: data.LastCompleted?.toDate().toString() || 'Not completed',
              });
            });
            setProgressData(userProgress);
          })
          .catch((error) => {
            console.error('Error fetching progress:', error);
            setError('Failed to fetch progress data');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        console.log('User not logged in');
        setError('User not logged in');
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getBadgeImage = (badge) => {
    if (badge === 'Platinum') {
      return require('../assets/platinum.png');
    } else if (badge === 'Gold') {
      return require('../assets/winner.png');
    } else if (badge === 'Silver') {
      return require('../assets/2nd-place.png');
    } else if (badge === 'Bronze') {
      return require('../assets/3rd-place.png');
    } else {
      return require('../assets/money.png'); // Handle the case where no badge is earned
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme === 'dark' ? '#FFFFFF' : '#000000'} />;
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0' }]}>
        <Text style={[styles.text, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>{error}</Text>
      </View>
    );
  }

  if (progressData.length === 0) {
    return (
      <View style={[styles.textcontainer, { backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0' }]}>
        <Text style={[styles.text, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>You have no progress data available yet. Start learning to track your progress!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#1B263B' : '#E0E0E0' }]}>
       <View style={styles.imageView}>
                <Image
                    source={require('../assets/file-security.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
      <Text style={[styles.title, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Your Learning Progress</Text>
      {progressData.map((module, index) => (
        <View key={index} style={[styles.moduleContainer, { backgroundColor: theme === 'dark' ? '#283C4D' : '#FFFFFF' }]}>
          <Text style={[styles.moduleName, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Module: {module.moduleName}</Text>
          <Text style={styles.score}>Score: {module.score}%</Text>
          <Image 
            style={styles.badgeImage}
            source={getBadgeImage(module.badgeEarned)}
          />
          <Text style={styles.badge}>Badge Earned: {module.badgeEarned}</Text>
          <Text style={styles.lastCompleted}>Last Completed: {module.lastCompleted}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textcontainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Centers content vertically in the container
    alignItems: 'center',     // Centers content horizontally in the container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  badgeImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 5,
  },
  moduleContainer: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  moduleName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    color: '#4CAF50',
  },
  badge: {
    fontSize: 16,
    color: '#FFD700',
  },
  lastCompleted: {
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

export default ProgressTracker;
