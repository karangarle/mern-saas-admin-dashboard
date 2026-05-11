import { useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import apiClient from '../../services/apiClient.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

export default function Profile() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const previewLabel = useMemo(() => (
    file ? `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG, or WEBP up to 2 MB'
  ), [file]);

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

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error('Please choose an image first');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    setIsUploading(true);

    try {
      const { data } = await apiClient.patch('/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = data.data.user.profileImage?.url;
      setProfileImage(imageUrl || '');
      toast.success(data.message || 'Profile image updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to upload profile image');
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = preview || profileImage;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Toaster position="top-right" />

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          Profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Profile image
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Upload a clean avatar for your dashboard account.
        </p>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
        onSubmit={handleUpload}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
            {displayImage ? (
              <img src={displayImage} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-slate-400">AD</span>
            )}
          </div>

          <div className="flex-1">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:file:bg-white dark:file:text-slate-950"
              />
            </label>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{previewLabel}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isUploading || !file}
            className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
          >
            {isUploading ? 'Uploading...' : 'Upload image'}
          </button>
        </div>
      </form>
    </div>
  );
}
