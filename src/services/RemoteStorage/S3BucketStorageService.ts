import { FileHelper } from "../../utils";
import { RemoteStorageService } from "./RemoteStorageService";
import AWS from 'aws-sdk';
import { S3BucketConfigProps } from "./RemoteStorage.types";


export class S3BucketStorageService extends RemoteStorageService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(config: S3BucketConfigProps) {
    super();
    AWS.config.update(config.options);
    this.s3 = new AWS.S3();
    this.bucketName = config.bucketName;
  }

  uploadFile = async (path: string, uploadFileName: string): Promise<string> => {
    try {
      const blob = await FileHelper.uriToBlob(path);

      const result = await this.s3.upload({
        Bucket: this.bucketName,
        Key: uploadFileName,
        Body: blob,
      }).promise()
      console.log(result);

      return result?.Location;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

}