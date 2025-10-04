import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }


    async createPost({title, slug, content, featuredImage, status, userId, ...rest}){
        try {
            // Appwrite collection expects attribute name 'featuredimage' (lowercase)
            const doc = {
                title,
                content,
                featuredimage: featuredImage, // map to expected field name
                status,
                userid: userId, // map to expected field name in Appwrite
                ...rest,
            };
            console.log('Appwrite createPost payload:', doc);
            console.log('featuredImage value:', featuredImage);

            const result = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                doc
            );
            console.log('Appwrite createPost result:', result);
            return result;
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return false;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status, userId, ...rest}){
        try {
            // Remove slug from the data since it's the document ID and cannot be updated
            const { slug: slugToRemove, ...data } = rest;
            
            const doc = {
                title,
                content,
                featuredimage: featuredImage,
                status,
                userid: userId || undefined,
                ...data,
            }
            
            console.log('Appwrite updatePost payload:', doc);
            console.log('Update slug (document ID):', slug);
            console.log('Database ID:', conf.appwriteDatabaseId);
            console.log('Collection ID:', conf.appwriteCollectionId);

            const result = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, // This is the document ID, not part of the document data
                doc
            );
            
            console.log('Appwrite updatePost result:', result);
            return result;
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            console.log("Error details:", error.message, error.code, error.type);
            return false;
        }
    }

    async deletePost(slug){
        try {
              await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,  
             )
             return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            const doc = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            // normalize server-side field names to client-friendly ones
            if (doc) {
                doc.userId = doc.userid || doc.userId;
                doc.featuredImage = doc.featuredimage || doc.featuredImage;
            }
            return doc;
        }catch (error) {
            console.log("Appwrite service :: getPost :: error", error); 
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){    
        try {   
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
            // normalize each document
            if (res && res.documents) {
                res.documents = res.documents.map((d) => ({
                    ...d,
                    userId: d.userid || d.userId,
                    featuredImage: d.featuredimage || d.featuredImage,
                }));
            }
            return res;
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }
    

    //file upload services
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }   

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
            
        }
    }

    getFilePreview(fileId){
        console.log('getFilePreview called with fileId:', fileId);
        console.log('Using bucketId:', conf.appwriteBucketId);
        
        if (!fileId) {
            console.error('No fileId provided to getFilePreview');
            return null;
        }
        
        try {
            // Try multiple URL approaches to find one that works
            const baseUrl = conf.appwriteUrl;
            const projectId = conf.appwriteProjectId;
            const bucketId = conf.appwriteBucketId;
            
            // Approach 1: Use download endpoint (often has more lenient permissions)
            const downloadUrl = `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/download?project=${projectId}`;
            console.log('Constructed download URL:', downloadUrl);
            
            // Approach 2: Use preview endpoint with specific parameters
            const previewUrl = `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/preview?width=400&height=300&gravity=center&quality=100&project=${projectId}`;
            console.log('Constructed preview URL:', previewUrl);
            
            // Approach 3: Use view endpoint
            const viewUrl = `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
            console.log('Constructed view URL:', viewUrl);
            
            // Try download URL first (most likely to work)
            if (downloadUrl && downloadUrl.startsWith('http')) {
                console.log('Using download URL:', downloadUrl);
                return downloadUrl;
            }
            
            // Try preview URL second
            if (previewUrl && previewUrl.startsWith('http')) {
                console.log('Using preview URL:', previewUrl);
                return previewUrl;
            }
            
            // Try view URL third
            if (viewUrl && viewUrl.startsWith('http')) {
                console.log('Using view URL:', viewUrl);
                return viewUrl;
            }
            
            // Fallback to Appwrite SDK methods
            console.log('Falling back to Appwrite SDK methods...');
            
            // Try getFileView
            try {
                const sdkViewUrl = this.bucket.getFileView(bucketId, fileId);
                console.log('Generated SDK view URL:', sdkViewUrl);
                
                if (sdkViewUrl) {
                    const viewHref = sdkViewUrl.href || sdkViewUrl.toString();
                    if (viewHref && viewHref.startsWith('http')) {
                        console.log('Using SDK view URL:', viewHref);
                        return viewHref;
                    }
                }
            } catch (sdkError) {
                console.log('SDK getFileView failed:', sdkError);
            }
            
            // Try getFilePreview
            try {
                const sdkPreview = this.bucket.getFilePreview(bucketId, fileId, 400, 300, 'center', 100);
                console.log('Generated SDK preview URL:', sdkPreview);
                
                const imageUrl = sdkPreview?.href || sdkPreview?.toString();
                if (imageUrl && imageUrl.startsWith('http')) {
                    console.log('Using SDK preview URL:', imageUrl);
                    return imageUrl;
                }
            } catch (sdkError) {
                console.log('SDK getFilePreview failed:', sdkError);
            }
            
            // Final fallback - return download URL even if we had errors
            console.log('Using final fallback - download URL');
            return downloadUrl;
            
        } catch (error) {
            console.error('Error generating file preview:', error);
            
            // Last resort - construct a basic download URL
            try {
                const fallbackUrl = `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/download?project=${conf.appwriteProjectId}`;
                console.log('Using final fallback URL:', fallbackUrl);
                return fallbackUrl;
            } catch (fallbackError) {
                console.error('Final fallback URL construction failed:', fallbackError);
                return null;
            }
        }
    }

}

const service = new Service();

export default service;
