import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { db } from '../backend/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ThemeContext } from '../extras/ThemeContext';

const Comments = ({ route }) => {
  const { postId } = route.params; // Extract postId from route parameters
  const [comments, setComments] = useState([]); // State to hold comments
  const [newComment, setNewComment] = useState(''); // State for new comment text
  const auth = getAuth(); // Firebase authentication instance
  const { theme } = useContext(ThemeContext); // Consume theme from context
  const styles = getDynamicStyles(theme); // Get dynamic styles based on theme

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      const userId = postId.split(':')[0]; // Extract userId from postId
      const postRef = doc(db, 'UserMD', userId, 'DiscussionForum', postId); // Reference to post document
      const commentsRef = collection(postRef, 'Comments'); // Reference to comments collection

      // Listen for changes in comments collection
      const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
        const commentsPromises = querySnapshot.docs.map(async (commentDoc) => {
          const commentData = commentDoc.data(); // Comment data
          const userDocRef = doc(db, 'UserMD', commentData.UserID); // Reference to user document
          const userDocSnap = await getDoc(userDocRef); // Get user document snapshot
          const userData = userDocSnap.data(); // User data

          // Format comment date using date-fns library
          const formattedCommentDate = commentData.CommentDate ?
            format(commentData.CommentDate.toDate(), 'PPpp') : 'N/A';

          return {
            ...commentData,
            id: commentDoc.id,
            UserFullName: userData ? userData.UserFullName : 'Anonymous',
            UserRole: userData ? userData.UserRole : 'User',
            CommentDate: formattedCommentDate,
          };
        });

        Promise.all(commentsPromises).then(setComments); // Set comments state after resolving all promises
      });

      return unsubscribe; // Unsubscribe from snapshot listener when component unmounts
    };

    fetchComments(); // Fetch comments
  }, [postId]); // Execute effect when postId changes

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Do nothing if comment is empty

    try {
      const userId = postId.split(':')[0]; // Extract userId from postId
      const postRef = doc(db, 'UserMD', userId, 'DiscussionForum', postId); // Reference to post document
      const commentsRef = collection(postRef, 'Comments'); // Reference to comments collection

      // Add new comment document to comments collection
      await addDoc(commentsRef, {
        CommentText: newComment,
        UserID: auth.currentUser.uid,
        CommentDate: new Date(),
      });

      setNewComment(''); // Clear new comment text
    } catch (error) {
      console.error('Error adding comment:', error); // Log error if adding comment fails
    }
  };

  // Render comments and input field
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/file-security.png')} style={styles.image} resizeMode='contain' />
      </View>
      <FlatList
        data={comments} // Comments data
        keyExtractor={(item) => item.id} // Unique key extractor for comments
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{item.UserFullName}</Text>
              <Text style={styles.commentDate}>{item.CommentDate}</Text>
            </View>
            <Text style={styles.commentText}>{item.CommentText}</Text>
            <Text style={styles.userRole}>{item.UserRole}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={theme === 'dark' ? '#AAAAAA' : '#555555'}
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Post" onPress={handleAddComment} color={theme === 'dark' ? '#2196F3' : undefined} />
      </View>
    </View>
  );
};

// Dynamic styles based on theme
const getDynamicStyles = (theme) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0D1B2A' : '#F0F0F0',
      padding: 20,
    },
    commentContainer: {
      backgroundColor: isDark ? '#1B263B' : '#FFFFFF',
      padding: 20,
      marginVertical: 8,
      borderRadius: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#555' : '#ddd',
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    commentAuthor: {
      fontWeight: 'bold',
      fontSize: 14,
      color: isDark ? '#E0E1DD' : '#333333',
    },
    image: {
      width: 70,
      height: 50,
  },
    commentDate: {
      fontSize: 12,
      color: isDark ? '#AAAAAA' : '#666666',
    },
    commentText: {
      fontSize: 16,
      color: isDark ? '#DDDDDD' : '#555555',
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: isDark ? '#12232E' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#555' : '#ddd',
      marginTop: 10,
    },
    input: {
      flex: 1,
      padding: 10,
      marginRight: 10,
      backgroundColor: isDark ? '#1B263B' : '#f9f9f9',
      color: isDark ? '#E0E1DD' : '#333333',
      borderRadius: 5,
    },
    userRole: {
      fontSize: 12,
      fontStyle: 'italic',
      color: isDark ? '#CCCCCC' : '#666666',
      marginTop: 4,
    },
    // Additional styles for other components...
  });
};
export default Comments;
