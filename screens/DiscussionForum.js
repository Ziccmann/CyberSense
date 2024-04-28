import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert, Modal, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { doc, getDocs, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../backend/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../extras/ThemeContext';
import { format } from 'date-fns';

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Update to use state
  const { theme } = useContext(ThemeContext);
  const themeStyles = getThemeStyles(theme);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the current user state
      // Additional debug log
      console.log("Auth state changed, new user:", user);
    });
  
    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  

useEffect(() => {
  const fetchPostsAndUsers = async () => {
    try {
      const userMDQuerySnapshot = await getDocs(collection(db, 'UserMD'));
      const postsWithUserDetails = await Promise.all(
        userMDQuerySnapshot.docs.map(async (userDoc) => {
          const userPostsQuerySnapshot = await getDocs(collection(userDoc.ref, 'DiscussionForum'));
          const posts = userPostsQuerySnapshot.docs.map((postDoc) => {
            const UserID = userDoc.id;
            const postData = postDoc.data();
            const userRole = userDoc.data().UserRole;
            const userFullName = userDoc.data().UserFullName;
            // Use format from date-fns to format the date
            const formattedPostDate = postData.PostDate ? format(postData.PostDate.toDate(), 'PPpp') : 'N/A';
            const formattedLastCompleted = postData.LastCompleted ? format(postData.LastCompleted.toDate(), 'PPpp') : 'Not completed';
            return {
              id: postDoc.id,
              UserID,
              PostTitle: postData.PostTitle,
              PostContent: postData.PostContent,
              PostDate: formattedPostDate,
              UserRole: userRole,
              UserFullName: userFullName,
              LastCompleted: formattedLastCompleted,
              // ... include any other post data you need
            };
          });
          return posts;
        })
      );
      setPosts(postsWithUserDetails.flat());
    } catch (error) {
      console.error('Error fetching posts and user data:', error);
    }
  };

  if (isFocused) {
    fetchPostsAndUsers();
  }
}, [isFocused]);




  const handleAddComment = async () => {
    if (!newCommentText.trim() || !activePostId) return;
    try {
      const commentsRef = collection(db, 'DiscussionForum', activePostId, 'Comments');
      await addDoc(commentsRef, {
        CommentText: newCommentText,
        UserID: currentUser.uid,
        CommentDate: new Date(),
      });
      setNewCommentText('');
      setIsCommentModalVisible(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const onDeletePost = async (postId) => {
    if (currentUser && (currentUser.uid === item.UserID)) {
      Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'UserMD', currentUser.uid, 'DiscussionForum', postId));
              setPosts(previousPosts => previousPosts.filter(post => post.id !== postId));
              Alert.alert('Success', 'Post deleted successfully!');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete the post.');
            }
          },
        },
      ]);
    } else {
      Alert.alert('Error', 'You do not have permission to delete this post.');
    }
  };
  

  const renderPost = ({ item }) => {

    console.log("Current user ID:", currentUser?.uid);
    console.log("Post user ID:", item.UserID);
    console.log("Is post owner:", currentUser?.uid === item.UserID);
  

    const isPostOwner = currentUser && item.UserID && currentUser.uid === item.UserID;
    
    const onNavigateToComments = () => {
      navigation.navigate('CommentsScreen', { postId: item.id });
    };

    const onEditPost = () => {
      navigation.navigate('EditPostScreen', { post: item });
    };
    return (
      <View style={themeStyles.postContainer}>
        <Text style={themeStyles.userFullName}>{item.UserFullName}</Text>
        <Text style={themeStyles.postTitle}>{item.PostTitle}</Text>
        <Text style={themeStyles.postContent}>{item.PostContent}</Text>
        <Text style={themeStyles.postDate}>{item.PostDate}</Text>
        <Text style={themeStyles.userRole}>{item.UserRole}</Text>
        <View style={themeStyles.interactionRow}>
          <TouchableOpacity onPress={onNavigateToComments}>
            <Icon name="comment-outline" size={24} color={themeStyles.iconColor} />
          </TouchableOpacity>
        </View>
        {isPostOwner && (
        <View style={themeStyles.postActions}>
          <TouchableOpacity
            style={themeStyles.editButton}
            onPress={() => navigation.navigate('EditPostScreen', { post: item })}
          >
            <Text style={themeStyles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={themeStyles.deleteButton}
            onPress={() => onDeletePost(item.id)}
          >
            <Text style={themeStyles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    );
  };

  return (
    <View style={themeStyles.container}>
      <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/file-security.png')} style={themeStyles.image} resizeMode='contain' />
            </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={() => setIsCommentModalVisible(!isCommentModalVisible)}
      >
        <View style={themeStyles.modalView}>
          <TextInput
            style={themeStyles.modalInput}
            placeholder="Write your comment..."
            value={newCommentText}
            onChangeText={setNewCommentText}
          />
          <Button title="Post Comment" onPress={handleAddComment} />
          <Button title="Cancel" onPress={() => setIsCommentModalVisible(True)} />
        </View>
      </Modal>
      <TouchableOpacity
        style={themeStyles.addButton}
        onPress={() => navigation.navigate('CreatePostScreen')}
      >
        <Icon name="plus-circle" size={30} color={themeStyles.iconColor} />
      </TouchableOpacity>
    </View>
  );
};


const getThemeStyles = (theme) => {
    const isDark = theme === 'dark';
    return StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: isDark ? '#0D1B2A' : '#F0F0F0', // Lighter background in light mode
      },
      postContainer: {
        backgroundColor: isDark ? '#1B263B' : '#FFFFFF', // White background for posts in light mode
        padding: 20,
        marginVertical: 8,
        borderRadius: 10, // Rounded corners for post containers
        shadowColor: '#000', // Shadow for both dark and light themes
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingBottom: 15,
        elevation: 5,
      },
      image: {
        width: 70,
        height: 50,
    },
      postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns the title and date on opposite ends
        alignItems: 'center', // Centers them vertically
        marginBottom: 10, // Adds some margin below the header
      },
      postTitle: {
        fontSize: 18,
        color: isDark ? '#FFFFFF' : '#333333',
        fontWeight: 'bold',
        flexShrink: 1, // Ensures text shrinks if the screen width is small
      },
      postDate: {
        fontSize: 12,
        color: isDark ? '#BBBBBB' : '#777777',
        marginLeft: 10, // Adds some margin to the left of the date
      },
      postBody: {
        marginTop: 10, // Adds margin above the post body content
      },
      postContent: {
        fontSize: 14,
        color: isDark ? '#DDDDDD' : '#555555',
        lineHeight: 20, // Line height for better readability
      },
      userFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // This will ensure that the name and role are spaced out
        marginTop: 10,
      },
      userFullName: {
        fontSize: 14,
        color: isDark ? '#FFFFFF' : '#000000',
        fontWeight: 'bold',
      },
      userRole: {
        fontSize: 12,
        color: isDark ? '#CCCCCC' : '#666666',
        fontStyle: 'italic',
      },
      postContent: {
        fontSize: 16,
        color: isDark ? '#E0E1DD' : '#666666', // Lighter text in dark mode, darker in light mode
        lineHeight: 24, // Improved line height for readability
      },
      interactionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center', // Align items in the center vertically
        marginTop: 10,
        marginBottom: 10, // Space below the row for separation
      },
      iconColor: {
        color: isDark ? '#FFFFFF' : '#1A73E8', // Blue icons in light mode
      },
      addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: isDark ? '#1A73E8' : '#4CAF50', // Green button in light mode
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
      },
      postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      modalInput: {
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5, // Rounded corners for input
        width: "100%",
        fontSize: 16, // Bigger font size for readability
      },
      editButton: {
        backgroundColor: isDark ? '#3D556E' : '#2196F3', // Use a blue shade for the edit button
        padding: 10,
        borderRadius: 5,
        marginRight: 8, // Add some space between the buttons
      },
      deleteButton: {
        backgroundColor: '#F44336', // Red is commonly used for delete actions
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center', // Center the text inside the button
      },
    });
  };
  
export default DiscussionForum;
