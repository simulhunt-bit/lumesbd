import { categories, products } from "@/content/catalog";

export const getCategories = () => categories;

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) =>
  getCategoryBySlug(categorySlug)?.subcategories.find((subcategory) => subcategory.slug === subcategorySlug);

export const getProducts = () => products;

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getProductsByCategory = (categorySlug: string) =>
  products.filter((product) => product.categorySlug === categorySlug);

export const getProductsBySubcategory = (subcategorySlug: string) =>
  products.filter((product) => product.subcategorySlug === subcategorySlug);

export const getFeaturedProducts = () => products.filter((product) => product.featured);

export const getNewProducts = () => products.filter((product) => product.isNew);

export const getPremiumProducts = () => products.filter((product) => product.isPremium);

export const getRecommendedProducts = (slug: string) => {
  const product = getProductBySlug(slug);
  if (!product) return [];

  return products
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== slug)
    .slice(0, 4);
};
