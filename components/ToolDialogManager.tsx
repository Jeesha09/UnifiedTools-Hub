"use client"
import React from 'react';
import { useToolContext } from '@/contexts/ToolContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Import all your tool components
import PasswordGeneratorTool from '@/components/password-tool';
import AESEncryptionTool from '@/components/aes-encryption-tool';
import BarcodeGeneratorTool from '@/components/barcode-generator-tool';
import QRGeneratorTool from '@/components/qr-generator-tool';
import ImageConverterTool from '@/components/image-converter-tool';
import ImageGeneratorTool from '@/components/image-generator-tool';
import ColorPickerTool from '@/components/color-picker-tool';
import PaletteGeneratorTool from '@/components/palette-generator-tool';
import NetworkTool from '@/components/network-tool';
import SEOTools from '@/components/SEOTools';
import WebScraperTool from '@/components/web-scraper-tool';
import RandomUUIDGeneratorTool from '@/components/random-uuid-generator-tool';
import ProductivityTools from '@/components/ProductivityTools';
import MarkdownEditorTool from '@/components/markdown-editor-tool';
import BgRemoverTool from '@/components/bg-remover-tool';
// Tool mapping object
const toolComponents: { [key: string]: React.ComponentType } = {
  // Office Suite
  'components/password-generator-tool.tsx': PasswordGeneratorTool,
  'components/aes-encryption-tool.tsx': AESEncryptionTool,
  
  // Designer Suite
  'components/barcode-generator-tool.tsx': BarcodeGeneratorTool,
  'components/qr-generator-tool.tsx': QRGeneratorTool,
  'components/image-converter-tool.tsx': ImageConverterTool,
  'components/image-generator-tool.tsx': ImageGeneratorTool,
  'components/color-picker-tool.tsx': ColorPickerTool,
  'components/palette-generator-tool.tsx': PaletteGeneratorTool,
  'components/bg-remover-tool.tsx': BgRemoverTool,
  
  // Network Suite
  'components/network-tool.tsx': NetworkTool,
  'components/SEOTools.tsx': SEOTools,
  'components/web-scraper-tool.tsx': WebScraperTool,
  
  // Student Suite
  'components/random-uuid-generator-tool.tsx': RandomUUIDGeneratorTool,
  'components/ProductivityTools.tsx': ProductivityTools,
  
  // Developer Suite
  'components/markdown-editor-tool.tsx': MarkdownEditorTool,
};

// Python tools that need special handling
const pythonTools = [
  'python/codeFormatter.py',
  'python/textValidators/json_validator.py',
  'python/textValidators/yaml_validator.py',
  'python/textValidators/xml_validator.py',
  'python/restApiClient.py',
  'python/llm.py',
  'python/randomGenerator.py',
  'python/csv_excel_sql.py',
  'python/pdfs/pdfMerge.py',
  'python/UserFeedback.py',
  'python/cloud_storage.py',
//   'python/imageGraphics/bgRemover.py',
  'python/jpg_compress.py',
];

const ToolDialogManager: React.FC = () => {
  const { currentTool, currentToolName, isToolOpen, closeTool } = useToolContext();

  if (!isToolOpen || !currentTool) {
    return null;
  }

  // Check if it's a Python tool
  if (pythonTools.includes(currentTool)) {
    return (
      <Dialog open={isToolOpen} onOpenChange={closeTool}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-2 border-purple-500/30 shadow-[0_20px_50px_rgba(139,92,246,0.3)] backdrop-blur-md">
          <DialogHeader className="border-b border-slate-700/50 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {currentToolName || 'Python Tool'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center text-gray-300">
              <p className="mb-4">This Python tool is not yet integrated into the web interface.</p>
              <p className="text-sm text-gray-400">Tool path: {currentTool}</p>
              <button 
                onClick={closeTool}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render the appropriate tool component
  const ToolComponent = toolComponents[currentTool];
  
  if (!ToolComponent) {
    return (
      <Dialog open={isToolOpen} onOpenChange={closeTool}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-2 border-purple-500/30 shadow-[0_20px_50px_rgba(139,92,246,0.3)] backdrop-blur-md">
          <DialogHeader className="border-b border-slate-700/50 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tool Not Found
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center text-gray-300">
              <p className="mb-4">The requested tool could not be found.</p>
              <p className="text-sm text-gray-400">Tool path: {currentTool}</p>
              <button 
                onClick={closeTool}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isToolOpen} onOpenChange={closeTool}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-black border-2 border-purple-500/30 shadow-[0_20px_50px_rgba(139,92,246,0.3)] backdrop-blur-md">
        <DialogHeader className="border-b border-slate-700/50 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {currentToolName || 'Tool'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <ToolComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDialogManager;