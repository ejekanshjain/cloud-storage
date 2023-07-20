import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { z } from 'zod'
import { AddFileOptions, AzureStorageClientOptions } from './types'

const AzureStorageClientOptionsZ = z.object({
  connectionString: z.string().min(1),
  containerName: z.string().min(1)
})

export class AzureStorageClient {
  private connectionString: string
  private containerName: string
  private blobServiceClient: BlobServiceClient
  private containerClient: ContainerClient

  constructor(options: AzureStorageClientOptions) {
    const parsed = AzureStorageClientOptionsZ.parse(options)
    this.connectionString = parsed.connectionString
    this.containerName = parsed.containerName
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.connectionString
    )
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    )
  }

  async getBlobServiceClient() {
    return this.blobServiceClient
  }

  async getContainerClient() {
    return this.containerClient
  }

  async addFile(options: AddFileOptions) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(
      options.filename
    )
    let data: Buffer
    if (typeof options.data === 'string') data = Buffer.from(options.data)
    else data = options.data

    await blockBlobClient.uploadData(data)
    return blockBlobClient.url
  }

  async deleteFile(filename: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename)
    await blockBlobClient.delete()
  }

  async getFile(filename: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename)
    const buffer = await blockBlobClient.downloadToBuffer()
    return Buffer.from(buffer)
  }
}
