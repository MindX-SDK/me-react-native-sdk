import { FileHelper } from '../../utils';
import { RemoteStorageService } from './RemoteStorageService';
import { FirebaseStorageConfigProps } from './RemoteStorage.types';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  FirebaseStorage,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export class FirebaseStorageService extends RemoteStorageService {
  private app: FirebaseApp;
  private fbStorage: FirebaseStorage;
  private rootPath: string;
  constructor(config: FirebaseStorageConfigProps) {
    super();
    this.app = initializeApp(config.options);
    this.fbStorage = getStorage();
    this.rootPath = this.buildRootPath(config.rootDirectory);
  }

  uploadFile = async (
    path: string,
    uploadFileName: string
  ): Promise<string> => {
    try {
      const blob = await FileHelper.uriToBlob(path);

      // Reference of file to upload
      const fileRef = ref(this.fbStorage, this.buildFilePath(uploadFileName));
      //Upload the file. Use uploadTask for if we want to control upload in the future
      const uploadTask = uploadBytesResumable(fileRef, blob);
      const result = await uploadTask;
      console.log(result);

      return await getDownloadURL(fileRef);
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  ///Private functions
  private buildRootPath = (name: string) => {
    // Root is `/`
    if (!name) {
      return '';
    }

    // Root is `/name/`
    if (!name.startsWith('/') && !name.startsWith('\\')) {
      name = '/' + name;
    }
    if (!name.endsWith('/') && !name.endsWith('\\')) {
      name = name + '/';
    }

    return name;
  };

  private buildFilePath = (fileName: string) => {
    return `${this.rootPath}${fileName}`;
  };
}
