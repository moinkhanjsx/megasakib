import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            // Remove image field from data as it's not part of the database schema
            const { image, ...postData } = data;

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...postData,
                featuredImage: file ? file.$id : post.featuredImage,
                userId: post.userId || post.userid, // Preserve the original user ID
            });                                                 

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            console.log('Creating new post, data.image:', data.image);
            const file = await appwriteService.uploadFile(data.image[0]);
            console.log('File upload result:', file);

            if (file) {
                const fileId = file.$id;
                console.log('File ID:', fileId);
                const { image, ...postData } = data; // Remove image field from data
                postData.featuredImage = fileId;
                console.log('Post data before createPost:', postData);
                const dbPost = await appwriteService.createPost({ ...postData, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe(); 
    }, [watch, slugTransform, setValue]);

   return (
        <form onSubmit={handleSubmit(submit)} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {post ? "Edit Post" : "Create New Post"}
                    </h1>
                    <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                        {post ? "Update your blog post details" : "Share your thoughts with the world"}
                    </p>
                </div>
                
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Title
                                </label>
                                <Input
                                    placeholder="Enter your post title..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    {...register("title", { required: true })}
                                />
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Slug
                                </label>
                                <Input
                                    placeholder="post-url-slug"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    {...register("slug", { required: true })}
                                    onInput={(e) => {
                                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    This will be used in the URL: /post/your-slug
                                </p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Content
                                </label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[300px]">
                                    <RTE name="content" control={control} defaultValue={getValues("content")} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 lg:space-y-6">
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Featured Image
                                </label>
                                <div className="space-y-4">
                                    <Input
                                        type="file"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        accept="image/png, image/jpg, image/jpeg, image/gif"
                                        {...register("image", { required: !post })}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Supported formats: PNG, JPG, JPEG, GIF
                                    </p>
                                </div>
                                
                                {post && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Image
                                        </label>
                                        <div className="relative group">
                                            <img
                                                src={appwriteService.getFilePreview(post.featuredImage)}
                                                alt={post.title}
                                                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <Select
                                    options={["active", "inactive"]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    {...register("status", { required: true })}
                                />
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-blue-700">
                                            <strong>Active:</strong> Post will be visible to all users<br/>
                                            <strong>Inactive:</strong> Post will be saved as draft
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6">
                                <Button 
                                    type="submit" 
                                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        <span className="text-sm sm:text-base">{post ? "Update Post" : "Publish Post"}</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
