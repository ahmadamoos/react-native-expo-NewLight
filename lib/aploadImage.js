import { Alert } from 'react-native';
import axios from 'axios';
import { auth, uploadFile } from './firebase';
import root from '../lib/apihttp';


const uploadImagesToServer = async (images) => {
  const formData = new FormData();

  // Append each selected image to FormData
  images.forEach((uri) => {
    formData.append('images', {
      uri: uri,
      name: uri.split('/').pop(),
      type: 'image/jpeg', // Adjust if necessary
    });
  });

  try {
    const response = await fetch(`http://${root}:3000/upload-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const responseData = await response.json();
    if (response.ok) {
      return responseData.imageUrls; // Assuming your server returns image URLs
    } else {
      throw new Error('Failed to upload images');
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    Alert.alert('Error', 'There was an issue uploading the images');
    throw error;
  }
};

const uploadProduct = async (data) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }



    // Upload images first and get URLs
    if (!Array.isArray(data.images) || data.images.length === 0) {
      throw new Error('No images provided');
    }

    const imageUrls = await Promise.all(
      data.images.map((imageUri, index) => {
        return uploadFile(imageUri, 'images', index); // Pass index to generate unique filenames
      })
    );
    console.log('Uploaded image URLs:', imageUrls);

    // Create product data including image URLs
    const productData = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      variations: data.variations,
      images: imageUrls, // Send the URLs of the images
    };

    const idToken = await auth.currentUser.getIdToken();

    // Send product data to your server
    const response = await axios.post(
      `http://${root}:3000/createproduct`,
      productData,

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
export default uploadProduct;