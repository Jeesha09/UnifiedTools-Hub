# To run this code you need to install the following dependency:
# pip install google-genai

import os
import json
from google import genai
from google.genai import types

def generate_response(userinput):
    client = genai.Client(
        api_key="AIzaSyDh-pmbbaHl8NzKquqA_uIhwHR2qisGraI",
    )
    
    model = "gemini-2.5-flash-preview-05-20"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""You're building a chatbot for a website named Innovatrix – all tools in one place. The chatbot should help users by suggesting which tool to use based on what the user wants to do. It should also provide a clickable link as provided in the json below to the corresponding tool already available on the website.

The chatbot should work like this:

Understand natural language input like:
"I want to remove the background of my image"
"Need help writing Markdown"
"Validate this JSON file"
"Generate a QR code for a URL"

Based on the intent, recommend the most appropriate tool along with its description and a direct link using the provided tool paths.

The structure of tools is provided in the following JSON format, grouped by five suites: Developer Suite, Student Suite, Office Suite, Designer Suite, and Network Suite.

The tool object contains:

"name" - name of the tool
"path" - relative path of the tool for redirection
"description" - what the tool does

You should:

Use intent recognition to map the user query to the most suitable tool.
Respond in this format:

Based on your query, I recommend using the [Tool Name].

📄 Description: [Tool Description]  
🔗 Open here: [Link - insert base domain + path]

If multiple tools are relevant, list the best 1-2 options.

Base domain of the site: http://localhost:3000/dashboard

Here is the full list of tools:

{{
  "Developer Suite": [
    {{
      "name": "Code Formatter",
      "path": "python/codeFormatter.py",
      "description": "Formats code in various languages to improve readability and maintain coding standards."
    }},
    {{
      "name": "JSON Validator",
      "path": "python/textValidators/json_validator.py",
      "description": "Validates JSON strings to ensure proper syntax and assists in debugging malformed JSON."
    }},
    {{
      "name": "YAML Validator",
      "path": "python/textValidators/yaml_validator.py",
      "description": "Checks YAML documents for syntax errors and proper structure, making it easier to work with configuration files."
    }},
    {{
      "name": "XML Validator",
      "path": "python/textValidators/xml_validator.py",
      "description": "Validates and formats XML documents, ensuring they are well-formed and can be correctly parsed."
    }},
    {{
      "name": "REST API Client",
      "path": "python/restApiClient.py",
      "description": "Allows developers to test and debug RESTful APIs, with options to customize headers, parameters, and authentication."
    }},
    {{
      "name": "LLM Service",
      "path": "python/llm.py",
      "description": "Provides access to language model capabilities for text generation, summarization, and more."
    }},
    {{
      "name": "Markdown Editor",
      "path": "components/markdown-editor-tool.tsx",
      "description": "Offers a rich text editor for Markdown with live preview, helping users create formatted content easily."
    }}
  ],
  "Student Suite": [
    {{
      "name": "Random Generator",
      "path": "python/randomGenerator.py",
      "description": "Generates random numbers, words, sentences, or emojis to encourage creativity and support testing scenarios."
    }},
    {{
      "name": "Random UUID Generator",
      "path": "components/random-uuid-generator-tool.tsx",
      "description": "Generates universally unique identifiers (UUIDs) for use in applications requiring unique keys or IDs."
    }},
    {{
      "name": "Productivity Tools",
      "path": "components/ProductivityTools.tsx",
      "description": "A collection of tools aimed at enhancing academic and personal productivity, including scheduling and note-taking features."
    }},
    {{
      "name": "CSV/Excel/SQL Tool",
      "path": "python/csv_excel_sql.py",
      "description": "Helps students convert, manage, and analyze data across CSV, Excel, and SQL formats."
    }},
    {{
      "name": "PDF Merge",
      "path": "python/pdfs/pdfMerge.py",
      "description": "Merges multiple PDF files into one document, useful for compiling research reports and assignments."
    }}
  ],
  "Office Suite": [
    {{
      "name": "Password Generator",
      "path": "components/password-generator-tool.tsx",
      "description": "Generates strong, random passwords to help ensure secure access to systems and accounts."
    }},
    {{
      "name": "AES Encryption Tool",
      "path": "components/aes-encryption-tool.tsx",
      "description": "Encrypts and decrypts data using AES standards, ensuring confidential information remains secure."
    }},
    {{
      "name": "User Feedback",
      "path": "python/UserFeedback.py",
      "description": "Collects and manages user feedback to improve products and services through targeted responses."
    }},
    {{
      "name": "Cloud Storage",
      "path": "python/cloud_storage.py",
      "description": "Integrates cloud storage functionality including file uploads and temporary link creation for file sharing and backups."
    }}
  ],
  "Designer Suite": [
    {{
      "name": "Background Remover",
      "path": "python/imageGraphics/bgRemover.py",
      "description": "Removes backgrounds from images to create clean visuals, ideal for design projects and professional presentations."
    }},
    {{
      "name": "Barcode Generator",
      "path": "components/barcode-generator-tool.tsx",
      "description": "Creates barcode images from user input, useful for inventory management and product labeling."
    }},
    {{
      "name": "QR Code Generator",
      "path": "components/qr-generator-tool.tsx",
      "description": "Generates QR codes from text or URLs to facilitate quick access and digital linking."
    }},
    {{
      "name": "Image Converter",
      "path": "components/image-converter-tool.tsx",
      "description": "Converts images between different formats and applies compression, assisting designers in optimizing assets."
    }},
    {{
      "name": "AI Image Generator",
      "path": "components/image-generator-tool.tsx",
      "description": "Uses AI algorithms to generate images based on text prompts, helping designers quickly prototype visual ideas."
    }},
    {{
      "name": "Color Picker",
      "path": "components/color-picker-tool.tsx",
      "description": "Allows designers to select and convert colors interactively, ensuring consistency in brand and design projects."
    }},
    {{
      "name": "Color Palette Generator",
      "path": "components/palette-generator-tool.tsx",
      "description": "Generates harmonious color palettes based on design principles, aiding designers in creating visually appealing compositions."
    }},
    {{
      "name": "JPG Compress",
      "path": "python/jpg_compress.py",
      "description": "Compresses JPG images to reduce file size while preserving quality, which is crucial for web and print designs."
    }}
  ],
  "Network Suite": [
    {{
      "name": "Network Tool",
      "path": "components/network-tool.tsx",
      "description": "Performs network operations such as ping, IP lookup, and traceroute to help diagnose connectivity issues."
    }},
    {{
      "name": "SEO Tools",
      "path": "components/SEOTools.tsx",
      "description": "Analyzes web page SEO metrics, including keyword density and meta tag generation, to help optimize online content."
    }},
    {{
      "name": "Web Scraper",
      "path": "components/web-scraper-tool.tsx",
      "description": "Fetches and extracts content from web pages using URL and CSS selectors, enabling data collection for analysis."
    }}
  ]
}}
user input -
{userinput}""")
            ]
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""**Locating a Formatting Tool**

I've homed in on the "Code Formatter" tool within the Developer Suite. Its description directly aligns with the user's need to format Python code for better readability and adherence to standards. I'll need to explore its implementation, specifically the `python/codeFormatter.py` path, to understand how it functions.

**Examining Tool Implementation**

I've begun to dissect the `python/codeFormatter.py` file, aiming to understand its core logic. My focus is on how it applies formatting standards.
"""),
                types.Part.from_text(text="""{
  "description": "Formats code in various languages to improve readability and maintain coding standards.",
  "name": "Code Formatter",
  "path": "python/codeFormatter.py"
}""")
            ]
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="INSERT_INPUT_HERE")
            ]
        ),
    ]
    
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["name", "path", "description"],
            properties={
                "name": genai.types.Schema(type=genai.types.Type.STRING),
                "path": genai.types.Schema(type=genai.types.Type.STRING),
                "description": genai.types.Schema(type=genai.types.Type.STRING),
            },
        ),
    )

    output = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        output += chunk.text  
    return output

if __name__ == "__main__":
    userinput = input("Enter your query: ")
    generate_response(userinput)