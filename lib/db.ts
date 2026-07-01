import fs from 'fs';
import path from 'path';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Stored as number in cents (e.g., 35000)
  subtitle: string;
  description: string;
  image: string; // URL of main image
  alt: string; // Alt text of main image
  specs: ProductSpec[];
  media?: ProductMedia[]; // Additional gallery items
  sold?: boolean; // Mark if item is sold
}

export interface DatabaseSchema {
  about: {
    text: string;
  };
  products: Product[];
}

const DATA_DIR = path.join(process.cwd(), 'lib');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const initialDatabase: DatabaseSchema = {
  about: {
    text: "Timberluxe is a Sydney-based design studio crafting functional, ornamental timber and resin art. We source unique, high-character burl and salvaged slabs, honoring the timber's organic imperfections."
  },
  products: [
    {
      id: "burl-plum-board",
      name: "Burl & Plum Board",
      price: 35000,
      subtitle: "01 / Maple Burl & Magenta Resin",
      description: "A premium display piece combining the natural, rugged texture of maple burl with a vibrant magenta resin pour. Hand-finished to a soft satin sheen that highlights the intricate wood grain and depth of the resin.",
      image: "/plum_resin.jpg",
      alt: "Maple burl and magenta resin display piece",
      specs: [
        { label: "Timber", value: "Maple Burl" },
        { label: "Resin", value: "Magenta Epoxy" },
        { label: "Dimensions", value: "12\" x 8\" x 1.2\"" },
        { label: "Finish", value: "Satin Wood Wax" }
      ],
      media: []
    },
    {
      id: "charcoal-serving-board",
      name: "Charcoal Serving Board",
      price: 29900,
      subtitle: "02 / Smoked Oak & Charcoal Resin",
      description: "A sophisticated serving board crafted from deep, smoked oak and a dark charcoal resin. Perfect for charcuterie or as a striking centerpiece in modern kitchens.",
      image: "/smoke_resin.jpg",
      alt: "Burl wood and smoke grey epoxy serving board",
      specs: [
        { label: "Timber", value: "Smoked Oak" },
        { label: "Resin", value: "Charcoal Grey Epoxy" },
        { label: "Dimensions", value: "16\" x 6\" x 0.9\"" },
        { label: "Finish", value: "Food-Safe Mineral Oil" }
      ],
      media: []
    },
    {
      id: "teal-river-plank",
      name: "Teal River Plank",
      price: 48000,
      subtitle: "03 / English Burr & Teal Resin",
      description: "A dramatic river board featuring English burr timber separated by a deep, semi-translucent teal resin flow. Shows off stunning live edges and rich timber patterns.",
      image: "/teal_resin.jpg",
      alt: "English burr wood and teal resin river board",
      specs: [
        { label: "Timber", value: "English Burr Oak" },
        { label: "Resin", value: "Teal Translucent Epoxy" },
        { label: "Dimensions", value: "20\" x 9\" x 1.1\"" },
        { label: "Finish", value: "High-Gloss Polish" }
      ],
      media: []
    }
  ]
};

// Helper to ensure database and upload directories exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialDatabase, null, 2), 'utf-8');
  }
}

export async function getDatabase(): Promise<DatabaseSchema> {
  ensureDataFile();
  try {
    const dataStr = fs.readFileSync(DATA_FILE, 'utf-8');
    const db = JSON.parse(dataStr) as DatabaseSchema;

    // Self-healing migration: Convert dollar-based prices (< 5000) to cent-based integers (* 100)
    let migrated = false;
    if (db.products && Array.isArray(db.products)) {
      db.products = db.products.map(p => {
        if (typeof p.price === 'number' && p.price < 5000) {
          p.price = p.price * 100;
          migrated = true;
        }
        return p;
      });
    }

    if (migrated) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }

    return db;
  } catch (error) {
    console.error("Failed to read database file, returning initial state", error);
    return initialDatabase;
  }
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase();
  return db.products || [];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function saveProduct(product: Product): Promise<void> {
  const db = await getDatabase();
  const index = db.products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    db.products[index] = product;
  } else {
    db.products.push(product);
  }
  await saveDatabase(db);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index >= 0) {
    db.products.splice(index, 1);
    await saveDatabase(db);
    return true;
  }
  return false;
}

export async function getAboutText(): Promise<string> {
  const db = await getDatabase();
  return db.about?.text || initialDatabase.about.text;
}

export async function saveAboutText(text: string): Promise<void> {
  const db = await getDatabase();
  if (!db.about) {
    db.about = { text: '' };
  }
  db.about.text = text;
  await saveDatabase(db);
}
