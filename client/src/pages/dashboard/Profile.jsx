import { useState, useMemo, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.js';
import { updateUserInState } from '../../redux/features/auth/authSlice.js';
import apiClient from '../../services/apiClient.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Profile fields state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Image state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const previewLabel = useMemo(() => (
    file ? `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG, or WEBP up to 2 MB'
  ), [file]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('Image must be 2 MB or smaller');
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { data } = await apiClient.patch('/users/profile', formData);
      dispatch(updateUserInState(data.data.user));
      toast.success('Profile details updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profileImage', file);
    setIsUploading(true);

    try {
      const { data } = await apiClient.patch('/users/profile/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateUserInState(data.data.user));
      setFile(null);
      setPreview('');
      toast.success('Profile image updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to format image URL (handle local storage vs cloudinary)
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendUrl}${url}`;
  };

  const displayImage = preview || getImageUrl(user?.profileImage?.url);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <Toaster position="top-right" />

      {/* Header with Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white shadow-sm"
            aria-label="Go back"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Account Settings
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Edit Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Profile Image Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white mb-6">Profile Picture</h2>
          <form onSubmit={handleImageUpload} className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950 shadow-inner">
              {displayImage ? (
                <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-slate-400 dark:text-slate-600">{initials}</span>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload new image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-950 file:text-white hover:file:bg-slate-800 dark:file:bg-white dark:file:text-slate-950 transition-all cursor-pointer"
                />
                <p className="mt-2 text-xs text-slate-500">{previewLabel}</p>
              </div>
              
              {file && (
                <button
                  type="submit"
                  disabled={isUploading}
                  className="h-10 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save Image'}
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Profile Details Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white mb-6">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="submit"
                disabled={isUpdating}
                className="h-11 rounded-lg bg-slate-950 px-8 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
