export type S3ClientOptions = {
  region: string
  accessKey: string
  accessSecret: string
  bucket: string
  host?: string
}

export type FirebaseClientOptions = {
  projectId: string
  privateKey: string
  clientEmail: string
  bucket: string
}

export type AzureStorageClientOptions = {
  connectionString: string
  containerName: string
}

export type AddFileOptions = {
  filename: string
  data: string | Buffer
}
