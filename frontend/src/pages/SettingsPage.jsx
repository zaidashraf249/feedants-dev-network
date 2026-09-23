import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Save } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import TechStackBadges from '../components/profile/TechStackBadges';
import useAuth from '../hooks/useAuth';
import { useUpdateMyProfileMutation } from '../store/api/usersApi';
import { updateUser } from '../store/slices/authSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const [form, setForm] = useState({
    name: user?.name || '',
    title: user?.title || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || '',
    website: user?.website || '',
    avatar: user?.avatar || '',
    techStack: user?.techStack || [],
  });
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await updateProfile(form).unwrap();
      dispatch(updateUser(response.data.user));
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err?.data?.message || 'Could not update your profile.' });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-headline-sm font-bold">Edit profile</h1>

      <form onSubmit={handleSubmit} className="card-surface p-space-lg flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar src={form.avatar} name={form.name} size="lg" />
          <Input
            label="Avatar URL"
            value={form.avatar}
            onChange={handleChange('avatar')}
            placeholder="https://…"
            containerClassName="flex-1"
          />
        </div>

        <Input label="Full name" value={form.name} onChange={handleChange('name')} />
        <Input label="Title" value={form.title} onChange={handleChange('title')} placeholder="Staff Engineer @ Acme" />
        <Input label="Company" value={form.company} onChange={handleChange('company')} />
        <Input label="Location" value={form.location} onChange={handleChange('location')} placeholder="San Francisco, CA" />
        <Input label="Website" value={form.website} onChange={handleChange('website')} placeholder="https://yoursite.dev" />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="text-label-md font-semibold text-on-surface">
            Bio
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={handleChange('bio')}
            rows={4}
            maxLength={500}
            className="w-full rounded border border-brand-line p-3 text-body-md outline-none focus:ring-2 focus:ring-primary-fixed resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-label-md font-semibold text-on-surface">Tech stack</span>
          <TechStackBadges
            techStack={form.techStack}
            editable
            onChange={(techStack) => setForm((prev) => ({ ...prev, techStack }))}
          />
        </div>

        {status && (
          <p className={`text-body-sm rounded px-3 py-2 ${status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-error-container/30 text-error'}`}>
            {status.message}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="self-start">
          <Save className="w-4 h-4" /> Save changes
        </Button>
      </form>
    </div>
  );
};

export default SettingsPage;
