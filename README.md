
# CyberSense

CyberSense is a mobile application designed to educate users on cybersecurity through interactive modules and quizzes. This guide will walk you through the steps required to set up and run the application locally.

## Prerequisites

Before you start, make sure you have the following installed:
- **Node.js**: The runtime environment required to run the React Native CLI. [Download Node.js](https://nodejs.org/)
- **Yarn** or **npm**: Package managers to install dependencies. Yarn can be installed via npm with the command `npm install -g yarn`.
- **React Native CLI**: Required to run React Native projects. Install by running `npm install -g react-native-cli`.
- **Android Studio or Xcode**: Required for emulating Android or iOS respectively.

## Setting Up

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ziccmann/cybersense
   cd cybersense
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Firebase Configuration**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or use an existing one (Create a new project or use an existing one (Firebase Login Details:
      Email: isaacsam053@gmail.com
      Password: Nile1234%
      ).
   - Add an Android and/or iOS app in your Firebase project settings.
   - Download the `google-services.json` for Android and/or `GoogleService-Info.plist` for iOS and place them in the appropriate directories:
     - Android: `android/app/`
     - iOS: `ios/`
   - Ensure your Firebase project has authentication and Firestore database enabled.

4. **Environment Setup**
   - Rename `.env.example` to `.env`.
   - Update the environment variables with your Firebase project keys.

5. **Run the Metro Bundler**
   ```bash
   npx react-native start
   ```

6. **Start the Application**
   - For Android:
     ```bash
     npx react-native run-android
     ```
   - For iOS:
     ```bash
     npx react-native run-ios
     ```
   - Alternatively, open the Android or iOS project in Android Studio or Xcode and run from there.

## Usage

Once the application is running on your emulator or physical device:
- Register as a new user or log in with existing credentials.
- Explore various cybersecurity modules and quizzes.
- Track your progress and compete on leaderboards.

## Contributing

Contributions to CyberSense are always welcome, whether it's fixing bugs, adding new features, or improving documentation. Please feel free to fork the repository and submit pull requests.
