import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Sandwich,
  CupSoda,
  GlassWater,
  ShoppingBag,
  Trash2,
  X,
  Plus,
  ShieldCheck,
  Utensils,
  RotateCcw,
} from 'lucide-react';
import { products, categories, sandwichImage } from './data/menu';
import type { Category, Product, Order } from './types';
import { useCart } from './store/cart';
import { money, totals } from './utils/order';
import { authorizeDemo } from './services/payment';
import { QuantitySelector } from './components/QuantitySelector';
import { FoodImage } from './components/FoodImage';

type Screen = 'welcome' | 'menu' | 'cart' | 'payment' | 'confirmation';

const exclusions = [
  'Sin lechuga',
  'Sin tomate',
  'Sin pollo',
  'Sin pierna',
  'Sin queso',
  'Sin pepinillo',
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [category, setCategory] = useState<Category>('sandwiches');
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [note, setNote] = useState('');
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
  const [cancel, setCancel] = useState(false);
  const [toast, setToast] = useState('');
  const [method, setMethod] = useState<'card' | 'cash' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const lock = useRef(false);
  const { lines, add, quantity, remove, clear } = useCart();
  const total = totals(lines);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  const open = (product: Product) => {
    setProduct(product);
    setQty(1);
    setNote('');
    setSelectedExclusions([]);
    setSize(product.sizes?.[0]?.id ?? '');
  };

  const toggleExclusion = (exclusion: string) => {
    setSelectedExclusions((current) =>
      current.includes(exclusion)
        ? current.filter((item) => item !== exclusion)
        : [...current, exclusion],
    );
  };

  const addProduct = () => {
    if (!product) return;

    const selected = product.sizes?.find((item) => item.id === size);

    const noteParts = [
      ...selectedExclusions,
      note.trim(),
    ].filter(Boolean);

    const finalNote = noteParts.join('. ');

    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: selected?.price ?? product.price,
      quantity: qty,
      note: finalNote,
      size: selected?.name,
    });

    setProduct(null);
    setToast(`${product.name} agregado`);
    setTimeout(() => setToast(''), 2500);
  };

  const finish = async (outcome: 'success' | 'failure' = 'success') => {
    if (lock.current || !lines.length || !method) return;

    lock.current = true;
    setBusy(true);
    setError('');

    try {
      if (method === 'card' && !(await authorizeDemo(outcome))) {
        setError(
          'La autorización de demostración fue rechazada. Intenta de nuevo o elige pagar en caja.',
        );
        return;
      }

      setOrder({
        id: `BP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        lines: structuredClone(lines),
        total: total.total,
        payment: method === 'cash' ? 'pending' : 'demo-paid',
        createdAt: new Date().toISOString(),
      });

      clear();
      setScreen('confirmation');
    } finally {
      setBusy(false);
      lock.current = false;
    }
  };

  const reset = () => {
    clear();
    setOrder(null);
    setMethod(null);
    setError('');
    setScreen('welcome');
    setCancel(false);
  };

  const icons = {
    sandwiches: Sandwich,
    jugos: GlassWater,
    bebidas: CupSoda,
  };

  return (
    <div className="app">
      <header>
        <button
        className="brand"
        onClick={() => {
            if (screen === 'confirmation') return;
            if (lines.length) setCancel(true);
            else setScreen('welcome');
        }}
        aria-label="Barra Payán, inicio"
        >
        <img
            src="/payan-logo.jpg"
            alt="Barra Payán"
            className="brand-logo"
        />
        </button>

        <div className="header-right">
          <span className="service">
            <span /> Kiosco de autoservicio
          </span>
          <span className="demo">DEMO</span>
        </div>
      </header>

      {screen === 'welcome' ? (
        <main className="welcome">
          <div className="welcome-copy">
            <span className="eyebrow">SABOR DOMINICANO. A TU MANERA.</span>

            <h1>
              El antojo es tuyo.
              <br />
              <em>El sabor, de Payán.</em>
            </h1>

            <p>¡Bienvenido a Barra Payán!</p>
            <p className="muted">Haz tu pedido de forma rápida y sencilla.</p>

            <button className="primary start" onClick={() => setScreen('menu')}>
              {count ? 'Continuar pedido' : 'Comenzar pedido'}
              <ArrowRight />
            </button>

            <div className="welcome-features">
              <span>
                <Utensils size={19} /> Elige tus favoritos
              </span>
              <span>
                <CreditCard size={19} /> Tarjeta o caja
              </span>
            </div>
          </div>

          <div className="welcome-photo">
            <FoodImage src={sandwichImage} alt="Sándwich ilustrativo" />

            <div className="photo-label">
              Un clásico.
              <br />
              <strong>Mil antojos.</strong>
              <span>Fotografía ilustrativa</span>
            </div>

            <span className="round-stamp">
              MUCHO
              <br />
              SABOR
              <br />♥
            </span>
          </div>
        </main>
      ) : (
        <>
          <nav className="progress" aria-label="Progreso del pedido">
            {['Elige tus favoritos', 'Revisa tu pedido', 'Pago y confirmación'].map(
              (step, index) => {
                const currentStep =
                  screen === 'menu' ? 0 : screen === 'cart' ? 1 : 2;

                return (
                  <span
                    className={currentStep >= index ? 'active' : ''}
                    key={step}
                  >
                    <b>
                      {currentStep > index ? <Check size={14} /> : index + 1}
                    </b>
                    {step}
                    {index < 2 && <ChevronRight size={16} />}
                  </span>
                );
              },
            )}
          </nav>

          {screen === 'menu' && (
            <main className="catalog">
              <aside className="categories">
                <span className="eyebrow">NUESTRO MENÚ</span>

                {categories.map((item) => {
                  const Icon = icons[item.id];

                  return (
                    <button
                      key={item.id}
                      className={category === item.id ? 'selected' : ''}
                      onClick={() => setCategory(item.id)}
                    >
                      <Icon size={29} />
                      <span>{item.name}</span>
                      <ChevronRight size={16} />
                    </button>
                  );
                })}

                <div className="aside-note">
                  <Sandwich size={33} />
                  <b>Hecho para tu antojo.</b>
                  <p>Elige, agrega y disfruta a tu manera.</p>
                </div>

                <button className="text-button" onClick={() => setCancel(true)}>
                  <RotateCcw size={16} /> Cancelar pedido
                </button>
              </aside>

              <section className="menu-content">
                <div className="menu-title">
                  <div>
                    <span className="eyebrow">¿QUÉ SE TE ANTOJA HOY?</span>
                    <h1>
                      {categories.find((item) => item.id === category)?.name}
                      <span className="yellow-dot">.</span>
                    </h1>

                    <p>
                      {category === 'sandwiches'
                        ? 'Tus favoritos de siempre, a un toque de distancia.'
                        : category === 'jugos'
                          ? 'Elige tu sabor y tu preparación.'
                          : 'Un acompañante para tu pedido.'}
                    </p>
                  </div>

                  <span className="product-count">
                    {products.filter((item) => item.category === category).length}{' '}
                    opciones
                  </span>
                </div>

                {category === 'sandwiches' && (
                  <div className="menu-banner">
                    <div>
                      <span>EL ANTOJO TIENE NOMBRE</span>
                      <h2>
                        Tu próximo favorito
                        <br />
                        te está esperando.
                      </h2>
                      <p>Elige tu sándwich y hazlo parte de tu día.</p>
                    </div>

                    <FoodImage src={sandwichImage} alt="Sándwich ilustrativo" />

                    <span className="banner-badge">
                      A TU
                      <br />
                      <b>GUSTO</b>
                    </span>
                  </div>
                )}

                <div className="product-grid">
                  {products
                    .filter(
                      (item) =>
                        item.category === category && item.available,
                    )
                    .map((item) => (
                      <button
                        className="product-card"
                        key={item.id}
                        onClick={() => open(item)}
                      >
                        <div className="product-photo">
                          <FoodImage
                            src={item.image}
                            alt={`Fotografía ilustrativa de ${item.name}`}
                          />

                          {item.id === 'payan-club' && (
                            <span className="tag">EL CLÁSICO PAYÁN</span>
                          )}
                        </div>

                        <div className="product-info">
                          <h3>{item.name}</h3>

                          <span>
                            {category === 'sandwiches'
                              ? 'Del menú'
                              : 'Foto ilustrativa'}{' '}
                            ·{' '}
                            {category === 'jugos'
                              ? 'Precio desde'
                              : 'Foto ilustrativa'}
                          </span>

                          <div>
                            <strong>{money(item.price)}</strong>
                            <span className="add-icon">
                              <Plus size={22} />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {!products.some(
                  (item) => item.category === category && item.available,
                ) && (
                  <div className="empty">
                    <GlassWater size={58} />
                    <h2>Muy pronto, más para elegir</h2>
                    <p>
                      Estamos verificando los productos de esta categoría.
                      <br />
                      Por ahora, disfruta de nuestros sándwiches.
                    </p>

                    <button
                      className="primary"
                      onClick={() => setCategory('sandwiches')}
                    >
                      Ver sándwiches <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                <p className="catalog-disclaimer">
                  {category === 'jugos' &&
                    'La columna C está pendiente de identificación. No se muestran tamaños sin confirmar. '}
                  {category === 'bebidas' &&
                    'La sección de bebidas está cortada en la foto; faltan productos por verificar. '}
                  Prototipo · Precios transcritos de la foto del menú. Fotografías
                  ilustrativas.
                </p>
              </section>
            </main>
          )}

          {screen === 'cart' && (
            <main className="flow-page">
              <button className="back" onClick={() => setScreen('menu')}>
                <ArrowLeft size={18} /> Seguir eligiendo
              </button>

              <span className="eyebrow">UN PASO MÁS CERCA</span>
              <h1>
                Tu pedido<span className="yellow-dot">.</span>
              </h1>
              <p className="muted">Todo lo que se te antojó, en un solo lugar.</p>

              {!lines.length ? (
                <div className="empty">
                  <ShoppingBag size={55} />
                  <h2>Tu próximo antojo te espera</h2>

                  <button className="primary" onClick={() => setScreen('menu')}>
                    Explorar menú <ArrowRight />
                  </button>
                </div>
              ) : (
                <div className="cart-layout">
                  <div className="cart-lines">
                    {lines.map((line) => (
                      <article className="cart-line" key={line.id}>
                        <FoodImage src={line.image} alt={line.name} />

                        <div className="line-description">
                          <h3>{line.name}</h3>
                          {line.size && <p>{line.size}</p>}
                          {line.note && (
                            <p className="line-note">Nota: {line.note}</p>
                          )}
                          <strong>{money(line.unitPrice)}</strong>
                        </div>

                        <QuantitySelector
                          value={line.quantity}
                          onChange={(value) => quantity(line.id, value)}
                        />

                        <strong>{money(line.quantity * line.unitPrice)}</strong>

                        <button
                          className="icon-button"
                          aria-label={`Eliminar ${line.name}`}
                          onClick={() => remove(line.id)}
                        >
                          <Trash2 size={19} />
                        </button>
                      </article>
                    ))}
                  </div>

                  <aside className="summary">
                    <h2>Así va tu pedido</h2>

                    <div>
                      <span>Subtotal ({count} productos)</span>
                      <b>{money(total.subtotal)}</b>
                    </div>

                    <p className="tax-note">
                      Se agregará un 10% de propina fiscal al total de su pedido.
                    </p>

                    <div className="total">
                      <span>Total</span>
                      <strong>{money(total.total)}</strong>
                    </div>

                    <button
                      className="primary"
                      onClick={() => {
                        setMethod(null);
                        setScreen('payment');
                      }}
                    >
                      Continuar al pago <ArrowRight size={20} />
                    </button>

                    <span className="secure">
                      <ShieldCheck size={16} /> Sin cuentas. Sin complicaciones.
                    </span>
                  </aside>
                </div>
              )}
            </main>
          )}

          {screen === 'payment' && (
            <main className="flow-page payment-page">
              <button
                className="back"
                disabled={busy}
                onClick={() => {
                  setError('');
                  setScreen('cart');
                }}
              >
                <ArrowLeft size={18} /> Volver al pedido
              </button>

              <span className="eyebrow">YA CASI ESTÁ</span>
              <h1>¿Cómo quieres pagar?</h1>
              <p className="muted">
                Elige la opción que prefieras. Total: <b>{money(total.total)}</b>
              </p>

              <div className="payment-options">
                <button
                  disabled={busy}
                  className={method === 'card' ? 'chosen' : ''}
                  onClick={() => {
                    setMethod('card');
                    setError('');
                  }}
                >
                  <CreditCard size={42} />
                  <h2>Pagar con tarjeta</h2>
                  <p>Simula el pago aquí en el kiosco.</p>
                  <span>DEMONSTRACIÓN</span>
                </button>

                <button
                  disabled={busy}
                  className={method === 'cash' ? 'chosen' : ''}
                  onClick={() => {
                    setMethod('cash');
                    setError('');
                  }}
                >
                  <ShoppingBag size={42} />
                  <h2>Pagar en caja</h2>
                  <p>Confirma y lleva tu número a caja.</p>
                  <span>PENDIENTE DE PAGO</span>
                </button>
              </div>

              {method && (
                <div className="payment-panel">
                  <ShieldCheck size={26} />
                  <p>
                    {method === 'card'
                      ? 'Pago de demostración: no se cobra dinero ni se solicitan datos de tarjeta.'
                      : 'Tu orden queda pendiente de pago. La preparación comenzará cuando caja confirme el pago.'}
                  </p>
                </div>
              )}

              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}

              <button
                className="primary payment-confirm"
                disabled={!method || busy || !lines.length}
                onClick={() => void finish()}
              >
                {busy ? (
                  <>
                    <span className="spinner" /> Autorizando simulación…
                  </>
                ) : (
                  <>
                    {method === 'cash'
                      ? 'Confirmar y pagar en caja'
                      : 'Confirmar pago simulado'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {method === 'card' && (
                <button
                  className="text-button failure"
                  disabled={busy}
                  onClick={() => void finish('failure')}
                >
                  Probar autorización rechazada
                </button>
              )}
            </main>
          )}

          {screen === 'confirmation' && order && (
            <main className="confirmation">
              <div className="success-icon">
                {order.payment === 'pending' ? (
                  <Clock3 size={46} />
                ) : (
                  <Check size={46} />
                )}
              </div>

              <span className="eyebrow">GRACIAS POR ELEGIR BARRA PAYÁN</span>
              <h1>
                {order.payment === 'pending'
                  ? '¡Tu orden está registrada!'
                  : '¡Pedido confirmado!'}
              </h1>

              <p>Tu número de orden</p>
              <div className="order-number">#{order.id}</div>

              <span className="status">
                {order.payment === 'pending'
                  ? 'Pendiente de pago'
                  : 'Pago simulado aprobado'}
              </span>

              <p className="next-step">
                {order.payment === 'pending'
                  ? 'Dirígete a caja e indica tu número de pedido. Tu orden aún no pasa a preparación.'
                  : 'Dirígete al área de entrega cuando tu pedido esté listo. Esta es una orden de demostración.'}
              </p>

              <div className="receipt">
                {order.lines.map((line) => (
                  <div key={line.id}>
                    <span>
                      {line.quantity} × {line.name}
                      {line.size && ` · ${line.size}`}
                      {line.note && <small>{line.note}</small>}
                    </span>
                    <b>{money(line.quantity * line.unitPrice)}</b>
                  </div>
                ))}

                <div className="receipt-total">
                  <b>Total</b>
                  <strong>{money(order.total)}</strong>
                </div>
              </div>

              <button className="primary" onClick={reset}>
                Comenzar nuevo pedido <ArrowRight size={20} />
              </button>
            </main>
          )}
        </>
      )}

      {screen === 'menu' && (
        <footer className="cart-bar">
          <div className="cart-bar-copy">
            <span className="bag">
              <ShoppingBag size={24} />
              <b>{count}</b>
            </span>

            <div>
              <strong>Tu pedido</strong>
              <span>
                {count
                  ? `${count} ${count === 1 ? 'producto agregado' : 'productos agregados'}`
                  : 'Aquí comienza algo rico'}
              </span>
            </div>
          </div>

          <div className="cart-bar-action">
            <div>
              <span>Total de tu pedido</span>
              <strong>{money(total.total)}</strong>
            </div>

            <button className="primary" onClick={() => setScreen('cart')}>
              Ver mi pedido <ArrowRight size={21} />
            </button>
          </div>
        </footer>
      )}

      {screen === 'welcome' && (
        <div className="welcome-footer">
          <span>UN PEDIDO FÁCIL. UN SABOR INCONFUNDIBLE.</span>
          <span>Prototipo de demostración · Fotografías ilustrativas</span>
        </div>
      )}

      {product && (
        <div className="overlay" onClick={() => setProduct(null)}>
          <section
            className="detail modal"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              autoFocus
              className="close"
              aria-label="Cerrar detalle"
              onClick={() => setProduct(null)}
            >
              <X />
            </button>

            <FoodImage src={product.image} alt={product.name} />

            <div className="detail-content">
              <span className="eyebrow">TU PRÓXIMO ANTOJO</span>
              <h2>{product.name}</h2>
              <p className="muted">
                Fotografía ilustrativa. Ingredientes por confirmar.
              </p>

              {product.sizes && (
                <label>
                  Preparación
                  <select
                    value={size}
                    onChange={(event) => setSize(event.target.value)}
                  >
                    {product.sizes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {money(item.price)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>Personaliza tu pedido</label>

              <div className="exclusion-grid">
                {exclusions.map((exclusion) => (
                  <button
                    key={exclusion}
                    type="button"
                    className={
                      selectedExclusions.includes(exclusion)
                        ? 'exclusion-button selected'
                        : 'exclusion-button'
                    }
                    onClick={() => toggleExclusion(exclusion)}
                    aria-pressed={selectedExclusions.includes(exclusion)}
                  >
                    {exclusion}
                  </button>
                ))}
              </div>

              <label htmlFor="note">
                Instrucciones adicionales <span>(opcional)</span>
              </label>

              <textarea
                id="note"
                maxLength={180}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ejemplo: poco aderezo, cortarlo en dos, etc."
              />

              <small className="muted">
                Las modificaciones están sujetas a disponibilidad y confirmación
                del restaurante.
              </small>

              <div className="detail-bottom">
                <QuantitySelector value={qty} onChange={setQty} />

                <strong>
                  {money(
                    (product.sizes?.find((item) => item.id === size)?.price ??
                      product.price) * qty,
                  )}
                </strong>
              </div>

              <button className="primary" onClick={addProduct}>
                Agregar al carrito <Plus size={21} />
              </button>
            </div>
          </section>
        </div>
      )}

      {cancel && (
        <div className="overlay">
          <section
            className="modal cancel-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
          >
            <h2 id="cancel-title">¿Cancelar tu pedido?</h2>
            <p>Se eliminarán los productos que has agregado.</p>

            <button
              autoFocus
              className="primary"
              onClick={() => setCancel(false)}
            >
              Seguir con mi pedido
            </button>

            <button className="text-button" onClick={reset}>
              Sí, cancelar pedido
            </button>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <Check size={20} />
          {toast}
        </div>
      )}
    </div>
  );
}