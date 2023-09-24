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

export const GCPStorageClient = (
  options?: z.infer<typeof GCPStorageClientOptionsZ>
) => {
  const { projectId, privateKey, clientEmail, bucket, defaultMediaPublic } =
    GCPStorageClientOptionsZ.parse(options)

  const storage = new Storage({
    projectId,
    credentials: {
      private_key: privateKey,
      client_email: clientEmail
    }
  })

  const getBucket = () => storage.bucket(bucket)

  const addFile = async (options: AddFileOptions) => {
    const bucket = getBucket()
    const fileRef = bucket.file(options.filename)
    await fileRef.save(options.data, {
      public: defaultMediaPublic
    })
    const url = fileRef.publicUrl()
    return url
  }

  const deleteFile = async (filename: string) => {
    const bucket = getBucket()
    const fileRef = bucket.file(filename)
    await fileRef.delete()
  }

  const getFile = async (filename: string) => {
    const bucket = getBucket()
    const fileRef = bucket.file(filename)
    const downloaded = await fileRef.download()
    return downloaded[0]
  }

  return {
    addFile,
    deleteFile,
    getFile
  }
}
