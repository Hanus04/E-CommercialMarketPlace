export interface Customer {
  customerId: number;
  userName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  fullName: string;
}

export interface Category {
  categoryId: number;
  name: string;
}
export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  rating: number;
  shipping: string[];
  freeReturn: boolean;
  buyerProtection: boolean;
  bestDeal: boolean;
  shipToStore: boolean;
}



export interface Review {
  reviewId: number;
  rating: number;
  CustomercustomerId: number;
  ProductproductId: number;
  comment: string;
}


export interface CartItem{
  cartItemId:number,
  quantity:number,
  subtotal:number,
  OrderId:number,
  productId:number,
   CustomerId:number
}
