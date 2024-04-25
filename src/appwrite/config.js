/* eslint-disable no-useless-catch */
/* eslint-disable no-empty */
import conf from "../config/config";

import { Client,ID,Databases,Storage,Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);
        this.databases = new Databases();
        this.bucket = new Storage();

    }
    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.databases.createDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                status,
                userId,
            })
        } catch (error) {
            throw error;
        }
    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
          return await this.databases.updateDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug,{
            title,
            content,
            featuredImage,
            status
          })   
        } catch (error) {
            throw error;
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug);
            return true;
        } catch (error) {
            console.log("ERROR IN DELETION :: ",error);
            return false;
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug);
        } catch (error) {
            console.log("Error in getting post :: ",error);
            return false;
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(conf.appWriteDatabaseId,conf.appWriteCollectionId,queries)
        } catch (error) {
            console.log("ERROR IN GETTING POSTS :: ",error);
            return false;
        }
    }
    //file upload service
    async uploadFile(file){
         try {
            return this.bucket.createFile(conf.appWriteBucketId,ID.unique(),file);
         } catch (error) {
            console.log("Error in uploading file :: ",error);
            return false;
         }
    }
    async deleteFile(fileId){
        try {
            this.bucket.deleteFile(conf.appWriteBucketId,fileId);
            return true;
        } catch (error) {
            console.log("Error in deleting file :: ",error);
            return false;
        }
    }
    getFilePreview(fileId){
        return this.bucket.getFilePreview(conf.appWriteBucketId,fileId);
    }
}

const service = new Service();
export default service;
