import { config } from 'dotenv'
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

const main = async () => {
  await testS3()
}

main()
