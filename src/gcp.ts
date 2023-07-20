import { Storage } from '@google-cloud/storage'
import { z } from 'zod'
import { AddFileOptions, GCPStorageClientOptions } from './types'

const GCPStorageClientOptionsZ = z.object({
  projectId: z.string().min(1),
  privateKey: z.string().min(1),
  clientEmail: z.string().min(1),
  bucket: z.string().min(1)
})

export class GCPStorageClient {
  private projectId: string
  private privateKey: string
  private clientEmail: string
  private bucket: string
  private storage: Storage

  constructor(options?: GCPStorageClientOptions) {
    const parsed = GCPStorageClientOptionsZ.parse(options)
    this.projectId = parsed.projectId
    this.privateKey = parsed.privateKey
    this.clientEmail = parsed.clientEmail
    this.bucket = parsed.bucket

    this.storage = new Storage({
      projectId: this.projectId,
      credentials: {
        private_key: this.privateKey,
        client_email: this.clientEmail
      }
    })
  }

  private getBucket() {
    return this.storage.bucket(this.bucket)
  }

  async addFile(options: AddFileOptions, isPublic?: boolean) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(options.filename)
    await fileRef.save(options.data, {
      public: isPublic
    })
    const url = fileRef.publicUrl()
    return url
  }

  async deleteFile(filename: string) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(filename)
    await fileRef.delete()
  }

  async getFile(filename: string) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(filename)
    const downloaded = await fileRef.download()
    return Buffer.from(downloaded[0].copyWithin(0))
  }
}
