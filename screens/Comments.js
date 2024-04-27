import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet } from 'react-native';
import { db } from '../backend/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const Comments = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const auth = getAuth();

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
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>
                {item.UserFullName}
              </Text>
              <Text style={styles.commentDate}>{item.CommentDate}</Text>
            </View>
            <Text style={styles.commentText}>{item.CommentText}</Text>
            <Text style={styles.commentDate}>{item.UserRole}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Post" onPress={handleAddComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Change the background color as needed
    padding: 40,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Light grey border for each comment
  },
  commentText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff', // White background for the input area
    borderTopWidth: 1,
    borderTopColor: '#ddd', // Light grey border at the top of input area
  },
  input: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9', // Light grey background for the input field
    borderWidth: 1,
    borderColor: '#ddd', // Light grey border for the input field
    borderRadius: 5, // Rounded corners for the input field
  },
  commentContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default Comments;
