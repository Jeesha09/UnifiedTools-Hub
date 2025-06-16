import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Layers, 
  BookOpen, 
  MessageCircle, 
  CreditCard, 
  ChevronDown,
  BarChart3,
  Clock,
  Palette,
  Key,
  FileJson,
  QrCode
} from 'lucide-react';

const Index = () => {
  const sidebarItems = [
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Suites', icon: Layers, hasDropdown: true },
    { name: 'Study', icon: BookOpen, hasDropdown: true },
    { name: 'Chatbot', icon: MessageCircle },
    { name: 'Payment', icon: CreditCard },
  ];

  const mostUsedTools = [
    { name: 'JSON Formatter', uses: 32, color: 'text-blue-400' },
    { name: 'Password Generator', uses: 18, color: 'text-purple-400' },
    { name: 'Color Palette', uses: 15, color: 'text-green-400' },
  ];

  const recentActivities = [
    { time: '2 hours ago', action: 'Used JSON Formatter' },
    { time: 'Yesterday', action: 'Generated QR Code' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            <h1 className="text-xl font-bold">Innovatrix</h1>
            <button className="ml-auto text-gray-400 hover:text-white">×</button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  {item.href ? (
                    <Link 
                      to={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-auto" />}
                    </Link>
                  ) : (
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-auto" />}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, User!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Plan */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Free Tier</h3>
                <p className="text-gray-400">Access to essential tools</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Usage Overview</CardTitle>
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {[60, 80, 45, 90, 70].map((height, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-purple-500 to-blue-400 rounded-t flex-1"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Used Tools */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Most Used Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mostUsedTools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {index === 0 && <FileJson className="w-5 h-5 text-blue-400" />}
                    {index === 1 && <Key className="w-5 h-5 text-purple-400" />}
                    {index === 2 && <Palette className="w-5 h-5 text-green-400" />}
                    <span className="text-gray-300">{tool.name}</span>
                  </div>
                  <Badge variant="secondary" className={`${tool.color} bg-transparent`}>
                    {tool.uses} uses
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time}</span>
                  </div>
                  <p className="text-gray-300 pl-6">{activity.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;