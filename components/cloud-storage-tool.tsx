"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Upload,
    Download,
    Loader2,
    File,
    Trash2,
    Copy,
    Link,
    Clock,
    CloudUpload,
    FolderOpen,
    RefreshCw
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types
interface FileUploadResponse {
    success: boolean
    filename: string
    size: number
    provider: string
    url?: string
    expiration?: number
    file_id?: string
    error?: string
}

interface TempFile {
    id: string
    original_name: string
    created: number
    expires: number
    expires_in_minutes: number
    access_limit: number
    access_count: number
}

interface CloudFile {
    name: string
    size: number
    last_modified: string
    url?: string
}

export default function CloudStorageTool() {
    // Upload state
    const [file, setFile] = useState<File | null>(null)
    const [provider, setProvider] = useState("local")
    const [folder, setFolder] = useState("")
    const [expiration, setExpiration] = useState(60)
    const [accessLimit, setAccessLimit] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Temp files state
    const [tempFiles, setTempFiles] = useState<TempFile[]>([])
    const [loadingTempFiles, setLoadingTempFiles] = useState(false)

    // Cloud files state
    const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([])
    const [cloudPrefix, setCloudPrefix] = useState("")
    const [loadingCloudFiles, setLoadingCloudFiles] = useState(false)
    const [selectedCloudProvider, setSelectedCloudProvider] = useState("aws_s3")

    // Uploaded files
    const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description: "Please select a file to upload",
                variant: "destructive"
            })
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("provider", provider)
            formData.append("folder", folder)
            formData.append("expiration_minutes", expiration.toString())
            formData.append("access_limit", accessLimit.toString())

            const response = await fetch(`${API_BASE_URL}/upload-file`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Failed to upload file")
            }

            const result: FileUploadResponse = await response.json()

            if (result.success) {
                setUploadedFiles(prev => [result, ...prev])
                toast({
                    title: "File uploaded successfully",
                    description: `${result.filename} has been uploaded to ${result.provider}`
                })
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            } else {
                throw new Error(result.error || "Upload failed")
            }
        } catch (err) {
            toast({
                title: "Upload failed",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        } finally {
            setUploading(false)
        }
    }

    const fetchTempFiles = async () => {
        setLoadingTempFiles(true)

        try {
            const response = await fetch(`${API_BASE_URL}/list-temp-files`)

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()
            setTempFiles(data.files || [])
        } catch (err) {
            toast({
                title: "Failed to load temporary files",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        } finally {
            setLoadingTempFiles(false)
        }
    }

    const deleteTempFile = async (fileId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/file/${fileId}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            setTempFiles(currentFiles => currentFiles.filter(file => file.id !== fileId))

            // Also remove from uploaded files list if present
            setUploadedFiles(currentFiles => currentFiles.filter(file => file.file_id !== fileId))

            toast({
                title: "File deleted successfully"
            })
        } catch (err) {
            toast({
                title: "Failed to delete file",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        }
    }

    const fetchCloudFiles = async () => {
        if (selectedCloudProvider === "local") {
            toast({
                title: "Local storage selected",
                description: "Cloud file listing is only available for cloud providers"
            })
            return
        }

        setLoadingCloudFiles(true)

        try {
            const response = await fetch(`${API_BASE_URL}/cloud-files?provider=${selectedCloudProvider}&prefix=${encodeURIComponent(cloudPrefix)}`)

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()
            setCloudFiles(data.files || [])
        } catch (err) {
            toast({
                title: "Failed to load cloud files",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        } finally {
            setLoadingCloudFiles(false)
        }
    }

    const deleteCloudFile = async (filePath: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cloud-file?provider=${selectedCloudProvider}&file_path=${encodeURIComponent(filePath)}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            setCloudFiles(currentFiles => currentFiles.filter(file => file.name !== filePath))

            toast({
                title: "Cloud file deleted successfully"
            })
        } catch (err) {
            toast({
                title: "Failed to delete cloud file",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        }
    }

    const getShareableLink = async (filePath: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cloud-link?provider=${selectedCloudProvider}&file_path=${encodeURIComponent(filePath)}&expiration_minutes=${expiration}`)

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success && data.url) {
                // Copy to clipboard
                navigator.clipboard.writeText(data.url)

                toast({
                    title: "Link copied to clipboard",
                    description: `Link expires in ${data.expires_in_minutes} minutes`
                })
            }
        } catch (err) {
            toast({
                title: "Failed to generate link",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        }
    }

    const createTempLink = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description: "Please select a file to create a temporary link"
            })
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("expiration_minutes", expiration.toString())
            formData.append("access_limit", accessLimit.toString())

            const response = await fetch(`${API_BASE_URL}/create-temp-link`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Failed to create temporary link")
            }

            const result = await response.json()

            if (result.success) {
                const fileLink = `${window.location.origin}/api/file/${result.file_id}`

                // Copy link to clipboard
                navigator.clipboard.writeText(fileLink)

                toast({
                    title: "Temporary link created",
                    description: "Link has been copied to clipboard"
                })

                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }

                // Refresh temp files list
                fetchTempFiles()
            } else {
                throw new Error(result.error || "Failed to create link")
            }
        } catch (err) {
            toast({
                title: "Failed to create link",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const copyFileLink = (fileId: string) => {
        const fileLink = `${window.location.origin}/api/file/${fileId}`
        navigator.clipboard.writeText(fileLink)

        toast({
            title: "Link copied to clipboard"
        })
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString()
    }

    return (
        <div className="tool-ui">
            <div className="tool-ui-header">
                <div className="tool-ui-icon">☁️</div>
                <h1 className="text-2xl font-bold">Cloud Storage & File Sharing</h1>
            </div>
            <div className="tool-ui-description">
                Upload, store, and share files with configurable expiration times and access controls.
            </div>

            <Card className="p-6">
                <Tabs defaultValue="temp-link">
                    <TabsList className="mb-4">
                        {/* <TabsTrigger value="upload">Upload</TabsTrigger> */}
                        <TabsTrigger value="temp-link">Quick Share</TabsTrigger>
                        <TabsTrigger value="my-files" onClick={fetchTempFiles}>My Files</TabsTrigger>
                        {/* <TabsTrigger value="cloud" onClick={fetchCloudFiles}>Cloud Storage</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="upload">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Select File</Label>
                                <Input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                {file && (
                                    <div className="text-sm">
                                        Selected: <span className="font-medium">{file.name}</span> ({formatBytes(file.size)})
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storage-provider">Storage Provider</Label>
                                    <Select value={provider} onValueChange={setProvider}>
                                        <SelectTrigger id="storage-provider">
                                            <SelectValue placeholder="Select storage provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="local">Local Storage</SelectItem>
                                            <SelectItem value="aws_s3">Amazon S3</SelectItem>
                                            <SelectItem value="google_cloud_storage">Google Cloud Storage</SelectItem>
                                            <SelectItem value="azure_blob">Azure Blob Storage</SelectItem>
                                            <SelectItem value="google_drive">Google Drive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="folder-path">Folder Path (Optional)</Label>
                                    <Input
                                        id="folder-path"
                                        placeholder="e.g. documents/2024/"
                                        value={folder}
                                        onChange={(e) => setFolder(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiration">Link Expiration (minutes)</Label>
                                    <Input
                                        id="expiration"
                                        type="number"
                                        min={5}
                                        value={expiration}
                                        onChange={(e) => setExpiration(parseInt(e.target.value) || 60)}
                                    />
                                    <div className="text-xs text-muted-foreground">
                                        How long the file will be accessible (minimum 5 minutes)
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="access-limit">Access Limit</Label>
                                    <Input
                                        id="access-limit"
                                        type="number"
                                        min={-1}
                                        value={accessLimit}
                                        onChange={(e) => setAccessLimit(parseInt(e.target.value) || -1)}
                                    />
                                    <div className="text-xs text-muted-foreground">
                                        Maximum number of downloads (-1 for unlimited)
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="w-full"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CloudUpload className="mr-2 h-4 w-4" />
                                        Upload File
                                    </>
                                )}
                            </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="mt-8">
                                <h3 className="font-medium text-lg mb-2">Recently Uploaded</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>File</TableHead>
                                                <TableHead>Provider</TableHead>
                                                <TableHead>Size</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {uploadedFiles.map((file, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{file.filename}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{file.provider}</Badge>
                                                    </TableCell>
                                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {file.file_id && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => copyFileLink(file.file_id as string)}
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {file.url && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        window.open(file.url, '_blank')
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my-files">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Temporary Files</h3>
                                <Button
                                    variant="outline"
                                    onClick={fetchTempFiles}
                                    disabled={loadingTempFiles}
                                    size="sm"
                                >
                                    {loadingTempFiles ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            {loadingTempFiles ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : tempFiles.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No temporary files found
                                </div>
                            ) : (
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Expires</TableHead>
                                                <TableHead>Access</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tempFiles.map((file) => (
                                                <TableRow key={file.id}>
                                                    <TableCell className="font-medium">{file.original_name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                                            <span>{file.expires_in_minutes} minutes</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {file.access_limit === -1 ? (
                                                            <Badge variant="outline">Unlimited</Badge>
                                                        ) : (
                                                            <Badge variant="outline">{file.access_count} / {file.access_limit}</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyFileLink(file.id)}
                                                            >
                                                                <Link className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => deleteTempFile(file.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="cloud">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cloud-provider">Cloud Provider</Label>
                                    <Select value={selectedCloudProvider} onValueChange={setSelectedCloudProvider}>
                                        <SelectTrigger id="cloud-provider">
                                            <SelectValue placeholder="Select cloud provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aws_s3">Amazon S3</SelectItem>
                                            <SelectItem value="google_cloud_storage">Google Cloud Storage</SelectItem>
                                            <SelectItem value="azure_blob">Azure Blob Storage</SelectItem>
                                            <SelectItem value="google_drive">Google Drive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="folder-prefix">Folder Prefix (Optional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="folder-prefix"
                                            placeholder="e.g. documents/"
                                            value={cloudPrefix}
                                            onChange={(e) => setCloudPrefix(e.target.value)}
                                        />
                                        <Button variant="outline" onClick={fetchCloudFiles} disabled={loadingCloudFiles}>
                                            {loadingCloudFiles ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <FolderOpen className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {loadingCloudFiles ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : cloudFiles.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No files found in this location
                                </div>
                            ) : (
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Size</TableHead>
                                                <TableHead>Modified</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cloudFiles.map((file, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{file.name}</TableCell>
                                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                                    <TableCell>{new Date(file.last_modified).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => getShareableLink(file.name)}
                                                            >
                                                                <Link className="h-4 w-4" />
                                                            </Button>
                                                            {file.url && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        window.open(file.url, '_blank')
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => deleteCloudFile(file.name)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="temp-link">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quick-file-upload">Select File</Label>
                                <Input
                                    id="quick-file-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                {file && (
                                    <div className="text-sm">
                                        Selected: <span className="font-medium">{file.name}</span> ({formatBytes(file.size)})
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="temp-expiration">Link Expiration (minutes)</Label>
                                    <Input
                                        id="temp-expiration"
                                        type="number"
                                        min={5}
                                        value={expiration}
                                        onChange={(e) => setExpiration(parseInt(e.target.value) || 60)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="temp-access-limit">Access Limit</Label>
                                    <Input
                                        id="temp-access-limit"
                                        type="number"
                                        min={-1}
                                        value={accessLimit}
                                        onChange={(e) => setAccessLimit(parseInt(e.target.value) || -1)}
                                    />
                                    <div className="text-xs text-muted-foreground">
                                        Maximum number of downloads (-1 for unlimited)
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={createTempLink}
                                disabled={!file || loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Link...
                                    </>
                                ) : (
                                    <>
                                        <Link className="mr-2 h-4 w-4" />
                                        Create Shareable Link
                                    </>
                                )}
                            </Button>

                            <div className="bg-muted/50 p-4 rounded-md">
                                <h4 className="font-medium mb-2">How it works</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Files are temporarily stored on the server</li>
                                    <li>Links expire after the specified time</li>
                                    <li>Access limits can be set to control downloads</li>
                                    <li>No registration required for recipients</li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}