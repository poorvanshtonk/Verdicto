import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Pencil } from './icons';

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-bold text-gray-500">{label}</p>
    <p className="text-lg text-brand-dark">{value ?? 'N/A'}</p>
  </div>
);

const EditRow: React.FC<{ label: string; name: keyof User; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; isTextArea?: boolean }> = ({ label, name, value, onChange, type = 'text', isTextArea = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    {isTextArea ? (
      <textarea
        id={name}
        name={name}
        value={value ?? ''} // Ensure value is not null or undefined
        onChange={onChange}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    ) : (
      <input
        id={name}
        type={type}
        name={name}
        value={value ?? ''} // Ensure value is not null or undefined
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    )}
  </div>
);

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Fix: Initialize formData with a fallback object to prevent `undefined` values.
  const [formData, setFormData] = useState<User>(user || {
    fullName: '',
    username: '',
    email: '',
    age: 0,
    bio: ''
  });

  useEffect(() => {
    // Only update formData if the user prop changes and is not null/undefined
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? 0 : parseInt(value, 10) || 0) : value
    }));
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            <Pencil className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <EditRow label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <EditRow label="Username" name="username" value={formData.username} onChange={handleChange} />
          <EditRow label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" />
          <EditRow label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
          <EditRow label="Bio" name="bio" value={formData.bio} onChange={handleChange} isTextArea />
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow label="Full Name" value={formData.fullName} />
          <InfoRow label="Username" value={formData.username} />
          <InfoRow label="Email Address" value={formData.email} />
          <InfoRow label="Age" value={formData.age} />
          <div className="md:col-span-2">
             <InfoRow label="Bio" value={formData.bio} />
          </div>
        </div>
      )}
    </div>
  );
};
