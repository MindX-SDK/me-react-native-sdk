export abstract class RemoteStorageService {
  abstract uploadFile: (
    path: string,
    uploadFileName: string
  ) => Promise<string>;
}
