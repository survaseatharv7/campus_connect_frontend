import { useState, useRef, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  User, Mail, Phone, GraduationCap, Trophy, Github, Linkedin, 
  Globe, FileText, Camera, Upload, X, Save, Loader2, Plus
} from 'lucide-react'
import studentAPI from '../../api/student.api'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  year: z.string().min(1, 'Year is required'),
  semester: z.string().min(1, 'Semester is required'),
  rollNumber: z.string().optional(),
  division: z.string().optional(),
  skills: z.array(z.string()),
  bio: z.string().optional(),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').or(z.literal('')),
  portfolioUrl: z.string().url('Invalid Portfolio URL').or(z.literal('')),
})

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [skillInput, setSkillInput] = useState('')
  
  const imageInputRef = useRef(null)
  const resumeInputRef = useRef(null)

  const { data: profileResponse, isLoading, refetch } = useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const res = await studentAPI.getProfile()
      console.log('Profile API Response:', res.data)
      return res.data
    }
  })

  const profileData = profileResponse?.data || {}
  console.log('Mapped Profile Data:', profileData)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      year: '',
      semester: '',
      rollNumber: '',
      division: '',
      skills: [],
      bio: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
    }
  })

  const skills = watch('skills')

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      console.log('Resetting form with:', profileData)
      reset({
        name: profileData.name || "",
        phone: profileData.phone || "",
        year: profileData.year?.toString() || "",
        semester: profileData.semester?.toString() || "",
        rollNumber: profileData.rollNumber || "",
        division: profileData.division || "",
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        interests: Array.isArray(profileData.interests) ? profileData.interests : [],
        bio: profileData.bio || "",
        githubUrl: profileData.githubUrl || "",
        linkedinUrl: profileData.linkedinUrl || "",
        portfolioUrl: profileData.portfolioUrl || "",
        resumeUrl: profileData.resumeUrl || ""
      })
      if (profileData.profilePicUrl) {
        setImagePreview(profileData.profilePicUrl)
      }
    }
  }, [profileData, reset])

  const updateMutation = useMutation({
    mutationFn: (payload) => studentAPI.updateProfile(payload),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] })
      await refetch()
      // Update name in auth store if changed
      const { name } = watch()
      if (name !== user?.name) {
        updateUser({ name })
      }
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  const onImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB')
        return
      }
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onResumeChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume size must be less than 5MB')
        return
      }
      setResumeFile(file)
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue('skills', [...skills, skillInput.trim()], { shouldDirty: true })
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setValue('skills', skills.filter(s => s !== skillToRemove), { shouldDirty: true })
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const onSubmit = async (data) => {
    let uploadedProfilePicUrl = profileData?.profilePicUrl || ''
    let uploadedResumeUrl = profileData?.resumeUrl || ''

    try {
      // 1. Upload Profile Pic if a new one is selected
      if (profileImage) {
        const imageToast = toast.loading('Uploading profile picture...')
        const formData = new FormData()
        formData.append('file', profileImage)
        const uploadRes = await studentAPI.uploadProfilePic(formData)
        uploadedProfilePicUrl = uploadRes.data.data.url
        toast.success('Profile picture uploaded', { id: imageToast })
      }

      // 2. Upload Resume if a new one is selected
      if (resumeFile) {
        const resumeToast = toast.loading('Uploading resume...')
        const formData = new FormData()
        formData.append('file', resumeFile)
        const uploadRes = await studentAPI.uploadResume(formData)
        uploadedResumeUrl = uploadRes.data.data.url
        toast.success('Resume uploaded', { id: resumeToast })
      }
    } catch (err) {
      toast.error('File upload failed: ' + (err.response?.data?.message || err.message))
      return
    }

    // Ensure skills and interests are arrays (Safety Check)
    let finalSkills = data.skills
    if (typeof finalSkills === 'string') {
      try {
        finalSkills = JSON.parse(finalSkills)
      } catch (e) {
        finalSkills = finalSkills.split(',').map(s => s.trim())
      }
    }

    let finalInterests = data.interests
    if (typeof finalInterests === 'string') {
      try {
        finalInterests = JSON.parse(finalInterests)
      } catch (e) {
        finalInterests = finalInterests.split(',').map(s => s.trim())
      }
    }

    // Prepare clean JSON payload
    const payload = {
      ...data,
      skills: Array.isArray(finalSkills) ? finalSkills : [],
      interests: Array.isArray(finalInterests) ? finalInterests : [],
      year: data.year ? parseInt(data.year) : null,
      semester: data.semester ? parseInt(data.semester) : null,
      profilePicUrl: uploadedProfilePicUrl,
      resumeUrl: uploadedResumeUrl,
    }

    updateMutation.mutate(payload)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Avatar */}
      <section className="relative h-48 rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 overflow-visible mt-12 mb-20 transform-gpu">
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-300" />
                </div>
              )}
            </div>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-xl shadow-lg border border-dark-100 text-primary-600 hover:bg-primary-50 transition-all transform hover:scale-110 active:scale-95"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={imageInputRef}
              onChange={onImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-bold font-heading text-white drop-shadow-sm">
              {watch('name') || user?.name}
            </h1>
            <p className="text-primary-100 flex items-center gap-1.5 mt-1 font-medium bg-primary-900/20 px-3 py-1 rounded-full backdrop-blur-sm w-fit">
              <Mail className="w-4 h-4" />
              {profileData?.email || user?.email}
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card className="p-8 border-none shadow-sm bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-primary-600">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-dark-900">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Enter your full name"
                  icon={User}
                />
                <Input
                  label="Phone Number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="Enter your phone number"
                  icon={Phone}
                />
              </div>
            </Card>

            {/* Academic Info */}
            <Card className="p-8 border-none shadow-sm bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-secondary-600">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-dark-900">Academic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Year</label>
                  <select
                    {...register('year')}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
                      errors.year ? 'border-red-400' : 'border-dark-200'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {[1, 2, 3, 4].map(y => (
                      <option key={y} value={y.toString()}>Year {y}</option>
                    ))}
                  </select>
                  {errors.year && <p className="mt-1.5 text-sm text-red-500">{errors.year.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Semester</label>
                  <select
                    {...register('semester')}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
                      errors.semester ? 'border-red-400' : 'border-dark-200'
                    }`}
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s.toString()}>Semester {s}</option>
                    ))}
                  </select>
                  {errors.semester && <p className="mt-1.5 text-sm text-red-500">{errors.semester.message}</p>}
                </div>
                <Input
                  label="Roll Number"
                  {...register('rollNumber')}
                  placeholder="e.g. 21CO042"
                  icon={Trophy}
                />
                <Input
                  label="Division"
                  {...register('division')}
                  placeholder="e.g. A"
                  icon={User}
                />
              </div>
            </Card>

            {/* Professional Info */}
            <Card className="p-8 border-none shadow-sm bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-accent-600">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-dark-900">Professional Profile</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Bio</label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    placeholder="Tell us about yourself, your goals and what you're passionate about..."
                    className="w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="GitHub URL"
                    {...register('githubUrl')}
                    error={errors.githubUrl?.message}
                    placeholder="https://github.com/your-username"
                    icon={Github}
                  />
                  <Input
                    label="LinkedIn URL"
                    {...register('linkedinUrl')}
                    error={errors.linkedinUrl?.message}
                    placeholder="https://linkedin.com/in/your-username"
                    icon={Linkedin}
                  />
                  <Input
                    label="Portfolio URL"
                    {...register('portfolioUrl')}
                    error={errors.portfolioUrl?.message}
                    placeholder="https://your-portfolio.com"
                    icon={Globe}
                  />
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">Resume</label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => resumeInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 border-dashed border-2 bg-dark-50/50 hover:bg-dark-50"
                      >
                        {resumeFile ? (
                          <>
                            <FileText className="w-4 h-4 text-primary-600" />
                            <span className="truncate max-w-[150px]">{resumeFile.name}</span>
                          </>
                        ) : profileData?.resumeUrl ? (
                          <>
                            <FileText className="w-4 h-4 text-primary-600" />
                            <span>Update Resume</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Resume (PDF)</span>
                          </>
                        )}
                      </Button>
                      {(resumeFile || profileData?.resumeUrl) && (
                        <a 
                          href={resumeFile ? URL.createObjectURL(resumeFile) : profileData.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={onResumeChange}
                      accept=".pdf"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Skills & Actions */}
          <div className="space-y-8">
            {/* Skills */}
            <Card className="p-8 border-none shadow-sm bg-white/50 backdrop-blur-md sticky top-6">
              <div className="flex items-center gap-2 mb-6 text-primary-600">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Trophy className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-dark-900">Skills</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!skillInput.trim()}
                    className="aspect-square p-0 w-12 flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-primary-900 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-dark-400 italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-dark-100 mt-8 space-y-3">
                <Button
                  type="submit"
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                  disabled={updateMutation.isPending || (!isDirty && !profileImage && !resumeFile)}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Profile
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-dark-400">
                  Last updated: {profileData?.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
