import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { cloudinary } from '../config/cloudinary';
import multer from 'multer';
import https from 'node:https';
import { URL } from 'node:url';

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single('file');

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const upload = await cloudinary.uploader.upload_stream(
    { resource_type: 'auto', folder: 'everkeep' },
    (error, result) => {
      if (error || !result) {
        return res.status(500).json({ success: false, message: 'Upload failed', timestamp: new Date().toISOString() });
      }
      return res.status(201).json({
        success: true,
        message: 'Uploaded',
        data: { publicId: result.public_id, url: result.secure_url, bytes: result.bytes, format: result.format },
        timestamp: new Date().toISOString(),
      });
    }
  );

  // @ts-ignore
  upload.end(req.file.buffer);
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.params as { publicId: string };
  if (!publicId) throw new AppError('publicId required', 400);
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  res.status(200).json({ success: true, message: 'Deleted', data: result, timestamp: new Date().toISOString() });
});

export const proxyDownload = asyncHandler(async (req: Request, res: Response) => {
  const { url, filename } = req.query as { url?: string; filename?: string };
  if (!url) throw new AppError('url query param is required', 400);

  // basic validation of URL
  let parsed: URL;
  try {
    parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !/\.cloudinary\.com$/i.test(parsed.hostname)) {
      throw new Error('Invalid host');
    }
  } catch {
    throw new AppError('Invalid URL', 400);
  }

  const safeFilename = (filename || 'download').replace(/[^a-zA-Z0-9._ -]/g, '_').trim() || 'download';

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Cache-Control', 'private, max-age=600');

  https
    .get(parsed.toString(), (r) => {
      if (!r.statusCode || r.statusCode >= 400) {
        res.status(r.statusCode || 500).end('Failed to fetch file');
        r.resume();
        return;
      }
      const contentType = r.headers['content-type'] || 'application/octet-stream';
      res.setHeader('Content-Type', Array.isArray(contentType) ? contentType[0] : contentType);
      r.pipe(res);
    })
    .on('error', (err) => {
      res.status(500).end('Download failed');
    });
});

export const signedDownload = asyncHandler(async (req: Request, res: Response) => {
  const { public_id, resource_type, filename, delivery_type, format } = req.query as any;
  if (!public_id) throw new AppError('public_id is required', 400);

  const resourceType = (resource_type as string) || 'image';
  const type = (delivery_type as string) || 'upload';
  const attachName = (filename as string) || 'download';

  // If the asset is private/authenticated, prefer private_download_url
  if (type === 'private' || type === 'authenticated') {
    if (!format) throw new AppError('format is required for private/authenticated downloads', 400);
    const url = cloudinary.utils.private_download_url(public_id, String(format), {
      resource_type: resourceType,
      attachment: true,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });
    return res.status(200).json({ success: true, message: 'Signed URL generated', data: { url }, timestamp: new Date().toISOString() });
  }

  // Public upload: sign a delivery URL with fl_attachment
  const url = cloudinary.url(public_id, {
    resource_type: resourceType,
    type: type as any,
    secure: true,
    sign_url: true,
    transformation: [
      { flags: 'attachment', attachment: attachName },
    ],
  });

  return res.status(200).json({ success: true, message: 'Signed URL generated', data: { url }, timestamp: new Date().toISOString() });
}); 