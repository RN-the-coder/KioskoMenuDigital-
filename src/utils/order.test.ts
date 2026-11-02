import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totals } from './order';
import type { CartLine } from '../types';
const lines:CartLine[]=[{id:'1',productId:'club',name:'Club',image:'',unitPrice:275,quantity:2,note:''},{id:'2',productId:'jamon',name:'Jamón',image:'',unitPrice:125,quantity:1,note:''}];
test('suma cantidades y no añade impuestos sin confirmar',()=>assert.deepEqual(totals(lines),{subtotal:675,tax:0,total:675}));
test('impuesto excluido se agrega una sola vez',()=>assert.deepEqual(totals(lines,{mode:'excluded',rate:.18}),{subtotal:675,tax:121.5,total:796.5}));
test('impuesto incluido conserva el total del menú',()=>assert.deepEqual(totals(lines,{mode:'included',rate:.18}),{subtotal:675,tax:102.97,total:675}));
test('carrito vacío suma cero',()=>assert.deepEqual(totals([]),{subtotal:0,tax:0,total:0}));
