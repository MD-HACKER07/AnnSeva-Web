# AnnSeva — Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Firebase project (already configured in `src/lib/firebase.ts`)

## Firebase Setup

### 1. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **annseva-dbbbd**
3. Navigate to **Authentication → Sign-in method**
4. Enable **Email/Password**

### 2. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (or Start in test mode for development)
4. Select a region close to your users (e.g., `asia-south1` for India)

### 3. Firestore Security Rules

Paste these rules in **Firestore → Rules**:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: anyone authenticated can create, only they can read/modify
    match /users/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    // Food listings: restaurants create, all authenticated users read
    match /food_listings/{listingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.restaurantId == request.auth.uid;
    }

    // Pickups: authenticated users read/create/update
    match /pickups/{pickupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.volunteerId == request.auth.uid;
    }
  }
}
```

### 4. Create Firestore Indexes

Some queries require composite indexes. Firebase will provide direct links in the browser console when these are needed. Click the link to auto-create them.

Required indexes:
- **food_listings**: `restaurantId ASC, createdAt DESC`
- **food_listings**: `status ASC, createdAt DESC`
- **pickups**: `volunteerId ASC, acceptedAt DESC`
- **pickups**: `acceptedAt DESC`

## Running Locally

```bash
cd annseva-web
npm run dev
```

Visit: http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── signup/page.tsx             # Signup
│   └── dashboard/
│       ├── page.tsx                # Role-based redirect
│       ├── restaurant/page.tsx     # Restaurant dashboard
│       ├── volunteer/page.tsx      # Volunteer dashboard
│       └── admin/page.tsx          # Admin dashboard
├── components/
│   ├── Sidebar.tsx                 # Shared sidebar
│   ├── AddFoodModal.tsx            # Food listing form
│   └── MapView.tsx                 # Leaflet map
├── context/
│   └── AuthContext.tsx             # Firebase Auth context
└── lib/
    ├── firebase.ts                 # Firebase initialization
    └── firestore.ts                # CRUD helpers + types
```

## Test Accounts

Create accounts via the signup page:
- **Restaurant**: role = restaurant → gets restaurant dashboard
- **Volunteer**: role = volunteer → gets volunteer dashboard  
- **Admin**: role = admin → gets admin dashboard

## First Use Flow

1. **Restaurant** signs up → Adds food listing → Listing appears in Firestore
2. **Volunteer** signs up → Sees listing on map → Accepts pickup
3. **Volunteer** updates status: Accepted → Picked → Delivered
4. **Admin** sees all data in the admin dashboard
