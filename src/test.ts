import { config } from 'dotenv'
import { AzureStorageClient } from './azure'
import { GCPStorageClient } from './gcp'
import { S3Client } from './s3'

config()

const testData = {
  filename: 'test.txt',
  data: 'Hello, World!'
}

const testS3 = async () => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    accessKey: process.env.AWS_ACCESS_KEY!,
    accessSecret: process.env.AWS_ACCESS_SECRET!,
    bucket: process.env.AWS_BUCKET!,
    host: process.env.AWS_HOST
  })

  await s3Client.addFile({
    filename: testData.filename,
    data: testData.data
  })

  await s3Client.getFile(testData.filename)

  await s3Client.deleteFile(testData.filename)
}

const testGCPStorage = async () => {
  const gcpStorageClient = new GCPStorageClient({
    projectId: process.env.GCP_PROJECT_ID!,
    privateKey: process.env.GCP_PRIVATE_KEY!,
    clientEmail: process.env.GCP_CLIENT_EMAIL!,
    bucket: process.env.GCP_STORAGE_BUCKET!
  })

  await gcpStorageClient.addFile(
    {
      filename: testData.filename,
      data: testData.data
    },
    true
  )

  await gcpStorageClient.getFile(testData.filename)

  await gcpStorageClient.deleteFile(testData.filename)
}

const testAzureStorage = async () => {
  const azureStorageClient = new AzureStorageClient({
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME!
  })

  await azureStorageClient.addFile({
    filename: testData.filename,
    data: testData.data
  })

  await azureStorageClient.getFile(testData.filename)

  await azureStorageClient.deleteFile(testData.filename)
}

const main = async () => {
  await testS3()
  await testGCPStorage()
  await testAzureStorage()
}

main()
