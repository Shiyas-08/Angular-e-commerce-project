export interface Product {
 id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  rating?: number;
  quantity?:number;
  isFeatured?: boolean; 
  videoUrl?: string;  
}
 
