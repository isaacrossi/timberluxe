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
  price: number | string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  specs: ProductSpec[];
  media?: ProductMedia[];
  sold?: boolean;
}

export const products: Product[] = [
  {
    id: "burl-plum-board",
    name: "Burl & Plum Board",
    price: "$ 350",
    subtitle: "01 / Maple Burl & Magenta Resin",
    description: "A premium display piece combining the natural, rugged texture of maple burl with a vibrant magenta resin pour. Hand-finished to a soft satin sheen that highlights the intricate wood grain and depth of the resin.",
    image: "/plum_resin.jpg",
    alt: "Maple burl and magenta resin display piece",
    specs: [
      { label: "Timber", value: "Maple Burl" },
      { label: "Resin", value: "Magenta Epoxy" },
      { label: "Dimensions", value: "12\" x 8\" x 1.2\"" },
      { label: "Finish", value: "Satin Wood Wax" }
    ]
  },
  {
    id: "charcoal-serving-board",
    name: "Charcoal Serving Board",
    price: "$ 299",
    subtitle: "02 / Smoked Oak & Charcoal Resin",
    description: "A sophisticated serving board crafted from deep, smoked oak and a dark charcoal resin. Perfect for charcuterie or as a striking centerpiece in modern kitchens.",
    image: "/smoke_resin.jpg",
    alt: "Burl wood and smoke grey epoxy serving board",
    specs: [
      { label: "Timber", value: "Smoked Oak" },
      { label: "Resin", value: "Charcoal Grey Epoxy" },
      { label: "Dimensions", value: "16\" x 6\" x 0.9\"" },
      { label: "Finish", value: "Food-Safe Mineral Oil" }
    ]
  },
  {
    id: "teal-river-plank",
    name: "Teal River Plank",
    price: "$ 480",
    subtitle: "03 / English Burr & Teal Resin",
    description: "A dramatic river board featuring English burr timber separated by a deep, semi-translucent teal resin flow. Shows off stunning live edges and rich timber patterns.",
    image: "/teal_resin.jpg",
    alt: "English burr wood and teal resin river board",
    specs: [
      { label: "Timber", value: "English Burr Oak" },
      { label: "Resin", value: "Teal Translucent Epoxy" },
      { label: "Dimensions", value: "20\" x 9\" x 1.1\"" },
      { label: "Finish", value: "High-Gloss Polish" }
    ]
  }
];
