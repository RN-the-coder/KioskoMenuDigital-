export type Category = 'sandwiches' | 'jugos' | 'bebidas';
export interface Product { id: string; name: string; category: Category; price: number; image: string; available: boolean; sizes?: {id: string; name: string; price: number}[]; options: {id: string; name: string; price: number}[] }
export interface CartLine { id: string; productId: string; name: string; image: string; unitPrice: number; quantity: number; note: string; size?: string }
export interface Order { id: string; lines: CartLine[]; total: number; payment: 'demo-paid' | 'pending'; createdAt: string }
export type TaxPolicy = { mode: 'unconfirmed' | 'included' | 'excluded'; rate: number };
