# MindAI Expression API

### What is Mind Expression?[](#what-is-mind-expression)
-   Mind Expression is a Conversational AI as a Service (AIaaS) for the development of Conversational AIs (also known as "chatbots").
-   With a context-aware development interface, a developer can easily create complex conversation flows and test them immediately in the Sandbox.
-   With a single, simple public API access, integration with any front end is easily interfaced.
-   Developers can easily add specific knowledge from their own organizations and use it immediately.
    

### Why Mind Expression is different[](#why-mind-expression-is-different)
-   Unlike every other chatbot platform, our Conversational AI Builder does not rely on a machine learning (ML) framework to properly match a chatbot user's "intent".
-   Mind uses a new Symbolic Paradigm, which overcomes the problems of the older, first-generation symbolic models, solving the problems of brittleness and adaptive learning.
-   Mind doesn't rely on Big Data; we do not train our model, we educate it.
-   Neural network (NN) and Machine learning (ML) models are not made to reason: they only spot patterns, and they don't know why something made "sense" to them or not, whereas Mind understands what's going on and why.

## Table of Contents
  - [Installation](#installation)
  - [Documentation and Examples](#documentation-and-examples)
    - [Notice!!](#notice!!)

  - [Features](#features)
    - [MindAIExpressionChatUI](#mindAIExpressionChatUI)
      - [S3 Bucket setup](#s3-bucket-setup)
      - [Azure Blob Storage setup](#azure-blob-storage-setup)
      - [Firebase Storage setup](#firebase-storage-setup)
    - [Init API](#init-api)
    - [Start conversation](#start-conversation)
    - [Restart conversation](#restart-conversation)
    - [Send a Message](#send-a-message)
    - [Listen to message update](#listen-to-message-update)
    - [Get current Query Id](#get-current-query-id)
    - [Get current timestamp](#get-current-timestamp)
    - [Log events](#log-events)

## Installation
**NOTICE: PLEASE USE NODE VERSION >=18**
### Step 1
Our app depend on some react-native libraries that have native modules, so please add it properly using below commands:
  ```
  npm install me-react-native-sdk@https://github.com/MindX-SDK/me-react-native-sdk.git#develop react-native-audio-recorder-player react-native-auto-height-image react-native-blob-util react-native-calendars react-native-device-info react-native-document-picker react-native-get-random-values react-native-gifted-chat react-native-image-crop-picker react-native-pdf react-native-select-dropdown react-native-svg react-native-url-polyfill react-native-video text-encoding-polyfill axios@1.3.2 expo-modules-core @azure/core-asynciterator-polyfill @azure/storage-blob
  ```
  or 
  ```
  yarn add me-react-native-sdk@https://github.com/MindX-SDK/me-react-native-sdk.git#develop react-native-audio-recorder-player react-native-auto-height-image react-native-blob-util react-native-calendars react-native-device-info react-native-document-picker react-native-get-random-values react-native-gifted-chat react-native-image-crop-picker react-native-pdf react-native-select-dropdown react-native-svg react-native-url-polyfill react-native-video text-encoding-polyfill axios@1.3.2 expo-modules-core @azure/core-asynciterator-polyfill @azure/storage-blob
  ```

### Step 2
  ```
  npx pod-install
  ```
### Step 3

#### Setting react-native project
  ```
  yarn add -D @babel/plugin-proposal-export-namespace-from
  ```

  In your babel.config.json file, add this:
  ```
  module.exports = {
  //...
  plugins: [
      //...
      '@babel/plugin-proposal-export-namespace-from', // ADD_THIS
    ]
  };
  ```

#### iOS
In Xcode open Info.plist and add string key NSPhotoLibraryUsageDescription with value that describes why you need access to user photos. More info here https://forums.developer.apple.com/thread/62229. Depending on what features you use, you also may need NSCameraUsageDescription and NSMicrophoneUsageDescription keys.

Also, add [swift bridging header](https://stackoverflow.com/questions/31716413/xcode-not-automatically-creating-bridging-header) if you haven't created one for `swift` compatibility.

<img width="800" alt="1" src="https://user-images.githubusercontent.com/29066552/256304345-b6e80796-6c5d-482a-80cc-1bfb8cd4663f.png">

#### Android
- **VERY IMPORTANT** Add the following to your `build.gradle`'s repositories section. (android/build.gradle)

```gradle
buildscript {
    ext {
      ...
      // ADD THIS, use `1.6.10` or above
      kotlinVersion = '1.6.10'
    }

    repositories {
      mavenLocal()
      jcenter()
      maven { url "$rootDir/../node_modules/react-native/android" }

      // ADD THIS
      maven { url 'https://maven.google.com' }

      // ADD THIS
      maven { url "https://www.jitpack.io" }
    }

    dependencies {
        ...
        // ADD THIS
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"
    }
}
```

- Add `useSupportLibrary` (android/app/build.gradle)

```gradle
android {
    ...

    defaultConfig {
        ...
        vectorDrawables.useSupportLibrary = true
        ...
    }
    ...
}
```

- Use Android SDK >= 26 (android/app/build.gradle)

```gradle
android {
    compileSdkVersion 27
    buildToolsVersion "27.0.3"
    ...
    
    defaultConfig {
      ...
      targetSdkVersion 27
      ...
    }
    ...
}
```

In your `app/src/main/AndroidManifest.xml`
Add following permission:
  - `<uses-permission android:name="android.permission.CAMERA"/>`
  - `<uses-permission android:name="android.permission.RECORD_AUDIO" />`
  - `<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29"/>`
  - `<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />`
  - `<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />`
  - `<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />`

Add `adjustPan` input mode to your main `<activity`:
  ```
  <activity
    ...
    android:windowSoftInputMode="adjustPan"
  >
  ```


## Features
### Documentation and Examples
  - [The official documentation](https://mindx-docs.mind.ai/)
  - React Native example [here](https://github.com/MindX-SDK/me-react-native-sdk/tree/develop/example)

### Notice!!
  **By default, timestamp send to BE will converted to _UTC_.**

### MindAIExpressionChatUI
React native component `MindAIExpressionChatUI` handled all above features and S3 Bucket implementation for attachments.
```javascript
<MindAIExpressionChatUI
  ENGINE_URL={ENGINE_URL}
  AUTH_KEY={AUTH_KEY}
  showLogCheck={true}
  remoteStorageConfig={{
    s3BucketConfig: {
      bucketName: S3BucketName,
      options: S3BucketConfig,
    }
    // azureBlobStorageConfig: {
    //   storageName: AZURE_STORAGE_NAME,
    //   containerName: AZURE_STORAGE_CONTAINER_NAME,
    //   sasToken: AZURE_SAS_TOKEN_STRING,
    // }
    // firebaseStorageConfig: {
    //   rootDirectory: FIREBASE_STORAGE_ROOT_DIR,
    //   options: FIREBASE_CONFIG,
    // }
  }}
  test={{
    mockedMessages: mockData,
  }}
/>
```
- `ENGINE_URL` - You can get this on the integration page. This is the main URL you will use to access the API’s endpoint

- `AUTH_KEY` - This is the authorization token on the integration page. This token is used to authorize your access to the Mind Expression API.

- `showLogCheck` (optional): Show log area or not

- `remoteStorageConfig`: Config a remote storage for handling Chat media files, you only need to fill one of the config to handle storage: 
  - `s3BucketConfig`: To config S3 Bucket as chat remote storage, detail: [S3 Bucket setup](#s3-bucket-setup)
  - `azureBlobStorageConfig`: To config Azure Blob Storage as chat remote storage, detail: [Azure Blob Storage setup](#azure-blob-storage-setup)
  - `firebaseStorageConfig`: To config Firebase Storage as chat remote storage, detail: [Firebase Storage setup](#firebase-storage-setup)

- `test` (optional): This is for test purpose only
  - `mockedMessages`: temp message items


#### S3 Bucket setup
This step is required if you want to set up S3 Bucket for uploading Chat media. Please note that this S3 Bucket is not intended for hosting static web pages but rather for uploading files.

To configure the S3 Bucket, follow these steps:
1. Go to https://s3.console.aws.amazon.com/s3/buckets and create a new S3 Bucket with a name of your choice.
2. In your project configuration, you will need to provide the following information:
  - `s3BucketName`: Replace this with the name of your S3 Bucket that you created in step 1.
  - `s3BucketConfig`: You can customize the AWS SDK configuration by adding additional fields, but the minimum required fields are as follows:

```javascript
{
  region: 'THE_REGION', // Replace 'THE_REGION' with the AWS Region of your S3 Bucket (e.g., 'ap-southeast-1').
  apiVersion: 'latest', // Use 'latest' or a custom date following AWS requirements.
  credentials: {
    accessKeyId: 'ACCESS_KEY_ID', // Replace 'ACCESS_KEY_ID' with the Access Key ID from your AWS IAM user credentials (https://console.aws.amazon.com/iamv2/home#/users/create).
    secretAccessKey: 'SECRET_ACCESS_KEY', // Replace 'SECRET_ACCESS_KEY' with the Secret Access Key from your AWS IAM user credentials (https://console.aws.amazon.com/iamv2/home#/users/create).
  },
}
```


#### Azure Blob Storage setup
This step is required if you want to set up Azure Blob Storage for uploading Chat media. Please note that this Azure Storage is not intended for hosting static web pages or databases but rather for uploading files.

To configure the Azure Blob Storage, follow these steps:
1. Go to https://portal.azure.com/ and create a new Storage account with a name of your choice.
2. In your project configuration, you will need to provide the following information:

  - `storageName`: Replace this with the name of your Storage account that you created in step 1.

  - `containerName`: This is the name of the container that will store all Chat upload media. You can create it from your Azure portal, else the SDK will auto-create it.

  - `sasToken`: Azure's Shared Access Signature (SAS) token, which you generated in the Azure portal.


#### Firebase Storage setup
This step is required if you want to set up Firebase Storage for uploading Chat media.

To configure Firebase Storage, follow these steps:

1. Go to https://console.firebase.google.com/ and create a new Firebase project with a name of your choice.
2. In the Firebase Console Project Settings, create a Web App with a name of your choice, and obtain the `firebaseConfig` object.
3. In your project configuration, you will need to provide the following information:

  - `rootDirectory`: Replace this with the name of your desired Storage root directory where you want to store chat media files.

  - `options`: This is the Firebase option used to initialize the Firebase App. You can place the `firebaseConfig` object created in step 2 here.

  **Notice: You must, at least, allow read and write access to the rootDirectory to make the upload working.**

### Init API
Create an instance of `MindExpressionApi`.

```javascript
import {MindExpressionApi} from 'me-react-native-sdk';
import DeviceInfo from 'react-native-device-info';
//...
const deviceUniqueId = await DeviceInfo.getDeviceId();
let mindExpressionAI = new MindExpressionApi(ENGINE_URL, AUTH_KEY, deviceUinqueId, {useLogger: true});
```
  - `ENGINE_URL`: You can get this on the integration page. This is the main URL you will use to access the API’s endpoint.
  - `AUTH_KEY`: This is the authorization token on the integration page. This token is used to authorize your access to the Mind Expression API.
  -  `deviceUinqueId`: Unique id of device - This will be use to save/fetch device chat history
  - `useLogger`: (boolean) to choose use logger to log action event or not.

### Start conversation
Call `greeting` function from `mindExpressionAI` object you just created. This will create a new conversation.
```javascript
const res = await mindExpressionAPI.greeting();
```
  Return data of that function is of type `GatewayResponse` which is the reponse data of Mind Expression API.
  _Notice: conversationId will always set to null when call this function_

### Restart conversation
Call `restart` function from `mindExpressionAI` object you just created. This will remove current conversation data and create a new one.
```javascript
const res = await mindExpressionAPI.restart();
```
  Return data of that function is of type `GatewayResponse` which is the reponse data of Mind Expression API.

### Send a Message
Call `converse` function from `mindExpressionAI` object you just created. This will send your response to AI in current converastion.
```javascript
const res = await mindExpressionAPI.converse(message);
```
  - `message`: this is a string text that you want to chat with AI
  Return data of that function is of type `GatewayResponse` which is the reponse data of Mind Expression API
  This request will thow error if you not call start function yet or response with empty message.

### Listen to message update
Call `eventEmitter.on` from `mindExpressionAI` object and listen to event `MindExpressionApiEvents.NEW_MESSAGE`.
```javascript
const listener = mindExpressionAPI.eventEmitter.on(
  MindExpressionApiEvents.NEW_MESSAGE,
  data => {
    //handle data
  },
)
```
This will return latest message and list of all messages `ConversationData` which is also showing the message is from `AI` or `User`.

### Get current Query Id
Call `getQueryId` from `mindExpressionAI` object.
```javascript
const queryId: string = mindExpressionAPI.getQueryId();
```
Get latest query-id that is sent.

### Get current timestamp
Call `getLogs` from `mindExpressionAI` object.
```javascript
const timestamp: number = mindExpressionAPI.getTimestamp();
```
Get latest timestamp sent a request.

### Log events
Call `getLogs` from `mindExpressionAI` object.
```javascript
const logs: string[] = mindExpressionAPI.getLogs();
```
Return array strings of object loging. Notice that this function is required `useLogger` is true, else it will thow error.

### Reset session
Call `resetSession` from `mindExpressionAI` object.
```javascript
mindExpressionAPI.resetSession();
```
To remove x-conversation-id from the HTTP Header

### Set session
Call `setSession` from `mindExpressionAI` object.
```javascript
mindExpressionAPI.setSession();
```
To set x-conversation-id to the request HTTP Header with a return value from the response HTTP Header
