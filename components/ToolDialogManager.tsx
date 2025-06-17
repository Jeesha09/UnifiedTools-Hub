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

// Import Python tool components
import CodeFormatterTool from '@/components/code-formatter-tool';
import JsonValidatorTool from '@/components/json-validator-tool';
import YamlValidatorTool from '@/components/yaml-validator-tool';
import XmlValidatorTool from '@/components/xml-validator-tool';
import RestApiClientTool from '@/components/rest-api-client-tool';
import RandomGeneratorTool from '@/components/random-generator-tool';
import CsvExcelSqlTool from '@/components/csv-excel-sql-pg-tool';
import PdfMergeTool from '@/components/pdf-merger-tool';
import UserFeedbackTool from '@/components/user-feedback-tool';
import CloudStorageTool from '@/components/cloud-storage-tool';

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
  'python/imageGraphics/bgRemover.py': BgRemoverTool,
  
  // Network Suite
  'components/network-tool.tsx': NetworkTool,
  'components/SEOTools.tsx': SEOTools,
  'components/web-scraper-tool.tsx': WebScraperTool,
  
  // Student Suite
  'components/random-uuid-generator-tool.tsx': RandomUUIDGeneratorTool,
  'components/ProductivityTools.tsx': ProductivityTools,
  
  // Developer Suite
  'components/markdown-editor-tool.tsx': MarkdownEditorTool,
  'python/codeFormatter.py': CodeFormatterTool,
  'python/textValidators/json_validator.py': JsonValidatorTool,
  'python/textValidators/yaml_validator.py': YamlValidatorTool,
  'python/textValidators/xml_validator.py': XmlValidatorTool,
  'python/restApiClient.py': RestApiClientTool,
  'python/randomGenerator.py': RandomGeneratorTool,
  'python/csv_excel_sql.py': CsvExcelSqlTool,
  'python/pdfs/pdfMerge.py': PdfMergeTool,
  'python/UserFeedback.py': UserFeedbackTool,
  'python/cloud_storage.py': CloudStorageTool,
};

const ToolDialogManager: React.FC = () => {
  const { currentTool, currentToolName, isToolOpen, closeTool } = useToolContext();

  if (!isToolOpen || !currentTool) {
    return null;
  }

  // Render the appropriate tool component
  const ToolComponent = toolComponents[currentTool];
  
  if (!ToolComponent) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          onClick={closeTool}
        />
        
        {/* Dialog Content */}
        <div className="relative z-[10000] w-full max-w-4xl max-h-[90vh] mx-4 bg-black border-2 border-purple-500/30 rounded-lg shadow-[0_20px_50px_rgba(139,92,246,0.3)] backdrop-blur-md overflow-hidden">
          <div className="border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Tool Not Found
              </h2>
              <button 
                onClick={closeTool}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={closeTool}
      />
      
      {/* Dialog Content */}
      <div className="relative z-[10000] w-full max-w-6xl max-h-[95vh] mx-4 bg-black border-2 border-purple-500/30 rounded-lg shadow-[0_20px_50px_rgba(139,92,246,0.3)] backdrop-blur-md overflow-hidden">
        <div className="border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {currentToolName || 'Tool'}
            </h2>
            <button 
              onClick={closeTool}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
};

export default ToolDialogManager;