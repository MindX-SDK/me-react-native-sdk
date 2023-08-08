import { FileHelper, UuidHelper } from "../../utils";
import { RemoteStorageService } from "./RemoteStorageService";
import { AzureBlobStorageConfigProps } from "./RemoteStorage.types";
import {
  BlobServiceClient,
  ContainerClient,
  ContainerCreateResponse,
} from "@azure/storage-blob";
global.Buffer = require('buffer').Buffer;


export class AzureBlobStorageService extends RemoteStorageService {
  private storageName: string;
  private containerName: string;
  private blobServiceClient!: BlobServiceClient;
  private containerClient!: ContainerClient;
  private containerCreateResponse?: ContainerCreateResponse;

  constructor(config: AzureBlobStorageConfigProps) {
    super();
    this.storageName = config.storageName;
    this.containerName = config.containerName;
    this.blobServiceClient = new BlobServiceClient(
      this.buildSASUrl(config.sasToken),
    )
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    this.createContainer();
  }

  createContainer = async () => {
    // Create the container
    try {
      this.containerCreateResponse = await this.containerClient.create();
      console.log(
        `Container was created successfully.\n\trequestId:${this.containerCreateResponse?.requestId
        }\n\tURL: ${this.containerClient.url
        }`
      );
    } catch (e: any) {
      console.log(e?.message);
    }
  }

  uploadFile = async (path: string, uploadFileName: string): Promise<string> => {
    try {
      const blob = await FileHelper.uriToBlob(path);

      // Get a block blob client
      const blockBlobClient = this.containerClient.getBlockBlobClient(uploadFileName);

      // Upload data to the blob
      const uploadBlobResponse = await blockBlobClient.upload(blob, blob.size);
      console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
      );

      return this.buildUploadedUrl(uploadFileName);
    } catch (e) {
      console.log(e);
      return '';
    }
  }


  ///Private functions
  private buildStorageUrl = () => {
    const url = `https://${this.storageName
      }.blob.core.windows.net`;

    return url;
  }
  private buildSASUrl = (sasToken: string) => {
    const url = `${this.buildStorageUrl()}/${sasToken?.startsWith('?') ? '' : '?'}${sasToken}`;

    return url;
  }
  private buildUploadedUrl = (fileNameOrPath: string) => {
    const url = `${this.buildStorageUrl()}/${this.containerName
      }/${fileNameOrPath}`;

    return url;
  }
}