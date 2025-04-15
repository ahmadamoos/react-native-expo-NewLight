import axios from "axios";
import { uploadFileforads } from "./firebase";
import { Alert } from "react-native";
import root from "./apihttp";

const uploadAdsimage = async (data) => {
    try {
        // Check if images exist
        if (!Array.isArray(data.images) || data.images.length === 0) {
            throw new Error('No images provided');
        }

        // Upload images first and get URLs
        const imageUrls = await Promise.all(
            data.images.map((imageUri, index) => {
                return uploadFileforads(imageUri, 'images', index); // Pass index to generate unique filenames
            })
        );

        console.log('Uploaded image URLs:', imageUrls);
        console.log('name:', data.name);


        const requestBody = {
            productData: {
                imageUrls,
                name: data.name
            }
        };

        // Send product data to your server
        const response = await axios.post(
            `http://${root}:3000/save-image-url`,
            requestBody
        );

        if (response.status === 200) {
            Alert.alert('Success', 'Product created successfully');
        } else {
            throw new Error('Error creating product');
        }

    } catch (error) {
        console.error('Error uploading product:', error);

        if (error.response) {
            Alert.alert('Server Error', error.response.data.message || 'Failed to upload product');
        } else if (error.request) {
            Alert.alert('Network Error', 'Please check your internet connection and try again');
        } else {
            Alert.alert('Error', error.message || 'An unknown error occurred');
        }
    }
};

export default uploadAdsimage;
