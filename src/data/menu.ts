import type { Product } from '../types';
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
export const sandwichImage = photo('photo-1528735602780-2552fd46c7af');
const juiceImage = photo('photo-1613478223719-2ab802602423');
const sandwichRows: [string, string, number][] = [
 ['payan-club','Payán Club',300],['club','Club Sándwich',275],['especial','Payán Especial',170],
 ['pierna','Pierna',155],['cheddar','Pierna Cheddar',165],['pierna-danes','Pierna Danés',170],['paris','Pierna París',170],['pierna-mozzarella','Pierna Mozzarella',175],['gouda','Pierna Gouda',180],
 ['pollo','Pollo',160],['pollo-danes','Pollo Danés',170],['pollo-cheddar','Pollo Cheddar',170],['pollo-gouda','Pollo Gouda',185],['pollo-mozzarella','Pollo Mozzarella',170],
 ['jamon','Jamón',110],['jamon-danes','Jamón Danés',155],['jamon-queso','Jamón y Queso',125],['jamon-gouda','Jamón y Gouda',160],['jamon-mozzarella','Jamón y Mozzarella',160],['jamon-pierna','Jamón y Pierna',155],['jamon-huevo','Jamón y Huevo',115],['jamoncito','Jamoncito el Caminador',125],
 ['completo','Completo',150],['completo-danes','Completo Danés',160],['completo-gouda','Completo Gouda',165],['completo-mozzarella','Completo Mozzarella',165],['tuna','Tuna',160],
 ['queso','Queso',120],['danes','Danés',140],['mozzarella','Mozzarella',150],['queso-gouda','Gouda',155],['dos-quesos','2 Quesos',150],['tres-quesos','3 Quesos',170],['cuatro-quesos','4 Quesos',185],
 ['salami','Salami',115],['salami-queso','Salami y Queso',130],['salami-danes','Salami y Danés',155],['salami-gouda','Salami y Gouda',160],['salami-mozzarella','Salami y Mozzarella',155],['salami-huevo','Salami y Huevo',125],
 ['pavo','Jamón de Pavo',165],['pavo-danes','Pavo Danés',175],['pavo-cheddar','Pavo Cheddar',170],['pavo-gouda','Pavo Gouda',180],['pavo-mozzarella','Pavo Mozzarella',180],['pavo-pierna','Pavo y Pierna',170],
 ['hamburger','Hamburger',100],['huevo-burger','Huevo Burger',90],['cheeseburger','Cheeseburger',130],['hot-dog','Hot Dog',50],['tostadas','Tostadas',25],['tostadas-ajo','Tostadas con Ajo',35],['papas','Papas',60],['mangu','Mangú Payán',160],
];
// Las columnas visibles son preparaciones, no tamaños. Se conservan como variantes.
const juiceRows: [string,string,number|null,number|null][] = [
 ['lechosa','Lechoza',60,70],['china','China',100,110],['toronja','Toronja',100,110],['pina','Piña',70,75],['zapote','Zapote',60,80],['granadillo','Granadillo',80,100],['chinola','Chinola',80,100],['melon','Melón',70,75],['cereza','Cereza',75,90],['guayaba','Guayaba',60,80],['limon','Limón',75,85],
 ['guineo','Guineo',55,70],['fresa','Fresa',100,110],['ciruela','Ciruela',100,110],['mango','Mango',75,80],['lulo','Lulo',75,85],['tamarindo','Tamarindo',50,70],['guanabana','Guanábana',100,110],['nispero','Níspero',70,80],['fruit-punch','Fruit Punch',100,105],['leche-batida','Leche Batida',null,60],
];
export const products: Product[] = [
 ...sandwichRows.map(([id,name,price],i)=>({id,name,price,category:'sandwiches' as const,image:i%3===0?sandwichImage:photo(i%3===1?'photo-1528736235302-52922df5c122':'photo-1553909489-cd47e0ef937f'),available:true,options:[]})),
 ...juiceRows.map(([id,name,natural,milk])=>{const sizes=[...(natural===null?[]:[{id:'natural',name:'Natural',price:natural}]),...(milk===null?[]:[{id:'leche',name:'Con leche',price:milk}])];return {id:`jugo-${id}`,name,price:sizes[0].price,category:'jugos' as const,image:juiceImage,available:true,options:[],sizes};}),
 {id:'cappuccino-vainilla',name:'Cappuccino Vainilla',price:50,category:'bebidas',image:photo('photo-1511081692775-05d0f180a065'),available:true,options:[]},
];
export const categories = [{id:'sandwiches',name:'Sándwiches',subtitle:'Un clásico que nunca falla'}, {id:'jugos',name:'Jugos naturales',subtitle:'Elige tu preparación'}, {id:'bebidas',name:'Otras bebidas',subtitle:'Para acompañar'}] as const;
export const pendingVerification = [
 'La foto corta la sección Otras bebidas: solo Cappuccino Vainilla RD$50 se lee completo.',
 'El significado de la tercera columna de jugos (símbolo C rojo) no se distingue; no se habilita para compra.',
 'Tamaños y volúmenes no aparecen legibles en la foto. Natural y con leche son preparaciones, no tamaños.',
 'Ingredientes, extras y personalizaciones disponibles.',
 'Disponibilidad real, vigencia de precios y política fiscal del restaurante.',
 'Fotografías oficiales y uso de identidad de marca.',
];
