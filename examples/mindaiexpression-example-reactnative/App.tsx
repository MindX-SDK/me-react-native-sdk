/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConversationData, MindAIExpressionChatUI } from 'me-react-native-sdk';
import {
  AUTH_KEY,
  AZURE_SAS_TOKEN_STRING,
  AZURE_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_NAME,
  ENGINE_URL,
  S3_BUCKET_NAME,
  S3_BUCKET_CONFIG,
  FIREBASE_STORAGE_ROOT_DIR,
  FIREBASE_CONFIG,
} from './src/constants/AppConstants';

function App(): JSX.Element {
  const [isConfirm, setConfirm] = useState(false);
  const [engineUrl, setEngineUrl] = useState(ENGINE_URL);
  const [authKey, setAuthKey] = useState(AUTH_KEY);

  const renderInputUrl = () => {
    return (
      <ScrollView style={styles.inputWrapper}>
        <TextInput
          onChangeText={setEngineUrl}
          value={engineUrl}
          placeholder='enter engine url'
        multiline
          style={styles.textInput}
        />
        <View style={{ height: 10 }} />
        <TextInput
          onChangeText={setAuthKey}
          value={authKey}
          placeholder='enter auth key'
          multiline
          style={styles.textInput}
        />
        <View style={{ height: 10 }} />
        <TouchableOpacity
          style={[styles.button, { alignSelf: 'flex-end' }]}
          onPress={() => {
            Keyboard.dismiss();
            setConfirm(true);
          }}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
  const renderChat = () => {
    return (
      <MindAIExpressionChatUI
        ENGINE_URL={engineUrl}
        AUTH_KEY={authKey}
        showLogCheck
        remoteStorageConfig={{
          // s3BucketConfig: {
          //   bucketName: S3_BUCKET_NAME,
          //   options: S3_BUCKET_CONFIG,
          // }
          // azureBlobStorageConfig: {
          //   storageName: AZURE_STORAGE_NAME,
          //   containerName: AZURE_STORAGE_CONTAINER_NAME,
          //   sasToken: AZURE_SAS_TOKEN_STRING,
          // },
          firebaseStorageConfig: {
            rootDirectory: FIREBASE_STORAGE_ROOT_DIR,
            options: FIREBASE_CONFIG,
          }
        }}
        test={{
          mockedMessages: mockData,
        }}
      />
    )
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F2F4F5'} />
      <View style={{ height: 10 }} />
      <Text style={styles.highlight}>Demo Mind EXPRESSION API</Text>
      <View style={{ height: 10 }} />
      {isConfirm
        ? renderChat()
        : renderInputUrl()
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#F2F4F5',
  },
  inputWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  highlight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    alignSelf: 'center',
  },
  textInput: {
    // flex: 1,
    width: '100%',
    height: 64,
    borderWidth: 1,
    borderColor: '#18aa78',
    backgroundColor: '#18aa7820',
    borderRadius: 4,
    padding: 6,
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  button: {
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 20,
    backgroundColor: '#18aa78',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default App;

const mockData: ConversationData[] = [
  {
    sender: 'CAI',
    data: {
      'channel-name': 'default',
      'template-type': 'datetime',
      template: '',
      'image-url': '',
      'upload-type': '',
      'quick-replies': [],
      'card-list': [],
      'dynamic-template-key': null,
      'dynamic-button-key': null,
      datetime: {
        type: 'date_range',
        format: 'YYYY/MM/DD',
        'date-limit': false,
        'min-date': '2023/08/01',
        'max-date': '2023/09/21',
        'button-label': 'Confirm',
        language: 'en',
      },
    },
    timestamp: new Date().valueOf() + 5000,
  },
  {
    sender: 'CAI',
    data: {
      'channel-name': 'default',
      'template-type': 'datetime',
      template: '',
      'image-url': '',
      'upload-type': '',
      'quick-replies': [],
      'card-list': [],
      'dynamic-template-key': null,
      'dynamic-button-key': null,
      datetime: {
        type: 'datetime',
        format: 'YYYY/MM/DD, HH:MM AM/PM',
        'date-limit': false,
        'min-date': null,
        'max-date': null,
        'button-label': 'Confirm',
        language: 'ko',
      },
    },
    timestamp: new Date().valueOf() + 5001,
  },
  {
    sender: 'CAI',
    data: {
      'channel-name': 'default',
      'template-type': 'datetime',
      template: '',
      'image-url': '',
      'upload-type': '',
      'quick-replies': [],
      'card-list': [],
      'dynamic-template-key': null,
      'dynamic-button-key': null,
      datetime: {
        type: 'datetime',
        format: 'YYYY/MM/DD, HH:MM AM/PM',
        'date-limit': false,
        'min-date': null,
        'max-date': null,
        'button-label': 'Confirm',
        language: 'th',
      },
    },
    timestamp: new Date().valueOf() + 5002,
  },
  {
    sender: 'CAI',
    data: {
      'channel-name': 'default',
      'template-type': 'datetime',
      template: '',
      'image-url': '',
      'upload-type': '',
      'quick-replies': [],
      'card-list': [],
      'dynamic-template-key': null,
      'dynamic-button-key': null,
      datetime: {
        type: 'datetime',
        format: 'YYYY/MM/DD, HH:MM AM/PM',
        'date-limit': false,
        'min-date': null,
        'max-date': null,
        'button-label': 'Confirm',
        language: 'ko',
      },
    },
    timestamp: new Date().valueOf() + 5003,
  },
  // {
  //   sender: 'User',
  //   data: {
  //     template: 'https://bdtren-testbucket.s3.ap-southeast-1.amazonaws.com/45300236-02e5-451a-a02d-1a8c21791a82_1690643451211_IMG_0001.JPG',
  //   },
  //   timestamp: new Date().valueOf() + 5100,
  // },
  // {
  //   sender: 'User',
  //   data: {
  //     template: 'https://firebasestorage.googleapis.com/v0/b/bdtren-test.appspot.com/o/chatMedia%2F5f29569e-fd61-45d9-8751-70fd30d11824_1691604403743_IMG_0004.JPG?alt=media&token=24d77e0b-56d6-44e4-8eda-48379869f3ea',
  //   },
  //   timestamp: new Date().valueOf() + 5600,
  // },
  // {
  //   sender: 'User',
  //   data: {
  //     template: 'https://bdtren-testbucket.s3.ap-southeast-1.amazonaws.com/7af1ad05-dc74-4c2c-b5b8-5ba64079ab2e_1690643474733_pdf-test.pdf',
  //   },
  //   timestamp: new Date().valueOf() + 5200,
  // },
  // {
  //   sender: 'User',
  //   data: {
  //     template: 'https://bdtren-testbucket.s3.ap-southeast-1.amazonaws.com/2de5fea2-0a61-48e6-9a50-3d6438ee6ccc_1690643496273_IMG_0009.MP4',
  //   },
  //   timestamp: new Date().valueOf() + 5300,
  // },
  // {
  //   sender: 'User',
  //   data: {
  //     template: 'https://bdtren-testbucket.s3.ap-southeast-1.amazonaws.com/9504823c-966b-4ed9-b278-49d678ca08be_1690643514448_sound.m4a',
  //   },
  //   timestamp: new Date().valueOf() + 5400,
  // },
];
