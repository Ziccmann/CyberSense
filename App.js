import Registration from './authentications/Registration';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from './authentications/Login';
import Home from './screens/Home';
import Quiz from './screens/Quiz';
import ModuleQuiz from './screens/ModuleQuiz';
import Profile from './screens/Profile';
import UserUpdateProfile from './screens/UserUpdateProfile';
import Users from './screens/Users';
import UsersUpdate from './screens/UsersUpdate';
import AddUser from './screens/AddUser';
import AddQuiz from './screens/AddQuiz';
import UpdateQuiz from './screens/UpdateQuiz';
import AddModule from './screens/AddModule';
import Modules from './screens/Modules';
import ModuleContents from './screens/ModuleContents';
import UpdateModule from './screens/UpdateModule';
import AddQuestion from './screens/AddQuestion';
import QuestionList from './screens/QuestionList';
import UpdateQuestion from './screens/UpdateQuestion';
import FinalResult from './screens/FinalResult';
import QuickFinalResult from './screens/QuickFinalResult';
import ProgressTracker from './screens/ProgressTracker';
import QuizDifficultySelector from './screens/QuizDifficultySelector';
import DiscussionForum from './screens/DiscussionForum';
import CreatePost from './screens/CreatePost';
import UpdatePost from './screens/UpdatePost';
import Comments from './screens/Comments';
import ChangePassword from './screens/ChangePassword';
import {ThemeProvider} from './extras/ThemeContext'; // Adjust the path according to your project structure
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="LoginScreen"
                        component={Login}
                        options={{
                            title: 'Login',
                            headerShown: false,
                            tabBarLabel: 'Login',
                            tabBarIcon: () => (
                                <MaterialCommunityIcons name='home-account' size={20} color={'red-50'}/>
                            )
                        }}
                    />

                    <Stack.Screen name="RegistrationScreen" component={Registration}
                                  options={{
                                      title: 'Registration',
                                      headerShown: false,
                                      tabBarLabel: 'Registration',
                                      
                                  }}
                    />


                    <Stack.Screen name="QuizScreen" component={Quiz}
                                  options={{
                                      title: 'Quiz',
                                      headerShown: false,
                                      tabBarLabel: 'Quiz',
                                
                                  }}
                    />


                    <Stack.Screen name="ModuleQuizScreen" component={ModuleQuiz}
                                  options={{
                                      title: 'ModuleQuiz',
                                      headerShown: false,
                                      tabBarLabel: 'ModuleQuiz',
                                      
                                  }}
                    />

                    <Stack.Screen name="AddQuizScreen" component={AddQuiz}
                                  options={{
                                      title: 'AddQuiz',
                                      headerShown: false,
                                      tabBarLabel: 'AddQuiz',
                                      
                                  }}
                    />

                    <Stack.Screen name="UpdateQuizScreen" component={UpdateQuiz}
                                  options={{
                                      title: 'UpdateQuiz',
                                      headerShown: false,
                                      tabBarLabel: 'UpdateQuiz',
                                      
                                  }}
                    />

                    <Stack.Screen name="AddModuleScreen" component={AddModule}
                                  options={{
                                      title: 'AddModule',
                                      headerShown: false,
                                      tabBarLabel: 'AddModule',
                                      
                                  }}
                    />

                    <Stack.Screen name="ModulesScreen" component={Modules}
                                  options={{
                                      title: 'Modules',
                                      headerShown: false,
                                      tabBarLabel: 'Modules',
                                      
                                  }}
                    />

                    <Stack.Screen name="ModuleContentsScreen" component={ModuleContents}
                                  options={{
                                      title: 'ModuleContents',
                                      headerShown: false,
                                      tabBarLabel: 'ModuleContents',
                                      
                                  }}
                    />

                    <Stack.Screen name="UpdateModuleScreen" component={UpdateModule}
                                  options={{
                                      title: 'UpdateModule',
                                      headerShown: false,
                                      tabBarLabel: 'UpdateModule',
                                      
                                  }}
                    />

                    <Stack.Screen name="QuestionListScreen" component={QuestionList}
                                  options={{
                                      title: 'QuestionList',
                                      headerShown: false,
                                      tabBarLabel: 'QuestionList',
                                      
                                  }}
                    />

                    <Stack.Screen name="AddQuestionScreen" component={AddQuestion}
                                  options={{
                                      title: 'AddQuestion',
                                      headerShown: false,
                                      tabBarLabel: 'AddQuestion',
                                      
                                  }}
                    />

                    <Stack.Screen name="UpdateQuestionScreen" component={UpdateQuestion}
                                  options={{
                                      title: 'UpdateQuestion',
                                      headerShown: false,
                                      tabBarLabel: 'UpdateQuestion',
                                      
                                  }}
                    />

                    <Stack.Screen name="QuizDifficultySelectorScreen" component={QuizDifficultySelector}
                                  options={{
                                      title: 'QuizDifficultySelector',
                                      headerShown: false,
                                      tabBarLabel: 'QuizDifficultySelector',
                                      
                                  }}
                    />

                    <Stack.Screen name="ProfileScreen" component={Profile}
                                  options={{
                                      title: 'Profile',
                                      headerShown: false,
                                      tabBarLabel: 'Profile',
                                      
                                  }}
                    />


                    <Stack.Screen name="UserUpdateProfileScreen" component={UserUpdateProfile}
                                  options={{
                                      title: 'UserUpdateProfile',
                                      headerShown: false,
                                      tabBarLabel: 'UserUpdateProfile',
                                      
                                  }}
                    />

                    <Stack.Screen name="UsersScreen" component={Users}
                                  options={{
                                      title: 'Users',
                                      headerShown: false,
                                      tabBarLabel: 'Users',
                                      
                                  }}
                    />

                    <Stack.Screen name="UsersUpdateScreen" component={UsersUpdate}
                                  options={{
                                      title: 'UsersUpdate',
                                      headerShown: false,
                                      tabBarLabel: 'UsersUpdate',
                                      
                                  }}
                    />

                    <Stack.Screen name="AddUserScreen" component={AddUser}
                                  options={{
                                      title: 'AddUser ',
                                      headerShown: false,
                                      tabBarLabel: 'AddUser ',
                                      
                                  }}
                    />


                    <Stack.Screen name="FinalResultsScreen" component={FinalResult}
                                  options={{
                                      title: 'FinalResults',
                                      headerShown: false,
                                      tabBarLabel: 'FinalResults',
                                      
                                  }}
                    />

                    <Stack.Screen name="QuickFinalResultScreen" component={QuickFinalResult}
                                  options={{
                                      title: 'QuickFinalResult',
                                      headerShown: false,
                                      tabBarLabel: 'QuickFinalResult',
                                      
                                  }}
                    />

                    <Stack.Screen name="ProgressTrackerScreen" component={ProgressTracker}
                                  options={{
                                      title: 'ProgressTracker',
                                      headerShown: false,
                                      tabBarLabel: 'ProgressTracker',
                                      
                                  }}
                    />

                    <Stack.Screen name="SettingsScreen" component={Settings}
                                  options={{
                                      title: 'Settings',
                                      headerShown: false,
                                      tabBarLabel: 'Settings',
                                      
                                  }}
                    />

                    <Stack.Screen name="DiscussionForumScreen" component={DiscussionForum}
                                  options={{
                                      title: 'DiscussionForum',
                                      headerShown: false,
                                      tabBarLabel: 'DiscussionForum',
                                      
                                  }}
                    />

                    <Stack.Screen name="CommentsScreen" component={Comments}
                                  options={{
                                      title: 'Comments',
                                      headerShown: false,
                                      tabBarLabel: 'Comments',
                                      
                                  }}
                    />

                    <Stack.Screen name="CreatePostScreen" component={CreatePost}
                                  options={{
                                      title: 'CreatePost',
                                      headerShown: false,
                                      tabBarLabel: 'CreatePost',
                                      
                                  }}
                    />

                    <Stack.Screen name="UpdatePostScreen" component={UpdatePost}
                                  options={{
                                      title: 'UpdatePost ',
                                      headerShown: false,
                                      tabBarLabel: 'UpdatePost ',
                                      
                                  }}
                    />

                    <Stack.Screen name="ChangePasswordScreen" component={ChangePassword}
                                  options={{
                                      title: 'ChangePassword',
                                      headerShown: false,
                                      tabBarLabel: 'ChangePassword',
                                      
                                  }}
                    />
                    <Stack.Screen name="HomeScreen" component={Home}
                                  options={{
                                      title: 'CYBERSENSE',
                                      headerShown: false,
                                      tabBarLabel: 'CYBERSENSE',
                                      tabBarIcon: () => (
                                          <MaterialCommunityIcons name='home-account' size={20} color={'red-50'}/>

                                      )
                                  }}
                    />


                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );

}


export default App;
