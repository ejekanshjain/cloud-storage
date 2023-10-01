# cloud-storage

### Import any one the client in your code base like this
```
import { AzureStorageClient } from '@ejekanshjain/cloud-storage'
import { GCPStorageClient } from '@ejekanshjain/cloud-storage'
import { S3Client } from '@ejekanshjain/cloud-storage'
```

### Initialize storageClient like this
```
const s3Client = S3Client({
  region: process.env.AWS_REGION!,
  accessKey: process.env.AWS_ACCESS_KEY!,
  accessSecret: process.env.AWS_ACCESS_SECRET!,
  bucket: process.env.AWS_BUCKET!,
  host: process.env.AWS_HOST
})
```

### Then you can call these methods to perform CRUD operations on file
```
await s3Client.addFile({
  filename: "test.txt",
  data: "Hello, World!"
})

await s3Client.getFile("test.txt")

await s3Client.deleteFile("test.txt")
```

## You can use the similar approach for Cloudflare R2, GCP Buckets, Azure Storage Buckets, Firebase Storage
