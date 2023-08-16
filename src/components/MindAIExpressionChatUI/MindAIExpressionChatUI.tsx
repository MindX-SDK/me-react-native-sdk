import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CustomReply } from '../../components';
import DeviceInfo from 'react-native-device-info';
import RemoteStorageModule from '../../services/RemoteStorage/RemoteStorageModule';
import { RemoteStorageConfig } from '../../services/RemoteStorage/RemoteStorage.types';
import { ConversationData, MindExpressionApiEvents } from '../../MindExpressionApi/MindExpressionApi.type';
import { MindExpressionApi } from '../../MindExpressionApi/MindExpressionApi';
import { ButtonObjects, DateTimeObjects, GatewayResponse } from '../../services/ExpressionApi/ExpressionApi.types';
import { DateTimeHelper } from '../../utils';
import ChatList from '../ChatList/ChatList';

export type MindAIExpressionChatUIProps = {
    /**
     * Engine URL - You can get this on the integration page.
     * This is the main URL you will use to access the API’s endpoint
     */
    ENGINE_URL: string;
    /**
     * Auth Key - This is the authorization token on the integration page.
     * This token is used to authorize your access to the Mind Expression API.
     */
    AUTH_KEY: string;
    /**
     * Show log area or not
     */
    showLogCheck?: boolean;
    /**
     * Config of storage for media upload, please just config one of:
     * @s3BucketConfig or @azureBlobStorageConfig or @firebaseStorageConfig
     * SDK will only choose one of them.
     */
    remoteStorageConfig: RemoteStorageConfig
    /**
     * Show error message at bottom or not
     */
    showError?: boolean;
    /**
     * This is for test purpose only
     * - mockedMessages: temp message items
     */
    test?: {
        mockedMessages: ConversationData[];
    }
  }
  
const MindAIExpressionChatUI: React.FC<MindAIExpressionChatUIProps> = ({
    ENGINE_URL,
    AUTH_KEY,
    showLogCheck,
    showError,
    remoteStorageConfig,
    test,
}) => {
  //States
  const [mindExpressionAPI, setMindExpressionAPI] =
    useState<MindExpressionApi>();
  const [isStarted, setIsStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState<GatewayResponse>();
  const [messagesHistory, setMessagesHistory] = useState<ConversationData[]>(
    [],
  );
  const [logs, setLogs] = useState('');
  const [isCheckedLogs, setIsCheckedLogs] = useState(false);

  //Refs
  let flatlistRef = useRef<FlatList>(null);
  //Effects
  useEffect(() => {
    if (remoteStorageConfig && !RemoteStorageModule?.getInstance()) {
      RemoteStorageModule.setup(remoteStorageConfig);
    }
  }, []);
  useEffect(() => {
    const listener = mindExpressionAPI?.eventEmitter.on(MindExpressionApiEvents.NEW_MESSAGE, data => {
      console.log('new message', data?.newMessage);
      setMessagesHistory([...data?.conversationData, ...(test?.mockedMessages ?? []),]);
    });

    return () => {
      mindExpressionAPI?.eventEmitter?.removeListener(MindExpressionApiEvents.NEW_MESSAGE, listener);
    };
  });

  const login = async () => {
    const deviceUniqueId = await DeviceInfo.getUniqueId();
    setMindExpressionAPI(
      new MindExpressionApi(ENGINE_URL, AUTH_KEY, deviceUniqueId, {
        useLogger: true,
      }),
    );
    setIsStarted(false);
    setMessage('');
  };
  const greeting = async () => {
    const res = await mindExpressionAPI?.greeting();
    console.log('start.res:', res);
    setCurrentResponse(res);
    setIsStarted(!!res?.data);
  };

  const restart = async () => {
    const res = await mindExpressionAPI?.restart();
    console.log('restart.res:', res);
    setCurrentResponse(res);
    setIsStarted(!!res?.data);
  };

  const converse = async (msg: string = message) => {
    Keyboard.dismiss();
    setMessage('');
    const res = await mindExpressionAPI?.converse(msg);
    console.log('converse.res:', res);
    setCurrentResponse(res);
    flatlistRef?.current?.scrollToEnd({
      animated: false,
    });
  };

  const handleButtonAction = async (btnData: ButtonObjects) => {
    switch (btnData?.['button-type']) {
      case 'link': {
        if(btnData?.link) {
          Linking.openURL(btnData?.link);
        }
        break;
      }
      case 'message': {
        if (btnData?.message) {
          converse(btnData?.message);
        }
        break;
      }
    }
  };
  const handleQuickReply = async (qrData: CustomReply) => {
    if (qrData?.value) {
      switch (qrData?.actionType) {
        case 'link': {
          Linking.openURL(qrData?.value);
          break;
        }
        case 'message':
        default: {
          converse(qrData?.value);
          break;
        }
      }
    }
  };

  const handleDateTimeSelect = async (
    datetime: Date,
    endDate?: Date,
    pickerProps?: DateTimeObjects
  ) => {
    if (datetime?.valueOf?.()) {
      const finalStr = DateTimeHelper.formatMindXDatetime(datetime, endDate, pickerProps);
      converse(finalStr);
    }
  };

  const checkLogs = async () => {
    Keyboard.dismiss();
    const nLogs = mindExpressionAPI?.getLogs()?.join('\n\n') ?? '';
    setLogs(nLogs);
    setIsCheckedLogs(prev => !prev);
  };

  const renderLogin = () => {
    return (
      <TouchableOpacity
        style={[styles.button, { alignSelf: 'flex-end' }]}
        onPress={() => {
          login();
        }}>
        <Text style={styles.buttonText}>login</Text>
      </TouchableOpacity>
    );
  };

  const renderStart = () => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          greeting();
        }}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    );
  };

  const renderReset = () => {
    return (
      <TouchableOpacity
        style={[styles.button, { alignSelf: 'flex-end' }]}
        onPress={() => {
          restart();
        }}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    );
  }

  const renderChat = () => {
    return (
      <ChatList
        data={messagesHistory}
        user={{
          _id: 'User',
        }}
        keyboardShouldPersistTaps={'handled'}
        // ref={flatlistRef}
        // style={styles.flatlist}
        onSend={async messages => {
          for (let msg of messages) {
            await converse(msg.text);
          }
        }}
        onCardButtonPress={(btnData, _idx) => {
          handleButtonAction(btnData);
        }}
        onQuickReplyItemPress={(qrData, _idx) => {
          handleQuickReply(qrData);
        }}
        onDateTimeSelect={(datetime, endDate, pickerProps) => {
          handleDateTimeSelect(datetime, endDate, pickerProps);
        }}
      />
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.rowContainer}>
          {showLogCheck
            ? <TouchableOpacity
                style={[styles.button, { alignSelf: 'flex-start' }]}
                onPress={() => {
                checkLogs();
                }}>
                <Text style={styles.buttonText}>
                {isCheckedLogs ? 'Hide logs': 'Check Logs'}
                </Text>
            </TouchableOpacity>
            : <View />}
          {!mindExpressionAPI
            ? renderLogin()
            : !isStarted
              ? renderStart()
              : renderReset()}
        </View>
        <View style={{ height: 10 }} />
        {showLogCheck && isCheckedLogs
          ? <ScrollView style={styles.logScrollView}>
            <Text style={styles.logText}>
              {logs ? logs : 'No log found!'}
            </Text>
          </ScrollView>
          : undefined
        }

      </View>
    );
  }

  return (
    <View
      style={styles.backgroundStyle}
    >
      {renderHeader()}
      {mindExpressionAPI && isStarted
        ? renderChat()
        : undefined}
      {showError && !currentResponse?.data?.['channel-result']?.length &&
        currentResponse?.description ? (
        <Text style={styles.errorText}>
          Error: {currentResponse?.description}
        </Text>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#F2F4F5',
  },
  header: {
    paddingHorizontal: 20,
  },
  chatContainer: {},
  flatlist: {
    flexGrow: 1,
    height: 400,
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
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  logScrollView: {
    height: 100,
  },
  logText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'left',
    textAlignVertical: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MindAIExpressionChatUI;