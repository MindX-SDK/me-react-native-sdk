import { PermissionsAndroid } from 'react-native';
import { isAndroid, releaseVersion } from '../../../utils/constants/constants';
import {
  RecorderPlayerShowFunctionProps,
  RecorderPlayerResponsiveRef,
} from './RecorderPlayerResponsiveView';

class RecorderPlayerResponsiveManager {
  _currentPopup: RecorderPlayerResponsiveRef | undefined;

  register(_instance: RecorderPlayerResponsiveRef) {
    if (!this._currentPopup) {
      this._currentPopup = _instance;
    }
  }
  unregister(_instance: RecorderPlayerResponsiveRef) {
    if (!!this._currentPopup && this._currentPopup === _instance) {
      this._currentPopup = undefined;
    }
  }
  getCurrent() {
    return this._currentPopup;
  }

  togglePopup() {
    if (this?._currentPopup) {
      this._currentPopup?.togglePopup?.();
    }
  }

  async showPopup(props: RecorderPlayerShowFunctionProps) {
    if (!(await this.checkPermissions())) {
      return;
    }

    if (this?._currentPopup) {
      this._currentPopup?.showPopup?.(props);
    }
  }

  hidePopup() {
    if (this?._currentPopup) {
      this._currentPopup?.hidePopup?.();
    }
  }

  async showPopupAsync(
    props: RecorderPlayerShowFunctionProps
  ): Promise<string> {
    if (this?._currentPopup) {
      return await new Promise(async (resolve, reject) => {
        if (!(await this.checkPermissions())) {
          return reject('Permissions not granted');
        }

        this._currentPopup?.showPopup?.({
          ...props,
          onClose: (result) => {
            props?.onClose?.(result);
            if (result) {
              return resolve(result);
            } else {
              return reject('Empty data');
            }
          },
        });
      });
    }
    return Promise.reject('Popup not initialized');
  }

  //Private functions
  /**
   * Check Permission for start record
   * @returns permission result
   */
  private async checkPermissions(): Promise<boolean> {
    // Prepare android permissions
    if (isAndroid) {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        // console.log('Record permissions:', grants);

        if (
          ((grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED) ||
            releaseVersion >= '13') &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          // console.log('permissions granted');
          return true;
        } else {
          // console.log('All required permissions not granted');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }

    return true;
  }
}

export default new RecorderPlayerResponsiveManager();
