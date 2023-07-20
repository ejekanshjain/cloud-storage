import { config } from 'dotenv'
import { FirestorageClient } from './firebase'
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
  const firestorageClient = new FirestorageClient({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    bucket: process.env.FIREBASE_STORAGE_BUCKET!
  })

  await firestorageClient.addFile(
    {
      filename: testData.filename,
      data: testData.data
    },
    true
  )

  await firestorageClient.getFile(testData.filename)

  await firestorageClient.deleteFile(testData.filename)
}

const main = async () => {
  await testS3()
  await testFirebaseStorage()
}

main()
