"use client"
import { useState } from "react"
import { EditProfileForm } from '@/components/ui/editProfileForm';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Briefcase, GraduationCap, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserInfo {
  name: string;
  email: string;
  bio: string;
  location: string;
  occupation: string;
  joinDate: string;
  profileImage: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Full-stack developer and student passionate about creating tools that make life easier. Always learning something new!",
    location: "San Francisco, CA",
    occupation: "Software Developer & Student",
    joinDate: "January 2024",
    profileImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face"
  });

  const skills = ["JavaScript", "React", "Python", "Design", "Writing", "Data Analysis"];

  const handleSaveProfile = (updatedInfo: UserInfo) => {
    setUserInfo(updatedInfo);
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="suite-page">
        <div className="suite-content">
          <EditProfileForm 
            userInfo={userInfo}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] hover:border-purple-400/40 hover:bg-slate-900/70">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] hover:from-purple-500 hover:to-blue-500"
                >
                  <Edit2 className="w-4 h-4 mr-2 inline" />
                  Edit Profile
                </button>
              </div>
              
              <div className="flex items-start gap-6">
                <img
                  src={userInfo.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-3 border-purple-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{userInfo.name}</h3>
                  <p className="text-gray-300 mb-2">{userInfo.email}</p>
                  <p className="text-gray-400 text-sm mb-1">{userInfo.occupation}</p>
                  <p className="text-gray-400 text-sm">{userInfo.location}</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:border-blue-400/40 hover:bg-slate-900/70">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">About</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{userInfo.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>{userInfo.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>{userInfo.occupation}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  <CalendarDays className="w-5 h-5 text-indigo-400" />
                  <span>Joined {userInfo.joinDate}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span>Computer Science</span>
                </div>
              </div>
            </div>

            {/* Skills Section - Enhanced highlighting */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] hover:border-indigo-400/40 hover:bg-slate-900/70">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Skills & Interests</h2>
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="relative px-6 py-3 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80 border-2 border-purple-400/50 rounded-full text-white text-sm font-semibold transition-all duration-300 ease-in-out hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 hover:border-blue-300/70 hover:shadow-[0_8px_25px_rgba(139,92,246,0.5)] hover:-translate-y-1 hover:scale-105 cursor-pointer group overflow-hidden"
                  >
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-blue-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    
                    <span className="relative z-10">{skill}</span>
                  </span>
                ))}
              </div>
              
              {/* Add skill button */}
              <button className="mt-6 px-4 py-2 border-2 border-dashed border-purple-400/40 rounded-full text-purple-300 text-sm font-medium transition-all duration-300 hover:border-purple-300/60 hover:text-purple-200 hover:bg-purple-900/20">
                + Add Skill
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] hover:border-purple-400/40 hover:bg-slate-900/70">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                  <span className="text-gray-300">Tools Used</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">127</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                  <span className="text-gray-300">Files Processed</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">2,834</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                  <span className="text-gray-300">Time Saved</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">45h</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-indigo-400 text-sm font-medium">{userInfo.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:border-blue-400/40 hover:bg-slate-900/70">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Recent Activity</h2>
              <div className="flex flex-col gap-3">
                <div className="p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-blue-500/10 rounded-lg transition-all duration-300 ease-in-out hover:from-slate-700/60 hover:to-slate-600/60 hover:border-blue-400/30 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
                  <div className="text-sm text-blue-400 mb-1 font-medium">2 hours ago</div>
                  <div className="text-gray-200">Used JSON Formatter</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-purple-500/10 rounded-lg transition-all duration-300 ease-in-out hover:from-slate-700/60 hover:to-slate-600/60 hover:border-purple-400/30 hover:shadow-[0_4px_12px_rgba(139,92,246,0.2)]">
                  <div className="text-sm text-purple-400 mb-1 font-medium">Yesterday</div>
                  <div className="text-gray-200">Generated QR Code</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-indigo-500/10 rounded-lg transition-all duration-300 ease-in-out hover:from-slate-700/60 hover:to-slate-600/60 hover:border-indigo-400/30 hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                  <div className="text-sm text-indigo-400 mb-1 font-medium">2 days ago</div>
                  <div className="text-gray-200">Created Color Palette</div>
                </div>
              </div>
            </div>

            {/* Current Plan Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] hover:border-indigo-400/40 hover:bg-slate-900/70">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Current Plan</h2>
              <div className="flex flex-col gap-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Free Plan</div>
                <div className="text-gray-300">Access to basic tools and features</div>
                <button className="mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] hover:from-purple-500 hover:to-blue-500">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;