# NewLighteStore

This project is a full-stack application built using **Expo Bare Workflow**. It is designed for admin usage, with separate functionality for users. The app allows easy management of products, orders, and user interactions. 

## Features

- **Admin Version**: 
  - Manage products, categories, and user data.
  - View and manage orders in real-time.
  - Full access to all admin functionalities.
  
- **User Version**: 
  - Browse products and categories.
  - Add products to the cart and place orders.
  - View order history.

## Tech Stack

- **Frontend**: React Native (Expo Bare Workflow)
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: Firebase Authentication (Email & Password, Google Sign-In)
- **State Management**: Redux
- **Real-time Updates**: Firebase Realtime Database

## Setup Instructions

To get started with this project:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NewLighteStore.git

2. Install dependencies:

npm install

3. Set up Firebase and MySQL:

Create a Firebase project and integrate Firebase Authentication.

Set up your MySQL database and configure the API to connect to it.

4. Facebook Login Configuration:

Go to the Facebook Developer [here](https://developers.facebook.com/) Console and create a new app to get your Facebook App ID and Facebook Client Token.

Add the following environment variables in your .env file:

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_CLIENT_TOKEN=your-facebook-client-token
FACEBOOK_SCHEME=your-facebook-scheme (Optional, only if needed)

## 📸 Screenshots

<h3>📱 Home Screen</h3>

<p float="left"> <img src="./assets/screenshots/HomePagee/WhatsApp Image 2025-04-15 at 2.44.07 AM (4).jpeg" width="30%" /> <img src="./assets/screenshots/HomePagee/WhatsApp Image 2025-04-15 at 2.44.07 AM (3).jpeg" width="30%" /> <img src="./assets/screenshots/HomePagee/WhatsApp Image 2025-04-15 at 2.44.07 AM (2).jpeg" width="30%" /> </p>

<h3>🛒 Cart</h3>

<p float="left"> <img src="./assets/screenshots/CartPagee/WhatsApp Image 2025-04-15 at 2.44.06 AM (7).jpeg" width="30%" /> <img src="./assets/screenshots/CartPagee/WhatsApp Image 2025-04-15 at 2.44.06 AM (6).jpeg" width="30%" /> <img src="./assets/screenshots/CartPagee/WhatsApp Image 2025-04-15 at 2.44.04 AM.jpeg" width="30%" /> </p>


<h3>🔍 Search</h3>

<p float="left"> <img src="./assets/screenshots/SearchPage/WhatsApp Image 2025-04-15 at 2.44.06 AM (5).jpeg" width="30%" /> <img src="./assets/screenshots/SearchPage/WhatsApp Image 2025-04-15 at 2.44.06 AM (4).jpeg" width="30%" /> <img src="./assets/screenshots/SearchPage/WhatsApp Image 2025-04-15 at 2.44.07 AM (1).jpeg" width="30%" /> </p>


<h3>🔐 Sign In</h3>

<p float="left"> <img src="./assets/screenshots/SigninPage/WhatsApp Image 2025-04-15 at 2.44.04 AM (3).jpeg" width="30%" /> </p>


<h3>📝 Sign Up</h3>

<p float="left"> <img src="./assets/screenshots/SigninPage/WhatsApp Image 2025-04-15 at 2.44.04 AM (3).jpeg" width="30%" /> </p>


<h3>🗺️ User Location</h3>

<p float="left"> <img src="./assets/screenshots/UserLocation/WhatsApp Image 2025-04-15 at 2.44.04 AM (1).jpeg" width="30%" /> <img src="./assets/screenshots/UserLocation/WhatsApp Image 2025-04-15 at 2.44.06 AM (1).jpeg" width="30%" /> <img src="./assets/screenshots/UserLocation/WhatsApp Image 2025-04-15 at 2.44.06 AM.jpeg" width="30%" /> </p>


<h3>📦 User Orders</h3>

<p float="left"> <img src="./assets/screenshots/UserOrderPage/WhatsApp Image 2025-04-15 at 2.44.05 AM (14).jpeg" width="48%" /> <img src="./assets/screenshots/UserOrderPage/WhatsApp Image 2025-04-15 at 2.44.05 AM (13).jpeg" width="48%" /> </p>


<h3>👤 User Page</h3>

<p float="left"> <img src="./assets/screenshots/UserPage/WhatsApp Image 2025-04-15 at 2.44.06 AM (3).jpeg" width="30%" /> </p>


<h3>🛠️ Admin Add Product</h3>

<p float="left"> <img src="./assets/screenshots/UploadProducts/WhatsApp Image 2025-04-15 at 2.44.05 AM.jpeg" width="48%" /> <img src="./assets/screenshots/UploadProducts/WhatsApp Image 2025-04-15 at 2.44.05 AM (18).jpeg" width="48%" /> </p>


<h3>🛠️ Admin Update Product</h3>

<p float="left"> <img src="./assets/screenshots/UpdateProducts/WhatsApp Image 2025-04-15 at 2.44.05 AM (17).jpeg" width="30%" /> <img src="./assets/screenshots/UpdateProducts/WhatsApp Image 2025-04-15 at 2.44.05 AM (16).jpeg" width="30%" /> <img src="./assets/screenshots/UpdateProducts/WhatsApp Image 2025-04-15 at 2.44.05 AM (15).jpeg" width="30%" /> </p>


<h3>🎨 Admin Home Decoration</h3>

<p float="left"> <img src="./assets/screenshots/AdminDec/WhatsApp Image 2025-04-15 at 2.44.05 AM (9).jpeg" width="30%" /> <img src="./assets/screenshots/AdminDec/WhatsApp Image 2025-04-15 at 2.44.05 AM (8).jpeg" width="30%" /> <img src="./assets/screenshots/AdminDec/WhatsApp Image 2025-04-15 at 2.44.05 AM (6).jpeg" width="30%" /> </p> <p float="left"> <img src="./assets/screenshots/AdminDec/WhatsApp Image 2025-04-15 at 2.44.05 AM (7).jpeg" width="48%" /> <img src="./assets/screenshots/AdminDec/WhatsApp Image 2025-04-15 at 2.44.05 AM (5).jpeg" width="48%" /> </p>


<h3>📦 Admin Orders</h3>

<p float="left"> <img src="./assets/screenshots/AdminOrderPage/WhatsApp Image 2025-04-15 at 2.44.05 AM (12).jpeg" width="30%" /> <img src="./assets/screenshots/AdminOrderPage/WhatsApp Image 2025-04-15 at 2.44.05 AM (11).jpeg" width="30%" /> <img src="./assets/screenshots/AdminOrderPage/WhatsApp Image 2025-04-15 at 2.44.05 AM (10).jpeg" width="30%" /> </p>


<h3>🗺️ Admin Location</h3>

<p float="left"> <img src="./assets/screenshots/AdminLocation/WhatsApp Image 2025-04-15 at 2.44.05 AM (3).jpeg" width="30%" /> <img src="./assets/screenshots/AdminLocation/WhatsApp Image 2025-04-15 at 2.44.05 AM (2).jpeg" width="30%" /> <img src="./assets/screenshots/AdminLocation/WhatsApp Image 2025-04-15 at 2.44.05 AM (1).jpeg" width="30%" /> </p>


## License

This project is licensed under the **CC BY-NC-ND 4.0** license.  

You can view the full license [here](https://creativecommons.org/licenses/by-nc-nd/4.0/).

You may share this project, but you cannot use, modify, or redistribute it without permission.

## Contact
For more information or inquiries, feel free to contact me at [ahmad.amoos@hotmail.com].
