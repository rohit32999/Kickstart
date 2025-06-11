import React, { useState } from 'react';
import { PersonalityProfile } from '../pages/enhancedCareerRecommendation';

interface Props {
  onSubmit: (profile: PersonalityProfile) => void;
}

const defaultProfile: PersonalityProfile = {
  introvertExtrovert: '',
  leadership: '',
  creativity: '',
  riskTolerance: '',
  communication: '',
};

export const PersonalityProfileForm: React.FC<Props> = ({ onSubmit }) => {
  // Load from localStorage if present
  const getInitialProfile = () => {
    try {
      const saved = localStorage.getItem('personalityProfile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultProfile;
  };
  const [profile, setProfile] = useState<PersonalityProfile>(getInitialProfile());

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
    localStorage.setItem('personalityProfile', JSON.stringify(profile));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">      <div>
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Are you more of an introvert, extrovert, or ambivert?</label>
        <select name="introvertExtrovert" value={profile.introvertExtrovert} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="">Select</option>
          <option value="introvert">Introvert</option>
          <option value="extrovert">Extrovert</option>
          <option value="ambivert">Ambivert</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Leadership skills</label>
        <select name="leadership" value={profile.leadership} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="">Select</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Creativity</label>
        <select name="creativity" value={profile.creativity} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="">Select</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Risk tolerance</label>
        <select name="riskTolerance" value={profile.riskTolerance} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="">Select</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Communication skills</label>
        <select name="communication" value={profile.communication} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="">Select</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors">Continue</button>
    </form>
  );
};

export default PersonalityProfileForm;
