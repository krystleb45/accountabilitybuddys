/**
 * Mocks file upload functionality for testing purposes.
 */

interface UploadedFile {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadUrl: string;
}

interface UploadResponse {
  url: string;
  status: number;
  data: UploadedFile;
  message: string;
}

const mockUploadedFiles: UploadedFile[] = [];

/**
 * Simulates a file upload.
 * @param file - The file to upload.
 * @param url - The URL to which the file is uploaded (default: '/upload').
 * @param options - Additional options for the upload (e.g., headers, progress).
 * @returns A Promise that resolves with a mock response containing file details.
 */
export function uploadFile(
  file: File,
  url: string = '/upload',
  options: { delay?: number } = {}
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!file || !(file instanceof File)) {
        console.error('[FileUpload Mock] Invalid file provided');
        reject(new Error('Invalid file provided'));
        return;
      }

      const mockResponse: UploadResponse = {
        url,
        status: 200,
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadUrl: `${url}/${file.name}`,
        },
        message: 'File uploaded successfully',
      };

      mockUploadedFiles.push({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadUrl: mockResponse.data.uploadUrl,
      });

      console.log('[FileUpload Mock] File uploaded:', mockResponse.data);
      resolve(mockResponse);
    }, options.delay || 100); // Optional delay to simulate network latency
  });
}

/**
 * Retrieves the list of uploaded files.
 * @returns An array of uploaded file details.
 */
export function getUploadedFiles(): UploadedFile[] {
  console.log('[FileUpload Mock] Retrieved uploaded files:', mockUploadedFiles);
  return [...mockUploadedFiles];
}

/**
 * Resets the mock uploaded files (useful for tests).
 */
export function resetUploadedFiles(): void {
  mockUploadedFiles.length = 0;
  console.log('[FileUpload Mock] All uploaded files cleared');
}
