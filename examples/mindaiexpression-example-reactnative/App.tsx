/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import {ConversationData, MindAIExpressionChatUI} from 'me-react-native-sdk';
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
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F2F4F5'} />
      <View style={{height: 10}} />
      <Text style={styles.highlight}>Demo Mind EXPRESSION API</Text>
      <View style={{height: 10}} />
      <MindAIExpressionChatUI
        ENGINE_URL={ENGINE_URL}
        AUTH_KEY={AUTH_KEY}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#F2F4F5',
  },
  highlight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    alignSelf: 'center',
  },
});

export default App;

const mockData: ConversationData[] = [
  // {
  //   sender: 'CAI',
  //   data: {
  //     'channel-name': 'default',
  //     'template-type': 'datetime',
  //     template: '',
  //     'image-url': '',
  //     'upload-type': '',
  //     'quick-replies': [],
  //     'card-list': [],
  //     'dynamic-template-key': null,
  //     'dynamic-button-key': null,
  //     datetime: {
  //       type: 'datetime',
  //       format: 'YYYY/MM/DD, 오전/오후 HH:MM',
  //       'date-limit': false,
  //       'min-date': new Date(2023, 7 - 1, 4, 0, 0, 0, 0),
  //       'max-date': null,
  //       'button-label': 'Confirm',
  //     },
  //   },
  //   timestamp: new Date().valueOf() + 5000,
  // },
  // {
  //   sender: 'CAI',
  //   data: {
  //     'channel-name': 'default',
  //     'template-type': 'datetime',
  //     template: '',
  //     'image-url': '',
  //     'upload-type': '',
  //     'quick-replies': [],
  //     'card-list': [],
  //     'dynamic-template-key': null,
  //     'dynamic-button-key': null,
  //     datetime: {
  //       type: 'date_range',
  //       format: 'YYYY/MM/DD',
  //       'date-limit': false,
  //       'min-date': new Date(2023, 7 - 1, 4, 0, 0, 0, 0),
  //       'max-date': null,
  //       'button-label': 'Confirm',
  //     },
  //   },
  //   timestamp: new Date().valueOf() + 5001,
  // },
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
