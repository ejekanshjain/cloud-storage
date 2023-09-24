import { Storage } from '@google-cloud/storage'
import { z } from 'zod'
import { AddFileOptions } from './types'

const GCPStorageClientOptionsZ = z.object({
  projectId: z.string().min(1),
  privateKey: z.string().min(1),
  clientEmail: z.string().min(1),
  bucket: z.string().min(1),
  defaultMediaPublic: z.boolean()
})

export class GCPStorageClient {
  private projectId: string
  private privateKey: string
  private clientEmail: string
  private bucket: string
  private storage: Storage
  private isPublic: boolean

  constructor(options?: z.infer<typeof GCPStorageClientOptionsZ>) {
    const parsed = GCPStorageClientOptionsZ.parse(options)
    this.projectId = parsed.projectId
    this.privateKey = parsed.privateKey
    this.clientEmail = parsed.clientEmail
    this.bucket = parsed.bucket
    this.isPublic = parsed.defaultMediaPublic

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

  async addFile(options: AddFileOptions) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(options.filename)
    await fileRef.save(options.data, {
      public: this.isPublic
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
    return downloaded[0]
  }
}
