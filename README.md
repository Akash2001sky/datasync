## PROJECT NAME: DATASYNC

# Getting Started

Welcome to the DATASYNC. This is a React Native application developed for offline data synchronization feature for a React Native app

## Architecture

The application follows a modular architecture with the following key components:

React Native: The core framework for building cross-platform mobile applications.
Realm: Local database management using @realm/react.
TypeScript: For type-safe coding.
Jest, RTL: For writing and running test cases.

## Folder Structure

/project-root
│
├── /android # Android-specific code and configuration
├── /ios # iOS-specific code and configuration
├── /src
│ ├── /components # Application screens
│ ├── /databaseLocal # Local database management, realm setup, internetconnectivity.
│ ├── /constants # colors used for application
│ ├── /assets # here we have images used in application
│ └── App.tsx # Entry point of the application
│
├── .babelrc # Babel configuration
├── .eslintrc.js # ESLint configuration
├── .prettierrc # Prettier configuration
├── package.json # Project dependencies and scripts
└── README.md # Project documentation

## Features

It have single screen to do the CRUD Operations by using realm in recat native like a task App

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm install

npm start

```

# If you face any issue with android setup

For Mac enter this command in terminal in project level

```bash

chmod 755 android/gradle

```

For Windows enter this command in terminal in project level

```bash

android/gradlew.bat

```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_

### For Android

```bash
# using npx
npm react-native run-android

```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ shortly provided you have set up your emulator/simulator correctly.
