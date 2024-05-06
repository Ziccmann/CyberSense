import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../backend/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const UpdatePost = ({ route, navigation }) => {
  // Assuming the postId is passed as a parameter to this screen
  const { postId } = route.params;
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetching post data
  useEffect(() => {
    const fetchPostData = async () => {
      if (!user || !postId) {
        console.error('User or PostID is undefined:', user, postId);
        Alert.alert('Error', 'User not authenticated or post ID not provided.');
        return;
      }

      try {
        console.log('Fetching post data for post ID:', postId);
        const postRef = doc(db, 'UserMD', user.uid, 'DiscussionForum', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          setPostTitle(postSnap.data().PostTitle);
          setPostContent(postSnap.data().PostContent);
        } else {
          console.error('Post not found for ID:', postId);
          Alert.alert('Error', 'Post not found.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        Alert.alert('Error', 'Failed to fetch post details.');
      }
    };

    fetchPostData();
  }, [postId, user, navigation]);

  // Updating post data
  const handleUpdatePost = async () => {
    if (!postTitle || !postContent) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (!user || !postId) {
      Alert.alert('Error', 'User not authenticated or post ID not provided.');
      return;
    }

    try {
      const postRef = doc(db, 'UserMD', user.uid, 'DiscussionForum', postId);
      await updateDoc(postRef, {
        PostTitle: postTitle,
        PostContent: postContent,
        PostDate: new Date(), // Optionally update the date to the current date/time
      });
      
      // Navigate back only after the user dismisses the alert
      Alert.alert('Success', 'Post updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'There was an error updating the post.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPostTitle}
        value={postTitle}
        placeholder="Enter post title"
      />
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        onChangeText={setPostContent}
        value={postContent}
        placeholder="Enter post content"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePost}>
        <Text style={styles.buttonText}>Update Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#E0E1DD',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#1B263B',
    color: '#FFFFFF',
    borderRadius: 5,
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
});

export default UpdatePost;
