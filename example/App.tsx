/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ConversationData, MindAIExpressionChatUI } from 'me-react-native-sdk';
import {
  AUTH_KEY,
  // AZURE_SAS_TOKEN_STRING,
  // AZURE_STORAGE_CONTAINER_NAME,
  // AZURE_STORAGE_NAME,
  ENGINE_URL,
  // S3_BUCKET_NAME,
  // S3_BUCKET_CONFIG,
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
          placeholder="enter engine url"
          multiline
          style={styles.textInput}
        />
        <View style={styles.verticalSpacing} />
        <TextInput
          onChangeText={setAuthKey}
          value={authKey}
          placeholder="enter auth key"
          multiline
          style={styles.textInput}
        />
        <View style={styles.verticalSpacing} />
        <TouchableOpacity
          style={[styles.button, styles.flexEnd]}
          onPress={() => {
            Keyboard.dismiss();
            setConfirm(true);
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
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
          },
        }}
        test={{
          mockedMessages: mockData,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F2F4F5'} />
      <View style={styles.verticalSpacing} />
      <Text style={styles.highlight}>Demo Mind EXPRESSION API</Text>
      <View style={styles.verticalSpacing} />
      {isConfirm ? renderChat() : renderInputUrl()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexEnd: {
    alignSelf: 'flex-end',
  },
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
  verticalSpacing: {
    height: 10,
  },
});

export default App;

const mockData: ConversationData[] = [];
