import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, FileText, Code, Scissors, Calculator, Palette, Star } from 'lucide-react';

export const FavoriteTools: React.FC = () => {
  const favoriteTools = [
    {
      name: "Background Remover",
      description: "AI-powered background removal for images",
      icon: Image,
      category: "Image",
      usageCount: 45,
      color: "blue"
    },
    {
      name: "Markdown Editor",
      description: "Rich text editor with live preview",
      icon: FileText,
      category: "Writing",
      usageCount: 32,
      color: "green"
    },
    {
      name: "Code Formatter",
      description: "Format and beautify your code",
      icon: Code,
      category: "Development",
      usageCount: 28,
      color: "purple"
    },
    {
      name: "Text Splitter",
      description: "Split large texts into smaller chunks",
      icon: Scissors,
      category: "Text",
      usageCount: 19,
      color: "orange"
    },
    {
      name: "Unit Converter",
      description: "Convert between different units",
      icon: Calculator,
      category: "Utility",
      usageCount: 15,
      color: "cyan"
    },
    {
      name: "Color Palette",
      description: "Generate beautiful color schemes",
      icon: Palette,
      category: "Design",
      usageCount: 12,
      color: "pink"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      cyan: "from-cyan-500 to-cyan-600",
      pink: "from-pink-500 to-pink-600"
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Favorite Tools
        </CardTitle>
        <Button variant="outline" size="sm" className="hover:bg-yellow-50 transition-colors duration-200">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteTools.map((tool, index) => {
            const Icon = tool.icon;
            const colorClasses = getColorClasses(tool.color);
            
            return (
              <div key={index} className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{tool.name}</h3>
                      <Badge variant="outline" className="text-xs">{tool.usageCount}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
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