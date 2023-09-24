import { BlobServiceClient } from '@azure/storage-blob'
import { z } from 'zod'
import { AddFileOptions } from './types'

const AzureStorageClientOptionsZ = z.object({
  connectionString: z.string().min(1),
  containerName: z.string().min(1)
})

export const AzureStorageClient = (
  options: z.infer<typeof AzureStorageClientOptionsZ>
) => {
  const { connectionString, containerName } =
    AzureStorageClientOptionsZ.parse(options)

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString)

  const containerClient = blobServiceClient.getContainerClient(containerName)

  const addFile = async (options: AddFileOptions) => {
    const blockBlobClient = containerClient.getBlockBlobClient(options.filename)
    let data: Buffer
    if (typeof options.data === 'string') data = Buffer.from(options.data)
    else data = options.data

    await blockBlobClient.uploadData(data)
    return blockBlobClient.url
  }

  const deleteFile = async (filename: string) => {
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    await blockBlobClient.delete()
  }

  const getFile = async (filename: string) => {
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    const buffer = await blockBlobClient.downloadToBuffer()
    return Buffer.from(buffer)
  }

  return {
    addFile,
    deleteFile,
    getFile
  }
}
