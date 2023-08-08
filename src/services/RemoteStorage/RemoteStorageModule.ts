import { AzureBlobStorageService } from "./AzureBlobStorageService";
import { FirebaseStorageService } from "./FirebaseStorageService";
import { RemoteStorageConfig } from "./RemoteStorage.types";
import { RemoteStorageService } from "./RemoteStorageService";
import { S3BucketStorageService } from "./S3BucketStorageService";

export class RemoteStorageServiceModule {
    private service!: RemoteStorageService;

    getInstance() {
        return this.service;
    }

    setup(configData: RemoteStorageConfig) {
        if (configData?.s3BucketConfig) {
            this.service = new S3BucketStorageService(configData.s3BucketConfig);
        } else if (configData?.azureBlobStorageConfig) {
            this.service = new AzureBlobStorageService(configData.azureBlobStorageConfig);
        } else if (configData?.firebaseStorageConfig) {
            this.service = new FirebaseStorageService(configData.firebaseStorageConfig);
        }
    }

    uploadFile = async (path: string, uploadFileName: string): Promise<string> => {
        return this.service.uploadFile(path, uploadFileName);
    }
}

const RemoteStorageModule = new RemoteStorageServiceModule();
export default RemoteStorageModule;