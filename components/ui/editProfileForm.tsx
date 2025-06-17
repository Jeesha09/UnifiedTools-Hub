import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus, Save, XCircle } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  bio: string;
  location: string;
  occupation: string;
  profileImage: string;
}

interface EditProfileFormProps {
  userInfo: UserInfo;
  onSave: (updatedInfo: UserInfo) => void;
  onCancel: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ userInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState(userInfo);
  const [skills, setSkills] = useState(["JavaScript", "React", "Python", "Design", "Writing", "Data Analysis"]);
  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 shadow-[0_20px_40px_rgba(139,92,246,0.15)] transition-all duration-300">
          <CardHeader className="border-b border-slate-700/50 pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Preview */}
              <div className="flex items-center gap-6 p-4 bg-slate-800/30 rounded-lg border border-purple-500/10">
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-400/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                />
                <div className="flex-1">
                  <Label htmlFor="profileImage" className="text-gray-300 font-medium mb-2 block">
                    Profile Image URL
                  </Label>
                  <Input
                    id="profileImage"
                    value={formData.profileImage}
                    onChange={(e) => handleInputChange('profileImage', e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300 font-medium">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  />
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-gray-300 font-medium">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Your job title or profession"
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300 font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-indigo-500/10">
                <Label className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                  Skills & Interests
                </Label>
                
                {/* Current Skills */}
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="relative px-4 py-2 bg-gradient-to-r from-purple-600/60 via-blue-600/60 to-indigo-600/60 border border-purple-400/40 rounded-full text-white text-sm font-medium transition-all duration-300 ease-in-out hover:from-purple-500/80 hover:via-blue-500/80 hover:to-indigo-500/80 hover:border-blue-300/60 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 group cursor-pointer"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-gray-300 hover:text-red-400 transition-colors duration-200 group-hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Skill */}
                <div className="flex gap-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 bg-slate-800/50 border-indigo-500/30 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    className="px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none transition-all duration-300 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="px-6 py-2 bg-transparent border-2 border-gray-500/50 text-gray-300 hover:border-red-400/50 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="px-8 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white border-none font-semibold transition-all duration-300 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};