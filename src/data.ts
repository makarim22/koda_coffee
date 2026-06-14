import { db } from './firebase';
import { collection, doc, getDocs, setDoc, writeBatch, query, where, increment, getDoc, deleteDoc } from 'firebase/firestore';

export interface MenuItem {
  id: string;
  title: string;
  origin: string;
  process: string;
  price: string;
  desc: string;
  img: string;
  delay: string;
  category: 'espresso' | 'pourOver' | 'coldBrew' | 'pastries';
  flavorProfile?: { metric: string, value: number }[];
}

export type OrderStatus = 'PENDING' | 'ROASTING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type OrderPriority = 'NORMAL' | 'URGENT';

export interface Order {
  id: string;
  customerName: string;
  itemsSummary: string;
  totalPrice: string;
  status: OrderStatus;
  priority: OrderPriority;
  userId?: string;
  createdAt?: number;
  items?: import('./types').CartItem[];
  giftMessage?: string;
  deliveryAddress?: string;
}

const defaultMenuData: MenuItem[] = [
  { id: 'e1', title: 'Signature Blend', origin: 'Colombia & Ethiopia', process: 'Washed', price: 'Rp 35.000', desc: 'Our flagship daily rider. Notes of dark chocolate, toasted hazelnut, and dark cherry with a creamy mouthfeel.', img: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'espresso', flavorProfile: [{ metric: 'Acidity', value: 3 }, { metric: 'Body', value: 4 }, { metric: 'Sweetness', value: 4 }, { metric: 'Aroma', value: 3 }, { metric: 'Bitterness', value: 2 }] },
  { id: 'e2', title: 'Finca El Paraiso', origin: 'Colombia', process: 'Thermal Shock', price: 'Rp 45.000', desc: 'An experimental masterpiece. Passionfruit, lychee, and a bright, syrupy and highly acidic mouthfeel.', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', delay: 'delay-200', category: 'espresso', flavorProfile: [{ metric: 'Acidity', value: 5 }, { metric: 'Body', value: 3 }, { metric: 'Sweetness', value: 5 }, { metric: 'Aroma', value: 5 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'e3', title: 'Ethiopia Guji Natural', origin: 'Ethiopia', process: 'Natural', price: 'Rp 40.000', desc: 'Wild and fruit-forward. Explodes with strawberry jam, ripe peach, and fragrant floral aromatics.', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800', delay: 'delay-300', category: 'espresso', flavorProfile: [{ metric: 'Acidity', value: 4 }, { metric: 'Body', value: 3 }, { metric: 'Sweetness', value: 4 }, { metric: 'Aroma', value: 5 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'e4', title: 'Colombia Decaf', origin: 'Colombia', process: 'Sugarcane Decaf', price: 'Rp 38.000', desc: 'Decaffeinated naturally using sugarcane process. Notes of brown sugar, red apple, and graham cracker.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'espresso', flavorProfile: [{ metric: 'Acidity', value: 2 }, { metric: 'Body', value: 3 }, { metric: 'Sweetness', value: 4 }, { metric: 'Aroma', value: 3 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'p1', title: 'Yirgacheffe Washed', origin: 'Ethiopia', process: 'Washed', price: 'Rp 48.000', desc: 'Exceptionally clean and tea-like. Jasmine, bergamot, and a clean, lingering lemon-zest finish.', img: 'https://images.unsplash.com/photo-1544244015-0df4b3dfc584?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'pourOver', flavorProfile: [{ metric: 'Acidity', value: 4 }, { metric: 'Body', value: 2 }, { metric: 'Sweetness', value: 4 }, { metric: 'Aroma', value: 5 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'p2', title: 'Kenya AA', origin: 'Kenya', process: 'Washed', price: 'Rp 50.000', desc: 'Bold and savory-sweet. Blackcurrant, tomato vine, vibrant citrus acidity, and a juicy body.', img: 'https://images.unsplash.com/photo-1495474472205-1a3b194fb8db?auto=format&fit=crop&q=80&w=800', delay: 'delay-200', category: 'pourOver', flavorProfile: [{ metric: 'Acidity', value: 5 }, { metric: 'Body', value: 4 }, { metric: 'Sweetness', value: 3 }, { metric: 'Aroma', value: 4 }, { metric: 'Bitterness', value: 2 }] },
  { id: 'p3', title: 'Panama Geisha', origin: 'Panama', process: 'Washed', price: 'Rp 75.000', desc: 'The crown jewel of coffee. Delicate bergamot, jasmine, and complex tropical fruits. Farm-direct reserve.', img: 'https://images.unsplash.com/photo-1587049352847-81a56d773cac?auto=format&fit=crop&q=80&w=800', delay: 'delay-300', category: 'pourOver', flavorProfile: [{ metric: 'Acidity', value: 4 }, { metric: 'Body', value: 2 }, { metric: 'Sweetness', value: 5 }, { metric: 'Aroma', value: 5 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'p4', title: 'Costa Rica Tarrazu', origin: 'Costa Rica', process: 'Honey', price: 'Rp 45.000', desc: 'Sweet and full-bodied. Honey processed for intense caramel sweetness, green apple, and smooth vanilla.', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'pourOver', flavorProfile: [{ metric: 'Acidity', value: 3 }, { metric: 'Body', value: 4 }, { metric: 'Sweetness', value: 5 }, { metric: 'Aroma', value: 4 }, { metric: 'Bitterness', value: 1 }] },
  { id: 'c1', title: 'Kyoto Style Drip', origin: 'House Blend', process: 'Slow Drip', price: 'Rp 50.000', desc: 'Tower dripped over 12 hours. Smooth, complex profile with cocoa nibs and sweet cream notes.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'coldBrew', flavorProfile: [{ metric: 'Acidity', value: 2 }, { metric: 'Body', value: 3 }, { metric: 'Sweetness', value: 4 }, { metric: 'Aroma', value: 4 }, { metric: 'Bitterness', value: 2 }] },
  { id: 'c2', title: 'Nitro Cold Brew', origin: 'Colombia', process: 'Immersion', price: 'Rp 45.000', desc: 'Infused with nitrogen for a rich, velvety non-dairy texture that mimics a perfect stout.', img: 'https://images.unsplash.com/photo-1517701550927-30cfcb64ac45?auto=format&fit=crop&q=80&w=800', delay: 'delay-200', category: 'coldBrew', flavorProfile: [{ metric: 'Acidity', value: 2 }, { metric: 'Body', value: 5 }, { metric: 'Sweetness', value: 3 }, { metric: 'Aroma', value: 3 }, { metric: 'Bitterness', value: 2 }] },
  { id: 'c3', title: 'Classic Cold Brew', origin: 'Brazil', process: '18h Immersion', price: 'Rp 38.000', desc: 'Steeped for 18 hours. Bold, intensely chocolatey, and features extremely low acidity.', img: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800', delay: 'delay-300', category: 'coldBrew', flavorProfile: [{ metric: 'Acidity', value: 1 }, { metric: 'Body', value: 4 }, { metric: 'Sweetness', value: 3 }, { metric: 'Aroma', value: 4 }, { metric: 'Bitterness', value: 3 }] },
  { id: 'pa1', title: 'Almond Croissant', origin: 'House Baked', process: 'Viennoiserie', price: 'Rp 38.000', desc: 'Twice baked, filled with house frangipane, hand-laminated pastry layers, and topped with toasted almonds.', img: 'https://images.unsplash.com/photo-1549725838-89c0bf2693fb?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'pastries' },
  { id: 'pa2', title: 'Pain au Chocolat', origin: 'House Baked', process: 'Viennoiserie', price: 'Rp 35.000', desc: 'Flaky layers of buttery dough wrapped around dual dark chocolate batons sourced from Valrhona.', img: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&q=80&w=800', delay: 'delay-200', category: 'pastries' },
  { id: 'pa3', title: 'Cardamom Bun', origin: 'House Baked', process: 'Swedish Style', price: 'Rp 30.000', desc: 'Traditional Swedish style knot baked with freshly ground premium cardamom and coarse sugar.', img: 'https://images.unsplash.com/photo-1550411294-06baabc1eb14?auto=format&fit=crop&q=80&w=800', delay: 'delay-300', category: 'pastries' },
  { id: 'pa4', title: 'Seasonal Scone', origin: 'House Baked', process: 'Rotational', price: 'Rp 28.000', desc: 'Flavor rotates weekly based on available harvests. Served warm with a side of clotted cream.', img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=800', delay: 'delay-100', category: 'pastries' },
];

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const snap = await getDocs(collection(db, 'menuItems'));
    if (snap.empty) {
      await seedMenuItems(defaultMenuData);
      return defaultMenuData;
    }
    const items: MenuItem[] = [];
    snap.forEach(doc => {
      const data = doc.data() as MenuItem;
      // Merge with default data to retroactively add flavorProfile if missing in DB
      const defaultData = defaultMenuData.find(d => d.id === data.id);
      if (defaultData && !data.flavorProfile) {
        data.flavorProfile = defaultData.flavorProfile;
      }
      items.push(data);
    });
    return items;
  } catch (err) {
    console.error('Error fetching menuItems', err);
    return [];
  }
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const item of items) {
      const docRef = doc(db, 'menuItems', item.id);
      batch.set(docRef, {
        title: item.title,
        origin: item.origin,
        process: item.process,
        price: item.price,
        desc: item.desc,
        img: item.img,
        delay: item.delay,
        category: item.category
      });
    }
    await batch.commit();
  } catch (err) {
    console.error('Error saving menuItems', err);
  }
}

async function seedMenuItems(items: MenuItem[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const item of items) {
      const docRef = doc(db, 'menuItems', item.id);
      batch.set(docRef, { ...item });
    }
    await batch.commit();
  } catch (err) {
    console.error('Failed to seed menuItems', err);
  }
}

const defaultOrderData: Order[] = [
  { id: 'KD-8901', customerName: 'Julianne Moore', itemsSummary: 'Dark Roast Blend', totalPrice: 'Rp 350.000', status: 'ROASTING', priority: 'NORMAL' },
  { id: 'KD-8902', customerName: 'Marcus Aurelius', itemsSummary: 'Kenya AA Espresso', totalPrice: 'Rp 250.000', status: 'PENDING', priority: 'NORMAL' },
  { id: 'KD-8903', customerName: 'Sienna Miller', itemsSummary: 'Colombian Decaf', totalPrice: 'Rp 280.000', status: 'DELIVERED', priority: 'NORMAL' },
  { id: 'KD-8904', customerName: 'Oscar Isaac', itemsSummary: 'Summer Bloom Set', totalPrice: 'Rp 550.000', status: 'ROASTING', priority: 'URGENT' },
  { id: 'KD-8905', customerName: 'Lydia Tar', itemsSummary: 'Panama Geisha (Special Release)', totalPrice: 'Rp 850.000', status: 'READY', priority: 'URGENT' },
  { id: 'KD-8906', customerName: 'David Bowman', itemsSummary: 'Space Blend Coffee Pods x 100', totalPrice: 'Rp 650.000', status: 'READY', priority: 'NORMAL' },
  { id: 'KD-8907', customerName: 'Eleanor Fant', itemsSummary: 'Ethiopian Yirgacheffe (250g), Chemex Filters', totalPrice: 'Rp 350.000', status: 'PENDING', priority: 'NORMAL' },
  { id: 'KD-8908', customerName: 'James Holden', itemsSummary: 'Guatemalan Antigua (500g)', totalPrice: 'Rp 280.000', status: 'ROASTING', priority: 'NORMAL' },
  { id: 'KD-8909', customerName: 'Amos Burton', itemsSummary: 'Costa Rica Tarrazu (250g) x 4', totalPrice: 'Rp 550.000', status: 'READY', priority: 'NORMAL' },
];

export async function getOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (snap.empty) {
      await seedOrders(defaultOrderData);
      return defaultOrderData;
    }
    const orders: Order[] = [];
    snap.forEach(doc => {
      orders.push(doc.data() as Order);
    });
    return orders;
  } catch (err) {
    console.error('Error fetching orders', err);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, { status }, { merge: true });
  } catch (err) {
    console.error('Error updating order status', err);
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach(doc => {
      orders.push(doc.data() as Order);
    });
    return orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.error('Error fetching user orders', err);
    return [];
  }
}

export async function createOrder(order: Order): Promise<void> {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
  } catch (err) {
    console.error('Error creating order', err);
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const order of orders) {
      const docRef = doc(db, 'orders', order.id);
      batch.set(docRef, { ...order });
    }
    await batch.commit();
  } catch (err) {
    console.error('Error saving orders', err);
  }
}

export async function getUserPoints(userId: string): Promise<number> {
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().points || 0;
    }
    return 0;
  } catch (err) {
    console.error('Error fetching user points', err);
    return 0;
  }
}

export async function addPointsToUser(userId: string, points: number): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { points: increment(points) }, { merge: true });
  } catch (err) {
    console.error('Error adding points', err);
  }
}

export async function deductPointsFromUser(userId: string, points: number): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { points: increment(-points) }, { merge: true });
  } catch (err) {
    console.error('Error deducting points', err);
  }
}

export interface UserAddress {
  id: string;
  name: string; // e.g. Home, Office
  street: string;
  city: string;
  isDefault: boolean;
}

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'addresses'));
    const addresses: UserAddress[] = [];
    snap.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() } as UserAddress);
    });
    return addresses;
  } catch (err) {
    console.error('Error fetching user addresses', err);
    return [];
  }
}

export async function saveUserAddress(userId: string, address: UserAddress): Promise<void> {
  try {
    if (address.isDefault) {
      // If setting as default, unset other defaults first
      const snap = await getDocs(collection(db, 'users', userId, 'addresses'));
      const batch = writeBatch(db);
      snap.forEach(docSnap => {
        if (docSnap.data().isDefault) {
          batch.update(docSnap.ref, { isDefault: false });
        }
      });
      await batch.commit();
    }
    const docRef = doc(db, 'users', userId, 'addresses', address.id);
    await setDoc(docRef, address);
  } catch (err) {
    console.error('Error saving user address', err);
    throw err;
  }
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting user address', err);
    throw err;
  }
}

export async function subscribeNewsletter(email: string): Promise<void> {
  try {
    const docRef = doc(collection(db, 'newsletter'));
    await setDoc(docRef, { email, createdAt: Date.now() });
  } catch (err) {
    console.error('Error subscribing to newsletter', err);
    throw err;
  }
}

export async function getUserWishlist(userId: string): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'wishlist'));
    const itemIds: string[] = [];
    snap.forEach(doc => {
      itemIds.push(doc.id);
    });
    return itemIds;
  } catch (err) {
    console.error('Error fetching user wishlist', err);
    return [];
  }
}

export async function toggleWishlistItem(userId: string, itemId: string, isSaved: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'wishlist', itemId);
    if (isSaved) {
      // Add
      await setDoc(docRef, { itemId, addedAt: Date.now() });
    } else {
      // Remove
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.error('Error toggling wishlist item', err);
    throw err;
  }
}

async function seedOrders(orders: Order[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const order of orders) {
      const docRef = doc(db, 'orders', order.id);
      batch.set(docRef, { ...order });
    }
    await batch.commit();
  } catch (err) {
    console.error('Failed to seed orders', err);
  }
}

