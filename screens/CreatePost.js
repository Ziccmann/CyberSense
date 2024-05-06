import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../backend/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';

const CreatePost = ({ navigation }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleCreatePost = async () => {
    if (!postTitle || !postContent) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }
  
    try {
      // Reference to the specific user document by its AuthenticationID
      const userRef = doc(db, 'UserMD', user.uid);
      // Reference to the subcollection 'DiscussionForum' under the specific user document
      const forumCollectionRef = collection(userRef, 'DiscussionForum');
  
      await addDoc(forumCollectionRef, {
        PostTitle: postTitle,
        PostContent: postContent,
        PostDate: new Date(),
      });
      Alert.alert('Success', 'Post created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'There was an error creating the post.');
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
        placeholderTextColor="#E0E1DD"
      />
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]} // Adapted to a text area style
        onChangeText={setPostContent}
        value={postContent}
        placeholder="Enter post content"
        placeholderTextColor="#E0E1DD"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
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
    alignSelf: 'flex-start', // To align the label to the left
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreatePost;
