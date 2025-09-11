# 🚀 Toprix Backend API Documentation

> **Modern REST API for the Toprix platform** - Comprehensive e-commerce solution with coupons, flyers, anti-waste management, and subscription services.

---

## 📋 Table of Contents

- [🔧 Getting Started](#-getting-started)
- [🔐 Authentication](#-authentication)
- [👥 User Management](#-user-management)
- [🏪 Store Management](#-store-management)
- [📂 Categories & Subcategories](#-categories--subcategories)
- [🎟️ Coupons](#️-coupons)
- [📄 Flyers](#-flyers)
- [♻️ Anti-Waste Items](#️-anti-waste-items)
- [🛒 Shopping Lists](#-shopping-lists)
- [💝 Wishlist](#-wishlist)
- [💳 Payments & Subscriptions](#-payments--subscriptions)
- [📍 Location Services](#-location-services)
- [🔗 Webhooks](#-webhooks)
- [📊 Response Format](#-response-format)
- [⚡ Status Codes](#-status-codes)

---

## 🔧 Getting Started

### Base URL
```
Production:  https://api.toprix.com
Development: http://localhost:3000
```

### 📋 Prerequisites
- Valid JWT token for authenticated endpoints
- Content-Type: `application/json` for POST/PUT requests
- Stripe webhook signature for webhook endpoints

---

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **`USER`** - Regular customers
- **`RETAILER`** - Store owners with subscription
- **`ADMIN`** - Platform administrators

---

## 👥 User Management

### Register New User
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "USER",
  "location": "New York, NY"
}
```

### Get User Profile (Enhanced)
```http
GET /user/:email
Authorization: Bearer <token>
Query Parameters: ?includeDetails=true

Response includes:
- Basic user info
- Owned stores (for retailers)
- Saved coupons/flyers
- Shopping lists & wishlist
- Subscription information
- User statistics
```

### Update User Profile
```http
POST /user/update/:email
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "location": "Updated Location"
}
```

### Delete User Account
```http
DELETE /user/delete/:email
Authorization: Bearer <token>
```

### 👤 User Preferences

#### Preferred Stores
```http
POST /user/:email/preferred-stores/add
Content-Type: application/json
{ "storeId": "uuid" }

POST /user/:email/preferred-stores/remove  
Content-Type: application/json
{ "storeId": "uuid" }

GET /user/:email/preferred-stores
```

#### Preferred Categories
```http
POST /user/:email/preferred-categories/add
Content-Type: application/json
{ "categoryId": "uuid" }

POST /user/:email/preferred-categories/remove
Content-Type: application/json
{ "categoryId": "uuid" }

GET /user/:email/preferred-categories
```

---

## 🏪 Store Management

### Get Store Details
```http
GET /store/:id
```

### Get Stores with Advanced Filtering
```http
GET /stores
Query Parameters:
?search=walmart
&categoryIds=uuid1,uuid2
&subcategoryIds=uuid1,uuid2  
&latitude=40.7128
&longitude=-74.0060
&radius=25
&page=1
&limit=20
```

### Create Store (Retailer/Admin)
```http
POST /store
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "name": "My Awesome Store",
  "description": "Best deals in town",
  "address": "123 Main St, City, State",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "logo": "https://example.com/logo.jpg"
}
```

### Update Store (Retailer/Admin)
```http
PUT /store/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "name": "Updated Store Name",
  "description": "Updated description"
}
```

### Delete Store (Retailer/Admin)
```http
DELETE /store/:id  
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
```

---

## 📂 Categories & Subcategories

### 📋 Categories

#### Get All Categories
```http
GET /categories
Query Parameters: ?search=electronics&page=1&limit=20
```

#### Get Category by ID
```http
GET /category/:id
```

#### Create Category (Retailer/Admin)
```http
POST /category
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic products and gadgets"
}
```

### 🏷️ Subcategories

#### Get Categories with Subcategories
```http
GET /categories/with-subcategories
Query Parameters:
?categoryId=uuid
&subcategoryId=uuid
&includeContent=true
&page=1
&limit=20
```

#### Get All Subcategories
```http
GET /subcategories
Query Parameters: ?categoryId=uuid&search=smartphone&page=1&limit=20
```

#### Create Subcategory (Retailer/Admin)
```http
POST /subcategories
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "categoryId": "uuid"
}
```

#### Update Subcategory (Retailer/Admin)
```http
PUT /subcategories/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "categoryId": "uuid"
}
```

#### Delete Subcategory (Retailer/Admin)
```http
DELETE /subcategories/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
```

---

## 🎟️ Coupons

### Get All Coupons with Filtering
```http
GET /coupons
Query Parameters:
?search=discount
&categoryIds=uuid1,uuid2
&subcategoryIds=uuid1,uuid2
&storeId=uuid
&status=active
&isPremium=false
&page=1
&limit=20
```

### Get Coupon Details
```http
GET /coupons/:id
Query Parameters: ?includeRelatedCoupons=true
```

### Get User's Saved Coupons
```http
GET /users/:userId/coupons
Authorization: Bearer <token>
Query Parameters:
?categoryId=uuid
&subcategoryId=uuid
&storeId=uuid
&status=active
&page=1
&limit=20
```

### Create Coupon (Retailer/Admin)
```http
POST /coupons
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role + Store ownership
Content-Type: application/json

{
  "title": "50% Off Electronics",
  "storeId": "uuid",
  "code": "SAVE50",
  "discount": "50%",
  "description": "Get 50% off on all electronics",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "isOnline": true,
  "isInStore": true,
  "isPremium": false,
  "price": 0,
  "categoryIds": ["uuid1", "uuid2"],
  "subcategoryIds": ["uuid1", "uuid2"]
}
```

### Update Coupon (Retailer/Admin)
```http
PUT /coupons/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role + Store ownership
Content-Type: application/json

{
  "title": "Updated Title",
  "discount": "60%",
  "description": "Updated description"
}
```

### Delete Coupon (Retailer/Admin)
```http
DELETE /coupons/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Query Parameters: ?force=true
```

### 💾 User Coupon Actions

#### Save Coupon
```http
POST /coupons/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "couponId": "uuid",
  "userId": "uuid"
}
```

#### Unsave Coupon
```http
POST /coupons/unsave
Authorization: Bearer <token>
Content-Type: application/json

{
  "couponId": "uuid",
  "userId": "uuid"
}
```

---

## 📄 Flyers

### Get All Flyers with Filtering
```http
GET /flyers
Query Parameters:
?search=sale
&categoryIds=uuid1,uuid2
&subcategoryIds=uuid1,uuid2
&storeId=uuid
&status=active
&page=1
&limit=20
```

### Get Flyer Details
```http
GET /flyers/:id
```

### Create Flyer (Retailer/Admin)
```http
POST /flyers
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "title": "Weekly Sale Flyer",
  "storeId": "uuid",
  "imageUrl": "https://example.com/flyer.jpg",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-07T23:59:59Z",
  "categoryIds": ["uuid1", "uuid2"],
  "subcategoryIds": ["uuid1", "uuid2"]
}
```

### Update Flyer (Retailer/Admin)
```http
PUT /flyers/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "title": "Updated Flyer Title",
  "description": "Updated description"
}
```

### Delete Flyer (Retailer/Admin)
```http
DELETE /flyers/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
```

### Save Flyer
```http
POST /flyers/save
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "flyerId": "uuid",
  "userId": "uuid"
}
```

### 📦 Flyer Items Management

#### Add Flyer Item (Retailer/Admin)
```http
POST /flyers/items
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
Content-Type: application/json

{
  "flyerId": "uuid",
  "name": "Product Name",
  "price": 29.99,
  "oldPrice": 39.99,
  "imageUrl": "https://example.com/product.jpg",
  "description": "Product description"
}
```

#### Delete Flyer Item (Retailer/Admin)
```http
DELETE /flyers/items/:id
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role
```

---

## ♻️ Anti-Waste Items

### Get Anti-Waste Items
```http
GET /api/antiwaste
Query Parameters:
?storeId=uuid
&category=Dairy
&condition=NEAR_EXPIRY
&minDiscount=20
&maxPrice=50
&isAvailable=true
&page=1
&limit=20
```

### Get Store's Anti-Waste Items
```http
GET /api/stores/:storeId/antiwaste
Query Parameters:
?category=Bakery
&condition=SURPLUS_STOCK
&page=1
&limit=20
```

### Create Anti-Waste Item (Retailer/Admin)
```http
POST /api/antiwaste
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role + Store ownership
Content-Type: application/json

{
  "storeId": "uuid",
  "name": "Fresh Bread",
  "description": "Artisan bread nearing expiry",
  "originalPrice": 3.99,
  "discountedPrice": 1.99,
  "discountPercentage": 50,
  "quantity": 10,
  "expiryDate": "2025-02-15T23:59:59Z",
  "imageUrl": "https://example.com/bread.jpg",
  "category": "Bakery",
  "condition": "NEAR_EXPIRY"
}
```

### Update Anti-Waste Item (Retailer/Admin)
```http
PUT /api/antiwaste/:itemId
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role + Store ownership
Content-Type: application/json

{
  "quantity": 5,
  "discountedPrice": 1.49,
  "isAvailable": false
}
```

### Delete Anti-Waste Item (Retailer/Admin)
```http
DELETE /api/antiwaste/:itemId
Authorization: Bearer <token>
Requires: RETAILER or ADMIN role + Store ownership
```

#### Anti-Waste Conditions
- `NEAR_EXPIRY` - Products close to expiry date
- `SURPLUS_STOCK` - Overstocked items  
- `SEASONAL` - End of season items
- `SLIGHTLY_DAMAGED` - Minor cosmetic issues
- `SHORT_DATED` - Short remaining shelf life

---

## 🛒 Shopping Lists

### Get User's Shopping Lists
```http
GET /api/users/:userId/shopping-lists
Authorization: Bearer <token>
Query Parameters: ?page=1&limit=20
```

### Get Shopping List Details
```http
GET /api/shopping-lists/:id
Authorization: Bearer <token>
```

### Create Shopping List
```http
POST /api/shopping-lists
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Weekly Groceries",
  "userId": "uuid"
}
```

### Delete Shopping List
```http
DELETE /api/shopping-lists/:id
Authorization: Bearer <token>
```

### 📋 Shopping List Items

#### Add Item to Shopping List
```http
POST /api/shopping-lists/:shoppingListId/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Organic Milk",
  "quantity": 2,
  "flyerItemId": "uuid" // optional - links to specific flyer item
}
```

#### Update Shopping List Item
```http
PUT /api/shopping-list-items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Almond Milk",
  "quantity": 3,
  "isChecked": true
}
```

#### Delete Shopping List Item
```http
DELETE /api/shopping-list-items/:id
Authorization: Bearer <token>
```

---

## 💝 Wishlist

### Get User's Wishlist
```http
GET /api/wishlist/:userId
Authorization: Bearer <token>
Query Parameters: ?page=1&limit=20
```

### Add Item to Wishlist
```http
POST /api/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "name": "iPhone 15 Pro",
  "targetPrice": 999.99,
  "flyerItemId": "uuid" // optional - links to specific flyer item
}
```

### Update Wishlist Item
```http
PUT /api/wishlist/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "targetPrice": 899.99
}
```

### Delete Wishlist Item
```http
DELETE /api/wishlist/:itemId
Authorization: Bearer <token>
```

---

## 💳 Payments & Subscriptions

### 💰 Payment Management

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 2999, // amount in cents (€29.99)
  "currency": "eur",
  "paymentType": "COUPON_PURCHASE",
  "couponId": "uuid" // optional
}
```

#### Get User's Payment History
```http
GET /api/payments/user/:userId
Authorization: Bearer <token>
Query Parameters: ?page=1&limit=20
```

#### Handle Payment Success
```http
POST /api/payments/success
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxxxxx",
  "userId": "uuid"
}
```

### 💎 Pricing Plans

#### Get All Pricing Plans
```http
GET /api/pricing-plans
Query Parameters: ?isActive=true&currency=eur
```

#### Create Pricing Plan (Admin)
```http
POST /api/pricing-plans
Authorization: Bearer <token>
Requires: ADMIN role
Content-Type: application/json

{
  "name": "Premium Retailer Plan",
  "description": "Full access to premium features",
  "stripePriceId": "price_xxxxxxxx",
  "amount": 90.99,
  "currency": "eur",
  "interval": "year",
  "features": [
    "Unlimited flyer uploads",
    "Advanced analytics", 
    "Priority support"
  ]
}
```

#### Update Pricing Plan (Admin)
```http
PUT /api/pricing-plans/:planId
Authorization: Bearer <token>
Requires: ADMIN role
Content-Type: application/json

{
  "amount": 99.99,
  "isActive": false,
  "features": ["Updated feature list"]
}
```

#### Delete Pricing Plan (Admin)
```http
DELETE /api/pricing-plans/:planId
Authorization: Bearer <token>
Requires: ADMIN role
```

### 🔄 Subscriptions

#### Get User's Subscription
```http
GET /api/subscriptions/user/:userId
Authorization: Bearer <token>
```

#### Create Subscription (Retailer Only)
```http
POST /api/subscriptions
Authorization: Bearer <token>
Requires: RETAILER role
Content-Type: application/json

{
  "userId": "uuid",
  "pricingPlanId": "uuid"
}

Response:
{
  "message": "Subscription created successfully",
  "subscriptionId": "sub_xxxxxxxx",
  "hostedInvoiceUrl": "https://invoice.stripe.com/...",
  "paymentInstructions": "Complete payment to activate"
}
```

#### Update Subscription
```http
PUT /api/subscriptions/:subscriptionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CANCELED",
  "cancelAtPeriodEnd": true
}
```

#### Cancel Subscription
```http
DELETE /api/subscriptions/:subscriptionId
Authorization: Bearer <token>
```

#### Create Checkout Session
```http
POST /api/subscriptions/checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "pricingPlanId": "uuid"
}
```

#### Subscription Status Values
- `ACTIVE` - Subscription is active and paid
- `PAST_DUE` - Payment failed, retry in progress
- `CANCELED` - Subscription has been canceled
- `TRIALING` - In trial period
- `UNPAID` - Payment failed, access restricted
- `INCOMPLETE` - Initial payment incomplete
- `INCOMPLETE_EXPIRED` - Initial payment expired

---

## 📍 Location Services

### Get Nearby Stores
```http
GET /location/nearby-stores
Query Parameters:
?latitude=40.7128
&longitude=-74.0060
&radius=25
&limit=20
&categoryIds=uuid1,uuid2
```

### Get Nearby Deals
```http
GET /location/nearby-deals  
Query Parameters:
?latitude=40.7128
&longitude=-74.0060
&radius=25
&dealType=coupons
&limit=20
```

---

## 🔗 Webhooks

### Stripe Webhooks
```http
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: <stripe-signature-header>

Handles events:
- payment_intent.succeeded
- payment_intent.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
```

---

## 📊 Response Format

### ✅ Success Response
```json
{
  "message": "Operation completed successfully",
  "data": {
    // Main response data
  },
  "meta": {
    "timestamp": "2025-08-31T12:00:00Z",
    "version": "1.0"
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 195,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 20
  }
}
```

### ❌ Error Response
```json
{
  "message": "Validation failed",
  "error": "Required field 'email' is missing",
  "statusCode": 400,
  "timestamp": "2025-08-31T12:00:00Z",
  "path": "/api/users/register"
}
```

---

## ⚡ Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | ✅ OK | Request successful |
| `201` | ✅ Created | Resource created successfully |
| `400` | ❌ Bad Request | Invalid request data |
| `401` | 🔐 Unauthorized | Missing or invalid authentication |
| `403` | 🚫 Forbidden | Insufficient permissions |
| `404` | 🔍 Not Found | Resource not found |
| `409` | ⚠️ Conflict | Resource already exists |
| `422` | 📝 Unprocessable Entity | Validation errors |
| `500` | 💥 Internal Server Error | Server-side error |

---

## 📝 Notes & Best Practices

### 🔒 Security
- All prices are in the smallest currency unit (cents for EUR: €29.99 = 2999)
- JWT tokens expire after 24 hours
- Rate limiting: 100 requests per minute per IP
- CORS enabled for authorized domains only

### 📅 Data Formats  
- Timestamps: ISO 8601 format (UTC) - `2025-08-31T12:00:00Z`
- UUIDs: Version 4 format - `123e4567-e89b-12d3-a456-426614174000`
- Pagination: Starts at page 1, default limit 20

### 🎯 Query Parameters
- `search` - Text search across relevant fields
- `page` - Page number (default: 1)
- `limit` - Items per page (max: 100, default: 20)
- `categoryIds` - Comma-separated UUIDs
- `subcategoryIds` - Comma-separated UUIDs

### 🌍 Internationalization
- Default currency: EUR (€)
- Supported currencies: EUR, USD
- Default language: English
- Timezone: UTC

---

## 🛠️ Example Usage

### JavaScript/Fetch
```javascript
// Get filtered coupons with auth
const response = await fetch('/api/coupons?categoryIds=uuid1,uuid2&status=active&page=1&limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.data.coupons);

// Create a new coupon (Retailer)
const newCoupon = await fetch('/api/coupons', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${retailerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '20% Off Everything',
    storeId: 'store-uuid',
    discount: '20%',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    categoryIds: ['electronics-uuid']
  })
});
```

### cURL
```bash
# Get user profile with full details
curl -X GET "http://localhost:3000/user/user@example.com?includeDetails=true" \
  -H "Authorization: Bearer your-jwt-token"

# Create subscription (Retailer only)
curl -X POST "http://localhost:3000/api/subscriptions" \
  -H "Authorization: Bearer retailer-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "pricingPlanId": "premium-plan-uuid"
  }'
```

---

## 🚀 What's New in v2.0

- ✨ **Enhanced User Profiles** - Full user data with relationships
- 🏷️ **Subcategory Support** - Hierarchical category system
- ♻️ **Anti-Waste Management** - Reduce food waste with special deals
- 💳 **Subscription System** - Retailer subscription management
- 🔗 **Advanced Webhooks** - Real-time payment processing
- 📍 **Location Services** - Find nearby stores and deals
- 🛒 **Shopping Lists** - Personal shopping management
- 💝 **Wishlist System** - Save favorite items with price alerts

---

*Last updated: August 31, 2025 | API Version: 2.0*
