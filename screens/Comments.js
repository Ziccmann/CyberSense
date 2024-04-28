import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { db } from '../backend/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ThemeContext } from '../extras/ThemeContext';

const Comments = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const auth = getAuth();
  const { theme } = useContext(ThemeContext);
  const styles = getDynamicStyles(theme);

  useEffect(() => {
    const fetchComments = async () => {
      // Assuming postId format is 'userId:postId'
      const userId = postId.split(':')[0];
      const postRef = doc(db, 'UserMD', userId, 'DiscussionForum', postId);
      const commentsRef = collection(postRef, 'Comments');

      const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
        const commentsPromises = querySnapshot.docs.map(async (commentDoc) => {
          const commentData = commentDoc.data();
          const userDocRef = doc(db, 'UserMD', commentData.UserID);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();

          // Format the comment date using date-fns
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

        Promise.all(commentsPromises).then(setComments);
      });

      return unsubscribe;
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const userId = postId.split(':')[0];
      const postRef = doc(db, 'UserMD', userId, 'DiscussionForum', postId);
      const commentsRef = collection(postRef, 'Comments');

      await addDoc(commentsRef, {
        CommentText: newComment,
        UserID: auth.currentUser.uid,
        CommentDate: new Date(),
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/file-security.png')} style={styles.image} resizeMode='contain' />
            </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
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
