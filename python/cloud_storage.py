import os
import boto3
from google.cloud import storage
from azure.storage.blob import BlobServiceClient
from typing import Optional, Dict, Any, List
import time
import json
import uuid
import io
from dotenv import load_dotenv
# Add imports for Google Drive
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
from google.oauth2 import service_account

load_dotenv()  # Load environment variables from .env file

class CloudStorageProvider:
    """Base class for cloud storage providers"""
    
    def __init__(self):
        self.provider_name = "base"
    
    def upload_file(self, file_path: str, destination_path: str) -> Dict[str, Any]:
        """Upload a file to cloud storage"""
        raise NotImplementedError("This method should be implemented by subclasses")
    
    def get_shareable_link(self, file_path: str, expiration_minutes: int = 60) -> str:
        """Generate a shareable link for the file"""
        raise NotImplementedError("This method should be implemented by subclasses")
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from cloud storage"""
        raise NotImplementedError("This method should be implemented by subclasses")
    
    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """List files in a directory/prefix"""
        raise NotImplementedError("This method should be implemented by subclasses")

class S3Provider(CloudStorageProvider):
    """AWS S3 cloud storage provider"""
    
    def __init__(self):
        super().__init__()
        self.provider_name = "aws_s3"
        self.aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        self.aws_secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        self.bucket_name = os.environ.get('AWS_S3_BUCKET_NAME')
        
        if not all([self.aws_access_key, self.aws_secret_key, self.bucket_name]):
            raise ValueError("AWS credentials or bucket name not found in environment variables")
        
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.aws_access_key,
            aws_secret_access_key=self.aws_secret_key
        )
    
    def upload_file(self, file_path: str, destination_path: str) -> Dict[str, Any]:
        """Upload a file to S3 bucket"""
        try:
            self.s3_client.upload_file(
                file_path, 
                self.bucket_name, 
                destination_path
            )
            
            return {
                "provider": self.provider_name,
                "success": True,
                "path": destination_path,
                "bucket": self.bucket_name
            }
        except Exception as e:
            return {
                "provider": self.provider_name,
                "success": False,
                "error": str(e)
            }
    
    def get_shareable_link(self, file_path: str, expiration_minutes: int = 60) -> str:
        """Generate a pre-signed URL for temporary access"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_path},
                ExpiresIn=expiration_minutes * 60
            )
            return url
        except Exception as e:
            raise Exception(f"Failed to generate link: {str(e)}")
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from S3 bucket"""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except Exception:
            return False
    
    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """List files in S3 bucket with prefix"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            files = []
            if 'Contents' in response:
                for item in response['Contents']:
                    files.append({
                        "name": item['Key'],
                        "size": item['Size'],
                        "last_modified": item['LastModified'].isoformat(),
                        "path": item['Key']
                    })
            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

class GCSProvider(CloudStorageProvider):
    """Google Cloud Storage provider"""
    
    def __init__(self):
        super().__init__()
        self.provider_name = "google_cloud_storage"
        self.bucket_name = os.environ.get('GCS_BUCKET_NAME')
        self.credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        
        if not self.bucket_name:
            raise ValueError("GCS bucket name not found in environment variables")
        
        # Initialize client
        self.client = storage.Client()
        self.bucket = self.client.bucket(self.bucket_name)
    
    def upload_file(self, file_path: str, destination_path: str) -> Dict[str, Any]:
        """Upload a file to GCS bucket"""
        try:
            blob = self.bucket.blob(destination_path)
            blob.upload_from_filename(file_path)
            
            return {
                "provider": self.provider_name,
                "success": True,
                "path": destination_path,
                "bucket": self.bucket_name
            }
        except Exception as e:
            return {
                "provider": self.provider_name,
                "success": False,
                "error": str(e)
            }
    
    def get_shareable_link(self, file_path: str, expiration_minutes: int = 60) -> str:
        """Generate a signed URL for temporary access"""
        try:
            blob = self.bucket.blob(file_path)
            url = blob.generate_signed_url(
                version="v4",
                expiration=time.time() + expiration_minutes * 60,
                method="GET"
            )
            return url
        except Exception as e:
            raise Exception(f"Failed to generate link: {str(e)}")
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from GCS bucket"""
        try:
            blob = self.bucket.blob(file_path)
            blob.delete()
            return True
        except Exception:
            return False
    
    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """List files in GCS bucket with prefix"""
        try:
            blobs = self.client.list_blobs(self.bucket_name, prefix=prefix)
            
            files = []
            for blob in blobs:
                files.append({
                    "name": blob.name,
                    "size": blob.size,
                    "last_modified": blob.updated.isoformat() if blob.updated else None,
                    "path": blob.name
                })
            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

class AzureProvider(CloudStorageProvider):
    """Azure Blob Storage provider"""
    
    def __init__(self):
        super().__init__()
        self.provider_name = "azure_blob"
        self.connection_string = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
        self.container_name = os.environ.get('AZURE_STORAGE_CONTAINER_NAME')
        
        if not all([self.connection_string, self.container_name]):
            raise ValueError("Azure connection string or container name not found in environment variables")
        
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_client = self.blob_service_client.get_container_client(self.container_name)
    
    def upload_file(self, file_path: str, destination_path: str) -> Dict[str, Any]:
        """Upload a file to Azure Blob Storage"""
        try:
            blob_client = self.container_client.get_blob_client(destination_path)
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data)
            
            return {
                "provider": self.provider_name,
                "success": True,
                "path": destination_path,
                "container": self.container_name
            }
        except Exception as e:
            return {
                "provider": self.provider_name,
                "success": False,
                "error": str(e)
            }
    
    def get_shareable_link(self, file_path: str, expiration_minutes: int = 60) -> str:
        """Generate a SAS token for temporary access"""
        try:
            blob_client = self.container_client.get_blob_client(file_path)
            sas_token = blob_client.generate_sas(
                permission="r",
                expiry=time.time() + expiration_minutes * 60,
                content_type="application/octet-stream"
            )
            return f"{blob_client.url}?{sas_token}"
        except Exception as e:
            raise Exception(f"Failed to generate link: {str(e)}")
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from Azure Blob Storage"""
        try:
            blob_client = self.container_client.get_blob_client(file_path)
            blob_client.delete_blob()
            return True
        except Exception:
            return False
    
    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """List files in Azure container with prefix"""
        try:
            blobs = self.container_client.list_blobs(name_starts_with=prefix)
            
            files = []
            for blob in blobs:
                files.append({
                    "name": blob.name,
                    "size": blob.size,
                    "last_modified": blob.last_modified.isoformat() if blob.last_modified else None,
                    "path": blob.name
                })
            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

class GoogleDriveProvider(CloudStorageProvider):
    """Google Drive cloud storage provider"""
    
    def __init__(self):
        super().__init__()
        self.provider_name = "google_drive"
        self.credentials_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
        self.credentials_json = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_JSON')
        
        if not (self.credentials_path or self.credentials_json):
            raise ValueError("Google Drive credentials not found in environment variables")
        
        # Initialize client
        self.drive_service = self._get_drive_service()
    
    def _get_drive_service(self):
        """Initialize Google Drive service"""
        try:
            # First try using credentials path
            if self.credentials_path and os.path.exists(self.credentials_path):
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_path,
                    scopes=['https://www.googleapis.com/auth/drive.file']
                )
            # If no path or path doesn't exist, try credentials JSON
            elif self.credentials_json:
                import json
                creds_info = json.loads(self.credentials_json)
                credentials = service_account.Credentials.from_service_account_info(
                    creds_info,
                    scopes=['https://www.googleapis.com/auth/drive.file']
                )
            else:
                raise ValueError("No valid Google Drive credentials found")
                
            return build('drive', 'v3', credentials=credentials)
        except Exception as e:
            raise ValueError(f"Failed to initialize Google Drive service: {str(e)}")
    
    def upload_file(self, file_path: str, destination_path: str) -> Dict[str, Any]:
        """Upload a file to Google Drive
        
        Note: destination_path is used as the folder path in Google Drive
        """
        try:
            # Prepare file metadata
            file_name = os.path.basename(file_path)
            folder_path = os.path.dirname(destination_path) if destination_path else None
            
            file_metadata = {
                'name': file_name,
            }
            
            # If folder path is specified, try to find or create the folder structure
            parent_id = None
            if folder_path and folder_path != '/' and folder_path != '.':
                parent_id = self._find_or_create_folder(folder_path)
                if parent_id:
                    file_metadata['parents'] = [parent_id]
            
            # Upload file to Google Drive
            media = MediaFileUpload(file_path, resumable=True)
            drive_file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, webViewLink, webContentLink, name, size'
            ).execute()
            
            # Make the file publicly accessible for download
            self.drive_service.permissions().create(
                fileId=drive_file.get('id'),
                body={'type': 'anyone', 'role': 'reader'},
                fields='id'
            ).execute()
            
            return {
                "provider": self.provider_name,
                "success": True,
                "file_id": drive_file.get('id'),
                "name": drive_file.get('name'),
                "size": int(drive_file.get('size', 0)),
                "web_view_link": drive_file.get('webViewLink'),
                "web_content_link": drive_file.get('webContentLink')
            }
            
        except Exception as e:
            return {
                "provider": self.provider_name,
                "success": False,
                "error": str(e)
            }
    
    def _find_or_create_folder(self, folder_path: str) -> Optional[str]:
        """Find or create folder structure in Google Drive, return folder ID"""
        # Split path into parts and remove empty strings
        path_parts = [part for part in folder_path.replace('\\', '/').split('/') if part]
        
        if not path_parts:
            return None
            
        current_parent_id = None  # 'root' is implied when parent is None
        
        # Process each folder level
        for part in path_parts:
            # Search for the folder at this level
            query = f"name='{part}' and mimeType='application/vnd.google-apps.folder'"
            if current_parent_id:
                query += f" and '{current_parent_id}' in parents"
                
            results = self.drive_service.files().list(
                q=query,
                spaces='drive',
                fields='files(id)'
            ).execute()
            
            # Check if folder exists
            if len(results.get('files', [])) > 0:
                current_parent_id = results.get('files')[0].get('id')
            else:
                # Create folder if it doesn't exist
                folder_metadata = {
                    'name': part,
                    'mimeType': 'application/vnd.google-apps.folder'
                }
                
                if current_parent_id:
                    folder_metadata['parents'] = [current_parent_id]
                    
                folder = self.drive_service.files().create(
                    body=folder_metadata,
                    fields='id'
                ).execute()
                
                current_parent_id = folder.get('id')
                
        return current_parent_id
    
    def get_shareable_link(self, file_path: str, expiration_minutes: int = 60) -> str:
        """
        Get a shareable link for a Google Drive file
        
        Note: For Google Drive, file_path is the file ID
        """
        try:
            # For Google Drive, we don't have true expiring links without additional setup
            # Instead, we get the webContentLink which requires the file to be shared
            file_id = file_path
            
            # Ensure file is publicly accessible
            self.drive_service.permissions().create(
                fileId=file_id,
                body={'type': 'anyone', 'role': 'reader'},
                fields='id'
            ).execute()
            
            # Get the file's metadata including webContentLink
            file_data = self.drive_service.files().get(
                fileId=file_id,
                fields='webContentLink'
            ).execute()
            
            if 'webContentLink' in file_data:
                return file_data['webContentLink']
            else:
                raise Exception("Could not generate shareable link for this file")
                
        except Exception as e:
            raise Exception(f"Failed to generate link: {str(e)}")
    
    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from Google Drive
        
        Note: For Google Drive, file_path is the file ID
        """
        try:
            file_id = file_path
            self.drive_service.files().delete(fileId=file_id).execute()
            return True
        except Exception:
            return False
    
    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """
        List files in Google Drive folder
        
        Note: For Google Drive, prefix is treated as the folder path
        """
        try:
            folder_id = None
            
            # If prefix is provided, treat it as a folder path and find its ID
            if prefix and prefix != '/' and prefix != '.':
                folder_id = self._find_or_create_folder(prefix)
            
            # Build query
            query = "trashed=false"
            if folder_id:
                query += f" and '{folder_id}' in parents"
            
            # List files in the folder
            results = self.drive_service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)'
            ).execute()
            
            files = []
            for item in results.get('files', []):
                # Skip folders
                if item.get('mimeType') == 'application/vnd.google-apps.folder':
                    continue
                    
                files.append({
                    "name": item.get('name', ''),
                    "id": item.get('id'),
                    "size": int(item.get('size', 0)),
                    "last_modified": item.get('modifiedTime'),
                    "url": item.get('webContentLink', ''),
                    "view_url": item.get('webViewLink', '')
                })
                
            return files
            
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

class LocalTempStorage:
    """Local temporary file storage manager"""
    
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        self.temp_files_db_path = os.path.join(base_dir, "temp_files.json")
        self.temp_files = self._load_temp_files()
    
    def _load_temp_files(self) -> Dict[str, Any]:
        """Load temporary files database"""
        if os.path.exists(self.temp_files_db_path):
            try:
                with open(self.temp_files_db_path, 'r') as f:
                    return json.load(f)
            except Exception:
                return {"files": {}}
        else:
            return {"files": {}}
    
    def _save_temp_files(self):
        """Save temporary files database"""
        with open(self.temp_files_db_path, 'w') as f:
            json.dump(self.temp_files, f)
    
    def add_temp_file(self, file_path: str, original_name: str, 
                      expiration_minutes: int = 60, access_limit: int = -1) -> Dict[str, Any]:
        """Add a file to temporary storage with expiration and access limits"""
        file_id = str(uuid.uuid4())
        expiration_time = time.time() + (expiration_minutes * 60)
        
        file_info = {
            "id": file_id,
            "path": file_path,
            "original_name": original_name,
            "created": time.time(),
            "expires": expiration_time,
            "access_limit": access_limit,
            "access_count": 0
        }
        
        self.temp_files["files"][file_id] = file_info
        self._save_temp_files()
        
        return {
            "file_id": file_id,
            "expires_at": expiration_time,
            "access_limit": access_limit
        }
    
    def get_temp_file(self, file_id: str) -> Optional[Dict[str, Any]]:
        """Get temporary file information and increase access count"""
        self._clean_expired_files()
        
        if file_id not in self.temp_files["files"]:
            return None
        
        file_info = self.temp_files["files"][file_id]
        
        # Check expiration
        if time.time() > file_info["expires"]:
            self._remove_temp_file(file_id)
            return None
        
        # Check access limit
        if file_info["access_limit"] > 0 and file_info["access_count"] >= file_info["access_limit"]:
            return None
        
        # Increase access count
        file_info["access_count"] += 1
        self._save_temp_files()
        
        return file_info
    
    def _remove_temp_file(self, file_id: str) -> bool:
        """Remove temp file from database and try to delete file"""
        if file_id not in self.temp_files["files"]:
            return False
            
        file_info = self.temp_files["files"][file_id]
        file_path = file_info["path"]
        
        # Remove from database
        del self.temp_files["files"][file_id]
        self._save_temp_files()
        
        # Try to delete file
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass
            
        return True
    
    def _clean_expired_files(self):
        """Clean expired temporary files"""
        current_time = time.time()
        expired_ids = []
        
        for file_id, file_info in self.temp_files["files"].items():
            if current_time > file_info["expires"]:
                expired_ids.append(file_id)
        
        for file_id in expired_ids:
            self._remove_temp_file(file_id)
    
    def get_all_temp_files(self) -> List[Dict[str, Any]]:
        """Get list of all temporary files"""
        self._clean_expired_files()
        
        files = []
        for file_id, file_info in self.temp_files["files"].items():
            files.append({
                "id": file_id,
                "original_name": file_info["original_name"],
                "created": file_info["created"],
                "expires": file_info["expires"],
                "expires_in_minutes": int((file_info["expires"] - time.time()) / 60),
                "access_limit": file_info["access_limit"],
                "access_count": file_info["access_count"]
            })
        
        return files

def get_cloud_provider(provider_name: str) -> Optional[CloudStorageProvider]:
    """Get a cloud storage provider by name"""
    try:
        if provider_name == "aws_s3":
            return S3Provider()
        elif provider_name == "google_cloud_storage":
            return GCSProvider()
        elif provider_name == "azure_blob":
            return AzureProvider()
        elif provider_name == "google_drive":
            return GoogleDriveProvider()
        else:
            return None
    except ValueError:
        # If environment variables aren't set
        return None

# Initialize local temporary storage
def get_temp_storage(base_dir: str) -> LocalTempStorage:
    """Get a temporary storage manager"""
    return LocalTempStorage(base_dir)