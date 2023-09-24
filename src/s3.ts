import {
  S3Client as AWSS3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'
import { z } from 'zod'
import { AddFileOptions } from './types'

const S3ClientOptionsZ = z.object({
  region: z.string().min(1),
  accessKey: z.string().min(1),
  accessSecret: z.string().min(1),
  bucket: z.string().min(1),
  host: z.string().optional()
})

export const S3Client = (options: z.infer<typeof S3ClientOptionsZ>) => {
  const { region, accessKey, accessSecret, bucket, host } =
    S3ClientOptionsZ.parse(options)

  const s3Client = new AWSS3Client({
    region: region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: accessSecret
    },
    endpoint: host,
    forcePathStyle: !!host
  })

  const addFile = async (options: AddFileOptions) => {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: options.filename,
        Body: options.data
      })
    )
    return host
      ? `${host}/${bucket}/${options.filename}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${options.filename}`
  }

  const deleteFile = async (filename: string) => {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: filename
      })
    )
  }

  const getFile = async (filename: string) => {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: filename
      })
    )

    if (!response.Body) throw new Error('AWS S3: No body in response')

    return Buffer.from((await response.Body.transformToByteArray()).buffer)
  }

  return {
    addFile,
    deleteFile,
    getFile
  }
}
