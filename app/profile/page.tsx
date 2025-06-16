"use client"
import { useState } from "react"
import { ProfileHeader } from '@/components/ui/profileHeader';
import { ProfileStats } from '@/components/ui/profileStats';
import { EditProfileForm } from '@/components/ui/editProfileForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Briefcase, GraduationCap } from 'lucide-react';
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

  // Define common card styles based on your provided CSS
  const cardStyles = `
    transition-all duration-300
    bg-[rgba(255,255,255,0.05)]
    border border-[rgba(255,255,255,0.1)]
    hover:-translate-y-1
    hover:shadow-[0_10px_30px_rgba(79,70,229,0.2)]
    hover:border-[rgba(79,70,229,0.3)]
  `;

  if (isEditing) {
    return (
      // Apply the new dark background color and ensure text is light
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
    // Apply the new dark background color and ensure default text is light
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header - Ensure this component's internal text/colors are also dark-theme friendly */}
        <ProfileHeader userInfo={userInfo} onEditClick={() => setIsEditing(true)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section - Apply the new card styles */}
            <Card className={`shadow-lg ${cardStyles}`}>
              <CardHeader>
                {/* Adjust title text color for dark background */}
                <CardTitle className="text-xl font-semibold text-white">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Adjust body text color for dark background */}
                <p className="text-gray-300 leading-relaxed">{userInfo.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Adjust icon and associated text colors for dark background */}
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span>{userInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Briefcase className="w-5 h-5" />
                    <span>{userInfo.occupation}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <CalendarDays className="w-5 h-5" />
                    <span>Joined {userInfo.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <GraduationCap className="w-5 h-5" />
                    <span>Computer Science</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section - Apply the new card styles */}
            <Card className={`shadow-lg ${cardStyles}`}>
              <CardHeader>
                {/* Adjust title text color for dark background */}
                <CardTitle className="text-xl font-semibold text-white">Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}/
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Note: ProfileStats component may also need internal styling adjustments
                to match the new dark theme colors. */}
            <ProfileStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;