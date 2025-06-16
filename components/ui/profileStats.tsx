import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

export const ProfileStats: React.FC = () => {
  const stats = [
    {
      title: "Tools Used",
      value: "23",
      change: "+5 this month",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Projects",
      value: "47",
      change: "+12 completed",
      icon: Award,
      color: "green"
    },
    {
      title: "Time Saved",
      value: "156h",
      change: "This quarter",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Streak",
      value: "15",
      change: "Days active",
      icon: Users,
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600 bg-blue-50",
      green: "from-green-500 to-green-600 bg-green-50",
      purple: "from-purple-500 to-purple-600 bg-purple-50",
      orange: "from-orange-500 to-orange-600 bg-orange-50"
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color);
          
          return (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses} flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
