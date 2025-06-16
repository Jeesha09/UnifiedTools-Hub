import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, Phone, Globe } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  bio: string;
  location: string;
  occupation: string;
  joinDate: string;
  profileImage: string;
}

interface ProfileHeaderProps {
  userInfo: UserInfo;
  onEditClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, onEditClick }) => {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <img 
                src={userInfo.profileImage} 
                alt={userInfo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Button 
              size="sm" 
              className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{userInfo.name}</h1>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                  Premium Member
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button variant="outline" size="sm" className="hover:bg-blue-50 transition-colors duration-200">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors duration-200">
                <Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-purple-50 transition-colors duration-200">
                <Globe className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
              onClick={onEditClick}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
