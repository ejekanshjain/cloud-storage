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

const testFirebaseStorage = async () => {
  const firebaseStorageClient = new GCPStorageClient({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    bucket: process.env.FIREBASE_STORAGE_BUCKET!,
    defaultMediaPublic: true
  })

  await firebaseStorageClient.addFile({
    filename: testData.filename,
    data: testData.data
  })

  await firebaseStorageClient.getFile(testData.filename)

  await firebaseStorageClient.deleteFile(testData.filename)
}

const testGCPStorage = async () => {
  const gcpStorageClient = new GCPStorageClient({
    projectId: process.env.GCP_PROJECT_ID!,
    privateKey: process.env.GCP_PRIVATE_KEY!,
    clientEmail: process.env.GCP_CLIENT_EMAIL!,
    bucket: process.env.GCP_STORAGE_BUCKET!,
    defaultMediaPublic: true
  })

  await gcpStorageClient.addFile({
    filename: testData.filename,
    data: testData.data
  })

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

const testR2 = async () => {
  const r2Client = new S3Client({
    region: process.env.R2_REGION!,
    accessKey: process.env.R2_ACCESS_KEY!,
    accessSecret: process.env.R2_ACCESS_SECRET!,
    bucket: process.env.R2_BUCKET!,
    host: process.env.R2_HOST!
  })

  await r2Client.addFile({
    filename: testData.filename,
    data: testData.data
  })

  await r2Client.getFile(testData.filename)

  await r2Client.deleteFile(testData.filename)
}

const main = async () => {
  await testS3()
  await testFirebaseStorage()
  await testGCPStorage()
  await testAzureStorage()
  await testR2()
}

main()
