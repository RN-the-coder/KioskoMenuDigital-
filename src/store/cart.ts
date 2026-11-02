import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '../types';
interface CartState { lines: CartLine[]; add:(line: Omit<CartLine,'id'>)=>void; quantity:(id:string,q:number)=>void; remove:(id:string)=>void; clear:()=>void }
export const useCart = create<CartState>()(persist((set)=>({lines:[],add:(line)=>set(s=>{ const found=s.lines.find(l=>l.productId===line.productId&&l.note===line.note&&l.size===line.size); return {lines:found?s.lines.map(l=>l.id===found.id?{...l,quantity:Math.min(99,l.quantity+line.quantity)}:l):[...s.lines,{...line,id:crypto.randomUUID()}]}; }),quantity:(id,q)=>set(s=>({lines:s.lines.map(l=>l.id===id?{...l,quantity:Math.max(1,Math.min(99,q))}:l)})),remove:id=>set(s=>({lines:s.lines.filter(l=>l.id!==id)})),clear:()=>set({lines:[]})}),{name:'payan-cart-v2',version:1,partialize:s=>({lines:s.lines})}));
