import * as admin from 'firebase-admin'
import { z } from 'zod'
import { AddFileOptions, FirebaseClientOptions } from './types'

const FirebaseClientOptionsZ = z.object({
  projectId: z.string().min(1),
  privateKey: z.string().min(1),
  clientEmail: z.string().min(1),
  bucket: z.string().min(1)
})

export class FirestorageClient {
  private admin: admin.app.App
  private storage: admin.storage.Storage

  constructor(options?: FirebaseClientOptions, adminApp?: admin.app.App) {
    if (adminApp) {
      this.admin = adminApp
    } else if (options) {
      const parsed = FirebaseClientOptionsZ.parse(options)
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: parsed.projectId,
          privateKey: parsed.privateKey,
          clientEmail: parsed.clientEmail
        }),
        storageBucket: parsed.bucket
      })
      this.admin = admin.app()
    } else {
      throw new Error('Must provide options or admin app')
    }
    this.storage = this.admin.storage()
  }

  getAdmin() {
    return this.admin
  }

  private getBucket() {
    return this.storage.bucket()
  }

  async addFile(options: AddFileOptions, isPublic?: boolean) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(options.filename)
    await fileRef.save(options.data, {
      public: isPublic
    })
    const url = fileRef.publicUrl()
    return {
      response: fileRef,
      url
    }
  }

  async deleteFile(filename: string) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(filename)
    await fileRef.delete()
    return {
      response: fileRef
    }
  }

  async getFile(filename: string) {
    const bucket = this.getBucket()
    const fileRef = bucket.file(filename)
    const downloaded = await fileRef.download()
    return {
      response: fileRef,
      buffer: downloaded[0].copyWithin(0)
    }
  }
}
