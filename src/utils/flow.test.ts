import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorizeDemo } from '../services/payment';
import { products } from '../data/menu';
import { totals } from './order';

test('carrito: agregar, combinar, modificar, persistir, eliminar y limpiar',async()=>{
 const memory=new Map<string,string>();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>memory.set(k,v),removeItem:(k:string)=>memory.delete(k)}});
 Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:globalThis.localStorage}});
 const {useCart}=await import('../store/cart');
 useCart.getState().clear();
 const p=products[0];
 const line={productId:p.id,name:p.name,image:p.image,unitPrice:p.price,quantity:2,note:''};
 useCart.getState().add(line);useCart.getState().add({...line,quantity:1});
 assert.equal(useCart.getState().lines.length,1);
 assert.equal(totals(useCart.getState().lines).total,900);
 useCart.getState().add({...line,quantity:1,note:'Solicitud por confirmar'});
 assert.equal(useCart.getState().lines.length,2);
 const id=useCart.getState().lines[0].id;
 useCart.getState().quantity(id,1);
 assert.equal(totals(useCart.getState().lines).total,600);
 await useCart.persist.rehydrate();
 assert.equal(useCart.getState().lines.length,2);
 useCart.getState().remove(id);
 assert.equal(totals(useCart.getState().lines).total,300);
 useCart.getState().clear();
 assert.equal(useCart.getState().lines.length,0);
 assert.deepEqual(JSON.parse(memory.get('payan-cart-v2')!).state.lines,[]);
});
test('autorización de demostración permite aprobar y rechazar',async()=>{
 assert.equal(await authorizeDemo('failure'),false);
 assert.equal(await authorizeDemo('success'),true);
});


test('jugos: preparaciones verificadas y precio de la variante en totales',()=>{
 const juice=products.find(p=>p.id==='jugo-china')!;
 assert.deepEqual(juice.sizes?.map(s=>[s.name,s.price]),[['Natural',100],['Con leche',110]]);
 const size=juice.sizes![1];
 assert.equal(totals([{id:'juice',productId:juice.id,name:juice.name,image:juice.image,unitPrice:size.price,quantity:2,note:'',size:size.name}]).total,220);
 assert.ok(products.every(p=>p.price>0&&p.available));
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);
 assert.ok(products.every(p=>!p.sizes?.some(s=>s.id==='c')));
});
