import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Image, FileText, Code, Download } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      action: "Removed background from",
      target: "profile-photo.jpg",
      time: "2 hours ago",
      icon: Image,
      type: "image"
    },
    {
      action: "Created markdown document",
      target: "project-notes.md",
      time: "5 hours ago",
      icon: FileText,
      type: "document"
    },
    {
      action: "Formatted JavaScript code",
      target: "main.js",
      time: "1 day ago",
      icon: Code,
      type: "code"
    },
    {
      action: "Downloaded converted file",
      target: "presentation.pdf",
      time: "2 days ago",
      icon: Download,
      type: "download"
    },
    {
      action: "Removed background from",
      target: "product-image.png",
      time: "3 days ago",
      icon: Image,
      type: "image"
    }
  ];

  const getTypeColor = (type: string) => {
    const colorMap = {
      image: "bg-blue-100 text-blue-800",
      document: "bg-green-100 text-green-800",
      code: "bg-purple-100 text-purple-800",
      download: "bg-orange-100 text-orange-800"
    };
    return colorMap[type as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const getIconColor = (type: string) => {
    const colorMap = {
      image: "text-blue-500",
      document: "text-green-500",
      code: "text-purple-500",
      download: "text-orange-500"
    };
    return colorMap[type as keyof typeof colorMap] || "text-gray-500";
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100`}>
                  <Icon className={`w-4 h-4 ${getIconColor(activity.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-600 mx-1">·</span>
                    <span className="font-mono text-gray-700">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
