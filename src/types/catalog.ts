export type ProductSize = "S" | "M" | "L" | "XL" | "XXL" | "3.5 x 3";

export type ProductColor = {
  name: string;
  hex: string;
};

export type StorySlide = {
  title: string;
  text: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  categorySlug: string;
  subcategorySlug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  badge?: string;
  gender: "Men" | "Women" | "Unisex";
  featured?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  description: string;
  highlights: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  images: string[];
  story: StorySlide[];
};

export type Subcategory = {
  slug: string;
  name: string;
  description: string;
  coverImage: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  subcategories: Subcategory[];
};

export type EventSection = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  accent: "ember" | "ocean";
};

export type NavItem = {
  label: string;
  href: string;
};

export type Address = {
  id: string;
  fullName: string;
  fullAddress: string;
  district: string;
  thana: string;
  phoneNumber: string;
  gmail: string;
  isDefault: boolean;
};

export type UserProfile = {
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoDataUrl?: string;
  addresses: Address[];
};
