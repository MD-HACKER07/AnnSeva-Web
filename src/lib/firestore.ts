import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "restaurant" | "volunteer" | "admin";

export interface AppUser {
  uid: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  location?: { lat: number; lng: number };
  createdAt?: Timestamp;
}

export interface FoodListing {
  id?: string;
  restaurantId: string;
  restaurantName: string;
  foodName: string;
  quantity: string;
  description?: string;
  expiryTime: string;
  location: { lat: number; lng: number };
  address: string;
  status: "available" | "picked" | "completed";
  pickedBy?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
}

export interface Pickup {
  id?: string;
  foodId: string;
  foodName: string;
  restaurantName: string;
  address: string;
  volunteerId: string;
  volunteerName: string;
  status: "accepted" | "picked" | "delivered";
  acceptedAt?: Timestamp;
  pickedAt?: Timestamp;
  deliveredAt?: Timestamp;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUserDoc(uid: string, data: Omit<AppUser, "uid">) {
  await addDoc(collection(db, "users"), { uid, ...data, createdAt: serverTimestamp() });
}

export async function getUserDoc(uid: string): Promise<AppUser | null> {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as AppUser;
}

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as AppUser);
}

// ─── Food Listings ────────────────────────────────────────────────────────────

export async function addFoodListing(data: Omit<FoodListing, "id" | "createdAt">) {
  const ref = await addDoc(collection(db, "food_listings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getFoodListings(): Promise<FoodListing[]> {
  const snap = await getDocs(collection(db, "food_listings"));
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodListing));
  return results.sort((a, b) => {
    const ta = a.createdAt?.toMillis() ?? 0;
    const tb = b.createdAt?.toMillis() ?? 0;
    return tb - ta;
  });
}

export async function getAvailableListings(): Promise<FoodListing[]> {
  const snap = await getDocs(
    query(collection(db, "food_listings"), where("status", "==", "available"))
  );
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodListing));
  return results.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
}

export async function getRestaurantListings(restaurantId: string): Promise<FoodListing[]> {
  const snap = await getDocs(
    query(collection(db, "food_listings"), where("restaurantId", "==", restaurantId))
  );
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodListing));
  return results.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
}

export async function updateFoodStatus(
  id: string,
  status: FoodListing["status"],
  pickedBy?: string
) {
  const ref = doc(db, "food_listings", id);
  await updateDoc(ref, { status, ...(pickedBy ? { pickedBy } : {}) });
}

export async function deleteFoodListing(id: string) {
  await deleteDoc(doc(db, "food_listings", id));
}

// ─── Pickups ──────────────────────────────────────────────────────────────────

export async function createPickup(data: Omit<Pickup, "id" | "acceptedAt">) {
  const ref = await addDoc(collection(db, "pickups"), {
    ...data,
    acceptedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getVolunteerPickups(volunteerId: string): Promise<Pickup[]> {
  const snap = await getDocs(
    query(collection(db, "pickups"), where("volunteerId", "==", volunteerId))
  );
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Pickup));
  return results.sort((a, b) => (b.acceptedAt?.toMillis() ?? 0) - (a.acceptedAt?.toMillis() ?? 0));
}

export async function getAllPickups(): Promise<Pickup[]> {
  const snap = await getDocs(collection(db, "pickups"));
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Pickup));
  return results.sort((a, b) => (b.acceptedAt?.toMillis() ?? 0) - (a.acceptedAt?.toMillis() ?? 0));
}

export async function updatePickupStatus(id: string, status: Pickup["status"]) {
  const ref = doc(db, "pickups", id);
  const updates: DocumentData = { status };
  if (status === "picked") updates.pickedAt = serverTimestamp();
  if (status === "delivered") updates.deliveredAt = serverTimestamp();
  await updateDoc(ref, updates);
}

// ─── Real-time listeners ──────────────────────────────────────────────────────

export function listenAvailableListings(cb: (listings: FoodListing[]) => void) {
  // No orderBy — avoids composite index requirement. Sort client-side.
  const q = query(
    collection(db, "food_listings"),
    where("status", "==", "available")
  );
  return onSnapshot(q, (snap) => {
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodListing));
    cb(results.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)));
  });
}

export function listenRestaurantListings(
  restaurantId: string,
  cb: (listings: FoodListing[]) => void
) {
  // No orderBy — avoids composite index requirement. Sort client-side.
  const q = query(
    collection(db, "food_listings"),
    where("restaurantId", "==", restaurantId)
  );
  return onSnapshot(q, (snap) => {
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodListing));
    cb(results.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)));
  });
}
