export const MAX_IMAGE_FILE_BYTES = 3 * 1024 * 1024

export const uploadRules = {
  maxFileBytes: MAX_IMAGE_FILE_BYTES,
  allowedMimeTypes: new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']),
}
