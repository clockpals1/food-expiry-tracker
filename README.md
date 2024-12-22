

# **ScannerScreen with Food Expiry Tracker**

## **Project Overview**

This project enhances the **ScannerScreen** of a shopping and inventory app by adding a **Food Expiry Tracker** feature. The app allows users to scan food products, view detailed product information (including expiry dates), and track the expiry status of their food items. Users can set reminders for products nearing expiration, add items to their cart, and view their shopping history to track expired products.

---

## **Features**

1. **Barcode Scanner**
   - Scan food products using the camera to retrieve information such as product name, price, and expiry date.
   - **Animation**: Pulse effect guiding the barcode for scanning.

2. **Expiry Date Tracker**
   - After scanning, the app displays the product's expiry date.
   - **Expiration Countdown**: A dynamic countdown timer to show how many days are left before expiry.
   - **Color-Coding**: Products are color-coded based on their expiry status (green for fresh, yellow for near expiry, red for expired).
   - **Expiry Alert**: Notification alerts when a product is nearing its expiry date.

3. **Add to Cart with Expiry Reminder**
   - Users can add scanned products to their shopping cart.
   - An **Expiry Reminder** feature allows users to set a notification when a product is about to expire.

4. **Shopping Cart**
   - View items in the cart, with **expiry alerts** for products nearing expiration.
   - **Expiry Warning**: Products near expiry are marked with an alert icon.

5. **Shopping History**
   - Keep track of previously scanned products.
   - **Expired Items**: Products that have expired are listed with a red alert.

---

## **How It Works**

1. **Scan Products**: Use the built-in camera to scan food products. The app will retrieve information such as product name, price, and expiry date. The expiry date will be displayed with color-coding based on its proximity to the current date.
   
2. **Track Expiry Dates**: Products will be color-coded based on their expiry status:
   - **Green**: Fresh, with plenty of time before expiry.
   - **Yellow**: Approaching expiry (user-defined threshold, e.g., 3 days before expiry).
   - **Red**: Expired or passed expiry date.

3. **Set Expiry Reminders**: If a product is nearing expiry, users can choose to receive a **push notification** when it is about to expire.

4. **Shopping Cart**: Add scanned products to your cart and check the status of items nearing expiry.

5. **Shopping History**: View a list of all previously scanned products, including their expiry status. Expired items will be highlighted with a red warning.

---

## **Installation and Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/clockpals1/food-expiry-tracker.git
cd food-expiry-tracker
```

### **2. Install Dependencies**

Install the required dependencies using npm or yarn.

```bash
npm install
```
or
```bash
yarn install
```

### **3. Expo Setup**

Since this project uses Expo, make sure you have Expo installed globally:

```bash
npm install -g expo-cli
```

Then, run the app on a device or emulator:

```bash
expo start
```

This will open a browser window with a QR code. Scan the QR code with the Expo Go app on your phone to run the app.

---

## **Required Dependencies**

- **React Native** (for building the app)
- **Expo** (for easier setup and managing the app lifecycle)
- **@react-navigation/native** (for navigation)
- **@react-navigation/bottom-tabs** (for bottom tab navigation)
- **@react-native-async-storage/async-storage** (for local storage)
- **expo-notifications** (for managing push notifications)
- **@expo/vector-icons** (for icons)
- **react-native-camera** (for scanning barcodes)
- **react-navigation** (for handling navigation)
  
---

## **Features Walkthrough**

### **1. Barcode Scanner:**
   - The scanner screen utilizes the camera to scan food product barcodes. Upon successful scan, product details, including the expiry date, are displayed on the screen.

### **2. Expiry Date Tracker:**
   - **Countdown Timer**: A countdown appears on products nearing expiry. This helps users know when to consume the product before it spoils.
   - **Expiration Alert**: Products that are close to expiry (user-defined threshold) will show an alert in the product details.

### **3. Add to Cart with Expiry Reminder:**
   - After scanning a product, users can click **Add to Cart**, which will store the product in their cart. 
   - Users can also set an **Expiry Reminder** that will notify them when the product is nearing expiry.

### **4. Shopping Cart:**
   - The cart displays all added products. If a product is nearing expiry, a warning icon will show up beside it. Expired items will also be clearly marked.

### **5. Shopping History:**
   - The history section allows users to review products they've scanned in the past. Expired items will appear at the top of the list, marked in red.

---

## **Future Enhancements**

1. **User Preferences**: Allow users to set custom expiry thresholds (e.g., get a reminder 5 days before expiry).
2. **Barcode Database**: Integrate with a food product database to automatically pull nutritional information, allergens, etc.
3. **Multiple User Profiles**: Allow users to create profiles to track food expiry for different family members or roommates.
4. **Push Notifications**: Implement push notifications for new scanned items and reminders about nearing expiry products.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---





