export interface ProductTemplate {
  name: string;
  description: string;
  brandTone: string;
  category: string;
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    name: 'The Solace Mug',
    description: 'An elegant, powder-coated matte terracotta reusable espresso cup with a polished oak wood sleeve and double-wall vacuum insulation. Sits sturdy on a clean table.',
    brandTone: 'warm, minimalist, lifestyle-oriented, organic',
    category: 'Lifestyle & Homeware'
  },
  {
    name: 'AeroStride One',
    description: 'A futuristic athletic running shoe constructed from translucent slate-grey engineered knit. Features a sleek neon lime neon accent and a complex metallic silver honeycomb supportive sole structure.',
    brandTone: 'bold, high-tech, premium athletic, energetic',
    category: 'Footwear & Fashion'
  },
  {
    name: 'Nectar & Thyme Honey',
    description: 'A luxury thick hexagonal glass honey jar filled with raw amber-glowing wild thyme honey and a partial raw honeycomb inside. Sealed with textured ivory paper and a coarse beige twine collar.',
    brandTone: 'rustic luxury, hand-crafted, artisanal, premium wholesale',
    category: 'Gourmet Food'
  },
  {
    name: 'Komorebi Eau de Parfum',
    description: 'A heavy, minimal cylindrical glass perfume bottle filled with a golden champagne-hued liquid. It is crowned with a raw dark charred yakisugi wood cylindrical cap, sitting on white stone sand.',
    brandTone: 'editorial, mysterious luxury, calm, zen, avant-garde',
    category: 'Beauty & Fragrance'
  }
];
