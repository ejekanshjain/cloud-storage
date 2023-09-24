import {
  S3Client as AS3Client,
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

export class S3Client {
  private region: string
  private accessKey: string
  private accessSecret: string
  private s3Client: AS3Client
  private bucket: string
  private host?: string

  constructor(options: z.infer<typeof S3ClientOptionsZ>) {
    const parsed = S3ClientOptionsZ.parse(options)

    this.region = parsed.region
    this.accessKey = parsed.accessKey
    this.accessSecret = parsed.accessSecret
    this.bucket = parsed.bucket
    this.host = parsed.host

    this.s3Client = new AS3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.accessSecret
      },
      endpoint: this.host,
      forcePathStyle: !!this.host
    })
  }

  getClient() {
    return this.s3Client
  }

  async addFile(options: AddFileOptions) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: options.filename,
        Body: options.data
      })
    )
    return this.host
      ? `${this.host}/${this.bucket}/${options.filename}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${options.filename}`
  }

  async deleteFile(filename: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filename
      })
    )
  }

  async getFile(filename: string) {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: filename
      })
    )

    if (!response.Body) throw new Error('AWS S3: No body in response')

    return Buffer.from((await response.Body.transformToByteArray()).buffer)
  }
}
