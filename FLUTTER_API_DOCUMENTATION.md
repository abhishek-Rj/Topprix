# Toprix Backend API Documentation for Flutter

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses email-based authentication. For most endpoints, you need to include the user's email in the request headers:

```
user-email: user@example.com
```

## User Roles
- `USER`: Regular user (default)
- `RETAILER`: Store owner with subscription capabilities
- `ADMIN`: Full admin access

## Data Models

### User
```dart
class User {
  String id;
  String email;
  String? phone;
  String? name;
  String role; // USER, RETAILER, ADMIN
  String? location;
  String? stripeCustomerId;
  bool hasActiveSubscription;
  String? subscriptionStatus;
  DateTime createdAt;
  DateTime updatedAt;
}
```

### Store
```dart
class Store {
  String id;
  String name;
  String? logo;
  String? description;
  String? address;
  double? latitude;
  double? longitude;
  String? ownerId;
  DateTime createdAt;
  DateTime updatedAt;
}
```

### Category
```dart
class Category {
  String id;
  String name;
  String? description;
  DateTime createdAt;
  DateTime updatedAt;
}
```

### Flyer
```dart
class Flyer {
  String id;
  String title;
  String storeId;
  String imageUrl;
  DateTime startDate;
  DateTime endDate;
  bool isSponsored;
  bool isPremium;
  double? price;
  bool isPaid;
  DateTime createdAt;
  DateTime updatedAt;
}
```

### FlyerItem
```dart
class FlyerItem {
  String id;
  String flyerId;
  String name;
  double price;
  double? oldPrice;
  String? imageUrl;
  String? description;
  DateTime createdAt;
  DateTime updatedAt;
}
```

### Coupon
```dart
class Coupon {
  String id;
  String title;
  String storeId;
  String? code;
  String? barcodeUrl;
  String? qrCodeUrl;
  String discount;
  String? description;
  DateTime startDate;
  DateTime endDate;
  bool isOnline;
  bool isInStore;
  bool isPremium;
  double? price;
  DateTime createdAt;
  DateTime updatedAt;
}
```

## API Endpoints

### 1. User Management

#### Register User
```http
POST /register
```

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "location": "string (optional)",
  "role": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "role": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

#### Get User
```http
GET /user/{email}
```

**Headers:** `user-email: user@example.com`

#### Update User
```http
POST /user/update/{email}
```

**Headers:** `user-email: user@example.com`

#### Delete User
```http
DELETE /user/delete/{email}
```

**Headers:** `user-email: user@example.com`

### 2. Store Management

#### Get Store by ID
```http
GET /store/{id}
```

#### Get Stores with Filters
```http
GET /stores?category={categoryId}&name={storeName}&location={location}
```

#### Create Store (RETAILER/ADMIN only)
```http
POST /store
```

**Headers:** `user-email: user@example.com`

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "logo": "string (optional)",
  "address": "string (optional)",
  "latitude": "number (optional)",
  "longitude": "number (optional)",
  "categoryIds": ["string"] // optional array
}
```

**Response (201):**
```json
{
  "message": "Store created successfully",
  "store": {
    "id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "address": "string",
    "latitude": "number",
    "longitude": "number",
    "ownerId": "string",
    "categories": [],
    "owner": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

#### Update Store (RETAILER/ADMIN only)
```http
PUT /store/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Store (ADMIN only)
```http
DELETE /store/{id}
```

**Headers:** `user-email: user@example.com`

### 3. Category Management

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /category/{id}
```

#### Create Category (RETAILER/ADMIN only)
```http
POST /category
```

**Headers:** `user-email: user@example.com`

### 4. Flyer Management

#### Get All Flyers
```http
GET /flyers?storeId={storeId}&categoryId={categoryId}&isSponsored={boolean}
```

#### Get Flyer by ID
```http
GET /flyers/{id}
```

#### Create Flyer (RETAILER only)
```http
POST /flyers
```

**Headers:** `user-email: user@example.com`

**Request Body:**
```json
{
  "title": "string (required)",
  "storeId": "string (required)",
  "imageUrl": "string (required)",
  "startDate": "string (required, ISO date)",
  "endDate": "string (required, ISO date)",
  "isSponsored": "boolean (optional)",
  "categoryIds": ["string"], // optional
  "isPremium": "boolean (optional, default: false)",
  "isPaid": "boolean (optional, default: false)"
}
```

**Response (201):**
```json
{
  "message": "string",
  "flyer": {
    "id": "string",
    "title": "string",
    "storeId": "string",
    "imageUrl": "string",
    "startDate": "datetime",
    "endDate": "datetime",
    "isSponsored": "boolean",
    "isPremium": "boolean",
    "isPaid": "boolean",
    "price": "number or null",
    "store": {},
    "categories": []
  },
  "requiresPayment": "boolean",
  "paymentAmount": "number",
  "currency": "string",
  "paymentType": "string",
  "paymentInstructions": "string or null"
}
```

#### Save Flyer (RETAILER/ADMIN only)
```http
POST /flyers/save
```

**Headers:** `user-email: user@example.com`

#### Add Flyer Item (RETAILER/ADMIN only)
```http
POST /flyers/items
```

**Headers:** `user-email: user@example.com`

#### Delete Flyer (RETAILER/ADMIN only)
```http
DELETE /flyers/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Flyer Item (RETAILER/ADMIN only)
```http
DELETE /flyers/items/{id}
```

**Headers:** `user-email: user@example.com`

### 5. Coupon Management

#### Get All Coupons
```http
GET /coupons?storeId={storeId}&categoryId={categoryId}&isOnline={boolean}&isInStore={boolean}
```

#### Get Coupon by ID
```http
GET /coupons/{id}
```

#### Create Coupon (RETAILER/ADMIN only)
```http
POST /coupons
```

**Headers:** `user-email: user@example.com`

**Request Body:**
```json
{
  "title": "string (required)",
  "storeId": "string (required)",
  "code": "string (optional)",
  "barcodeUrl": "string (optional)",
  "qrCodeUrl": "string (optional)",
  "discount": "string (required)",
  "description": "string (optional)",
  "startDate": "string (required, ISO date)",
  "endDate": "string (required, ISO date)",
  "isOnline": "boolean (optional, default: true)",
  "isInStore": "boolean (optional, default: true)",
  "categoryIds": ["string"], // optional
  "isPremium": "boolean (optional, default: false)",
  "price": "number (required if isPremium=true)"
}
```

#### Update Coupon (RETAILER/ADMIN only)
```http
PUT /coupons/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Coupon (RETAILER/ADMIN only)
```http
DELETE /coupons/{id}
```

**Headers:** `user-email: user@example.com`

#### Save Coupon
```http
POST /coupons/save
```

**Headers:** `user-email: user@example.com`

#### Unsave Coupon
```http
POST /coupons/unsave
```

**Headers:** `user-email: user@example.com`

#### Get User Coupons
```http
GET /users/{userId}/coupons
```

**Headers:** `user-email: user@example.com`

### 6. User Preferences

#### Add Preferred Store
```http
POST /user/{email}/preferred-stores/add
```

#### Remove Preferred Store
```http
POST /user/{email}/preferred-stores/remove
```

#### Get Preferred Stores
```http
GET /user/{email}/preferred-stores
```

#### Add Preferred Category
```http
POST /user/{email}/preferred-categories/add
```

#### Remove Preferred Category
```http
POST /user/{email}/preferred-categories/remove
```

#### Get Preferred Categories
```http
GET /user/{email}/preferred-categories
```

### 7. Shopping Lists

#### Create Shopping List
```http
POST /api/shopping-lists
```

**Headers:** `user-email: user@example.com`

**Request Body:**
```json
{
  "userId": "string (required)",
  "title": "string (required)"
}
```

#### Get User Shopping Lists
```http
GET /api/users/{userId}/shopping-lists
```

**Headers:** `user-email: user@example.com`

#### Get Shopping List by ID
```http
GET /api/shopping-lists/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Shopping List
```http
DELETE /api/shopping-lists/{id}
```

**Headers:** `user-email: user@example.com`

#### Add Shopping List Item
```http
POST /api/shopping-lists/{shoppingListId}/items
```

**Headers:** `user-email: user@example.com`

#### Update Shopping List Item
```http
PUT /api/shopping-list-items/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Shopping List Item
```http
DELETE /api/shopping-list-items/{id}
```

**Headers:** `user-email: user@example.com`

### 8. Wishlist

#### Add to Wishlist
```http
POST /api/users/{userId}/wishlist
```

**Headers:** `user-email: user@example.com`

**Request Body:**
```json
{
  "name": "string (required)",
  "flyerItemId": "string (optional)",
  "targetPrice": "number (optional)"
}
```

#### Get User Wishlist
```http
GET /api/users/{userId}/wishlist
```

**Headers:** `user-email: user@example.com`

#### Update Wishlist Item
```http
PUT /api/wishlist-items/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete from Wishlist
```http
DELETE /api/wishlist-items/{id}
```

**Headers:** `user-email: user@example.com`

### 9. Location Services

#### Get Nearby Stores
```http
GET /location/nearby-stores?latitude={lat}&longitude={lng}&radius={km}
```

#### Get Nearby Deals
```http
GET /location/nearby-deals?latitude={lat}&longitude={lng}&radius={km}
```

### 10. Payments

#### Create Payment Intent
```http
POST /api/payment-intents
```

**Headers:** `user-email: user@example.com`

#### Handle Payment Success
```http
POST /api/payment-success
```

**Headers:** `user-email: user@example.com`

#### Get User Payments
```http
GET /api/users/{userId}/payments
```

**Headers:** `user-email: user@example.com`

### 11. Subscriptions (RETAILER/ADMIN only)

#### Create Subscription
```http
POST /api/subscriptions
```

**Headers:** `user-email: user@example.com`

#### Cancel Subscription
```http
POST /api/subscriptions/cancel
```

**Headers:** `user-email: user@example.com`

#### Get User Subscription
```http
GET /api/users/{userId}/subscription
```

**Headers:** `user-email: user@example.com`

#### Update Subscription
```http
PUT /api/subscriptions
```

**Headers:** `user-email: user@example.com`

#### Complete Checkout Session
```http
POST /api/subscriptions/checkout/complete
```

**Headers:** `user-email: user@example.com`

### 12. Pricing Plans

#### Get Pricing Plans (Public)
```http
GET /api/pricing-plans
```

#### Create Pricing Plan (ADMIN only)
```http
POST /api/pricing-plans
```

**Headers:** `user-email: user@example.com`

#### Update Pricing Plan (ADMIN only)
```http
PUT /api/pricing-plans/{id}
```

**Headers:** `user-email: user@example.com`

#### Delete Pricing Plan (ADMIN only)
```http
DELETE /api/pricing-plans/{id}
```

**Headers:** `user-email: user@example.com`

## Error Responses

All endpoints return errors in the following format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

### Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing authentication)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## Implementation Notes for Flutter

### 1. HTTP Client Setup
```dart
class ApiClient {
  static const String baseUrl = 'http://localhost:3000';
  
  static Future<Response> authenticatedRequest(
    String method,
    String endpoint,
    String userEmail, {
    Map<String, dynamic>? body,
    Map<String, String>? queryParams,
  }) async {
    final headers = {
      'Content-Type': 'application/json',
      'user-email': userEmail,
    };
    
    // Implementation depends on your HTTP client (dio, http, etc.)
  }
}
```

### 2. Authentication Flow
1. User registers/logs in
2. Store user email locally (SharedPreferences/Secure Storage)
3. Include email in `user-email` header for subsequent requests
4. Handle 401/403 responses by redirecting to login

### 3. Role-Based UI
Check user role and subscription status to show/hide features:
- RETAILER: Can create stores, flyers, coupons (with subscription)
- ADMIN: Full access to all features
- USER: Can browse, save, and manage personal lists

### 4. Subscription Handling
For RETAILER users, check `hasActiveSubscription` before allowing:
- Store creation (max 5 stores)
- Free flyer uploads
- Premium features

### 5. Error Handling
Implement consistent error handling for all API calls:
```dart
try {
  final response = await apiClient.get('/endpoint');
  return response.data;
} catch (e) {
  if (e.response?.statusCode == 401) {
    // Redirect to login
  } else if (e.response?.statusCode == 403) {
    // Show permission error
  }
  // Handle other errors
}
```

### 6. Data Synchronization
Consider implementing:
- Offline caching for frequently accessed data
- Pull-to-refresh for lists
- Real-time updates for user-specific data

This documentation covers all the main API endpoints and should provide everything needed to build the Flutter mobile app.