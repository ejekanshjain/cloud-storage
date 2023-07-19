export interface S3ClientOptions {
  region: string
  accessKey: string
  accessSecret: string
  bucket: string
  host?: string
}

export interface AddFileOptions {
  filename: string
  data: string | Buffer
}
