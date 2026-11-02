import type { CartLine, TaxPolicy } from '../types';
export const taxPolicy: TaxPolicy = {mode:'unconfirmed',rate:0};
export const money = (n: number) => `RD$ ${n.toLocaleString('es-DO', {minimumFractionDigits:0,maximumFractionDigits:2})}`;
export function totals(lines: CartLine[], policy: TaxPolicy = taxPolicy) { const subtotal = Math.round(lines.reduce((s,l)=>s+l.unitPrice*l.quantity,0)*100)/100; const tax = policy.mode==='excluded' ? Math.round(subtotal*policy.rate*100)/100 : policy.mode==='included' ? Math.round((subtotal-subtotal/(1+policy.rate))*100)/100 : 0; return {subtotal,tax,total:Math.round((subtotal+(policy.mode==='excluded'?tax:0))*100)/100}; }
