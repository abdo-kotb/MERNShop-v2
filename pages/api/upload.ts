import AWS from 'aws-sdk'
import formidable, { File } from 'formidable'
import { ReadStream } from 'fs'
import { ReadableOptions } from 'stream'
import path from 'path'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'
import { Request } from 'express'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser
  },
}

export default nextConnect({ onError: errorHandler }).post(
  async (req: Request, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, _fields, files) => {
      if (err) {
        res.status(500)
        throw new Error('Failed to parse form data')
      }

      let file: File
      if (Array.isArray(files['image'])) {
        file = files['image'][0]
      } else {
        file = files['image']
      }

      if (!file) {
        res.status(400)
        throw new Error('No image file found in request')
      }

      const stream = new ReadStream(file.filepath as ReadableOptions)
      const chunks: Buffer[] = []
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      stream.on('end', async () => {
        const buffer = Buffer.concat(chunks)

        const extname = path.extname(file.originalFilename!)

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `${file.originalFilename?.replace(
            extname,
            ''
          )}-${Date.now()}${extname}`, // Set the filename for the image
          Body: buffer, // The binary data for the image
          ContentType: file.mimetype as string, // The MIME type of the image
        }

        try {
          const result = await s3.upload(params).promise()
          return res.status(200).json(result.Location)
        } catch (error) {
          res.status(500)
          throw new Error('Failed to upload image')
        }
      })
    })
  }
)
