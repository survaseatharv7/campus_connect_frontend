import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, AlertCircle, X, FileText, Image, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { fixCloudinaryUrl } from '../../utils/formatters'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

/**
 * Reusable file upload component that uploads files through backend endpoints.
 *
 * @param {string}   label      – Field label
 * @param {string}   accept     – Accepted file types (e.g. "image/*", ".pdf,.doc,.docx", "*")
 * @param {function} uploadFn   – Async fn that receives a File and returns a URL string
 * @param {function} onUpload   – Callback with the resulting URL after success
 * @param {string}   value      – Currently stored URL (for preview / link)
 * @param {boolean}  disabled   – Disable the component
 * @param {number}   maxSizeMB  – Max file size in MB (default 10)
 * @param {string}   error      – External error message (e.g. from form validation)
 */
export default function FileUpload({
  label,
  accept = '*',
  uploadFn,
  onUpload,
  value = '',
  disabled = false,
  maxSizeMB = 10,
  error: externalError,
}) {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [fileName, setFileName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const isImage = accept?.startsWith('image')

  const handleFile = useCallback(
    async (file) => {
      if (!file) return

      // Validate size
      const maxBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxBytes) {
        setErrorMsg(`File size must be less than ${maxSizeMB}MB`)
        setStatus(STATUS.ERROR)
        return
      }

      setFileName(file.name)
      setErrorMsg('')
      setStatus(STATUS.UPLOADING)

      try {
        const url = await uploadFn(file)
        setStatus(STATUS.SUCCESS)
        onUpload?.(url)

        // Reset to idle after 2s so the user can upload again
        setTimeout(() => setStatus(STATUS.IDLE), 2000)
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message || 'Upload failed. Please try again.'
        )
        setStatus(STATUS.ERROR)
      }
    },
    [uploadFn, onUpload, maxSizeMB]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0])
      }
    },
    [handleFile]
  )

  // Convert accept prop to the format react-dropzone expects
  const getAcceptObj = () => {
    if (!accept || accept === '*') return undefined
    if (accept.startsWith('.')) {
      // e.g. ".pdf,.doc,.docx"
      return { 'application/octet-stream': accept.split(',').map((s) => s.trim()) }
    }
    if (accept === 'image/*') return { 'image/*': [] }
    return undefined
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptObj(),
    maxFiles: 1,
    disabled: disabled || status === STATUS.UPLOADING,
    noClick: status === STATUS.UPLOADING,
  })

  const handleClear = (e) => {
    e.stopPropagation()
    onUpload?.('')
    setFileName('')
    setStatus(STATUS.IDLE)
    setErrorMsg('')
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-1.5">
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {/* ── Existing value preview ── */}
        {value && status !== STATUS.UPLOADING ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-3 px-4 py-3 bg-white border border-dark-200 rounded-xl group"
          >
            {/* Thumbnail / icon */}
            {isImage && value ? (
              <img
                src={value}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-dark-100 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
            )}

            {/* File link */}
            <div className="flex-1 min-w-0">
              <a
                href={isImage ? value : fixCloudinaryUrl(value)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline truncate block"
              >
                {fileName || (isImage ? 'View Image' : 'View File')}
              </a>
              <p className="text-xs text-dark-400 truncate">{value}</p>
            </div>

            {/* Clear button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          /* ── Drop zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                'relative flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/30'
                  : 'border-dark-200 hover:border-primary-400 hover:bg-dark-50/50',
                status === STATUS.UPLOADING && 'pointer-events-none opacity-70',
                disabled && 'opacity-50 cursor-not-allowed',
                (externalError || (status === STATUS.ERROR && errorMsg)) &&
                  'border-red-400 hover:border-red-400'
              )}
            >
              <input {...getInputProps()} />

              <AnimatePresence mode="wait">
                {status === STATUS.UPLOADING ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-sm font-medium text-primary-600">
                      Uploading…
                    </p>
                    <p className="text-xs text-dark-400 truncate max-w-[200px]">
                      {fileName}
                    </p>
                  </motion.div>
                ) : status === STATUS.SUCCESS ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-600">
                      Uploaded successfully!
                    </p>
                    <p className="text-xs text-dark-400 truncate max-w-[200px]">
                      {fileName}
                    </p>
                  </motion.div>
                ) : status === STATUS.ERROR ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-medium text-red-500">
                      {errorMsg}
                    </p>
                    <p className="text-xs text-dark-400">
                      Click or drag to try again
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      {isImage ? (
                        <Image className="w-6 h-6 text-primary-500" />
                      ) : (
                        <Upload className="w-6 h-6 text-primary-500" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-dark-700">
                        {isDragActive ? (
                          'Drop the file here'
                        ) : (
                          <>
                            <span className="text-primary-600 font-semibold">
                              Click to browse
                            </span>{' '}
                            or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-dark-400 mt-1">
                        {accept === '*'
                          ? `Any file up to ${maxSizeMB}MB`
                          : `${accept} • Max ${maxSizeMB}MB`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* External validation error */}
      {externalError && (
        <p className="mt-1.5 text-sm text-red-500">{externalError}</p>
      )}
    </div>
  )
}
