import api from './axios'

/**
 * Helper: wraps a File in FormData and POSTs to the given endpoint.
 * Returns the Cloudinary URL string from the backend response.
 */
const uploadFile = async (file, endpoint) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data.url
}

// ── Generic Upload Endpoints ────────────────────────────────────

/** Upload a generic image → POST /api/upload/image */
export const uploadImage = (file) => uploadFile(file, '/api/upload/image')

/** Upload a document (pdf/doc) → POST /api/upload/document */
export const uploadDocument = (file) => uploadFile(file, '/api/upload/document')

/** Upload an event poster/banner → POST /api/upload/event-image */
export const uploadEventImage = (file) => uploadFile(file, '/api/upload/event-image')

/** Upload study notes → POST /api/upload/notes */
export const uploadNotes = (file) => uploadFile(file, '/api/upload/notes')

/** Upload a student submission → POST /api/upload/submission */
export const uploadSubmission = (file) => uploadFile(file, '/api/upload/submission')

// ── Student-specific Upload Endpoints ───────────────────────────

/** Upload profile picture → POST /api/student/upload/profile-pic */
export const uploadProfilePic = (file) => uploadFile(file, '/api/student/upload/profile-pic')

/** Upload resume → POST /api/student/upload/resume */
export const uploadResume = (file) => uploadFile(file, '/api/student/upload/resume')
