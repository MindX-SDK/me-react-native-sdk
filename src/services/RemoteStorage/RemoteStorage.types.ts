import { ConfigurationOptions } from 'aws-sdk';
import { APIVersions } from 'aws-sdk/lib/config';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { FirebaseOptions } from 'firebase/app';

export type S3BucketConfigOptions = ConfigurationOptions &
  ConfigurationServicePlaceholders &
  APIVersions & { [key: string]: any };

export type S3BucketConfigProps = {
  /**
   * Name of Bucket project
   */
  bucketName: string;
  /**
   * Options for init S3 Bucket client
   */
  options: S3BucketConfigOptions;
};

export type AzureBlobStorageConfigProps = {
  /**
   * Name of Azure Blob Storage Project
   */
  storageName: string;
  /**
   * Define name of storage container, SDK will auto-create it if not exist in Azure Blob project
   */
  containerName: string;
  /**
   * Azure's Share access signature token
   */
  sasToken: string;
};

export type FirebaseStorageConfigProps = {
  /**
   * Define name of root directory to upload data, SDK will create if it not exist in Firebase Storage
   */
  rootDirectory: string;
  /**
   * Options for init Firebase App
   */
  options: FirebaseOptions;
};

export interface RemoteStorageConfig {
  /**
   * Config data of S3 Bucket
   */
  s3BucketConfig?: S3BucketConfigProps;
  /**
   * Config data of Azure Blob Storage
   */
  azureBlobStorageConfig?: AzureBlobStorageConfigProps;
  /**
   * Config data of Firebase Storage
   */
  firebaseStorageConfig?: FirebaseStorageConfigProps;
}
