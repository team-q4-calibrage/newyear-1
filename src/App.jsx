import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  Gift, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Star, X, ShieldCheck, Truck, CreditCard
} from 'lucide-react'
import './styles/index.css'
import { products } from './data/products'

const reviews = [
  { name:'Amina S.', text:'Très belle qualité et livraison rapide à Cotonou. Le coffret est encore plus beau en vrai.', rating:5 },
  { name:'Yao K.', text:'Commande simple, prix vraiment intéressants et produit conforme aux photos.', rating:5 },
  { name:'Fatou D.', text:"J'ai acheté plusieurs cadeaux pour le Nouvel An. Tout est arrivé parfaitement emballé.", rating:5 },
  { name:'Kofi A.', text:'Excellent service client et livraison ponctuelle. Je recommande vivement pour les cadeaux.', rating:5 },
  { name:'Mariam T.', text:'Les produits sont de très bonne qualité. J\'ai offert le coffret et ma famille a adoré !', rating:5 },
  { name:'Jean-Baptiste M.', text:'Super rapport qualité-prix. Le packaging est magnifique, parfait pour offrir.', rating:5 },
  { name:'Adèle C.', text:'Livraison express en 24h à Porto-Novo. Les produits correspondent exactement à la description.', rating:5 },
  { name:'Emmanuel K.', text:'Service impeccable. J\'ai eu un petit souci et ils l\'ont résolu immédiatement.', rating:5 },
  { name:'Sylvie D.', text:'Les packs Nouvel An sont une excellente idée. Économies substantielles sur les achats groupés.', rating:5 },
  { name:'Philippe N.', text:'Première commande et je suis conqui. Qualité au rendez-vous et suivi de livraison par SMS.', rating:5 },
  { name:'Grace B.', text:'Coffret offert à ma sœur, elle était ravie ! La qualité des produits est remarquable.', rating:5 },
  { name:'Marc A.', text:'Paiement Mobile Money très pratique. Tout s\'est passé sans problème du début à la fin.', rating:5 },
]

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'XOF', maximumFractionDigits:0 }).format(value)
}

function Countdown() {
  const target = useMemo(() => new Date('2027-01-01T00:00:00').getTime(), [])
  const [time, setTime] = useState(target - Date.now())
  useEffect(() => {
    const timer = setInterval(() => setTime(Math.max(0, target-Date.now())), 1000)
    return () => clearInterval(timer)
  }, [target])
  const total = Math.floor(time/1000)
  const h = Math.floor(total/3600).toString().padStart(2,'0')
  const m = Math.floor((total%3600)/60).toString().padStart(2,'0')
  const s = (total%60).toString().padStart(2,'0')
  return <div className="countdown"><Clock3 size={17}/><span>Fin de l'offre dans</span><strong>{h}:{m}:{s}</strong></div>
}

function Header({ onCart, cartCount, onNavigate, currentPage }) {
  const [open, setOpen] = useState(false)
  const goHome = (e, target) => {
    e.preventDefault()
    setOpen(false)
    if (currentPage !== 'home') {
      onNavigate('home')
      setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={(e)=>goHome(e,'#top')}><span className="brand-mark">N</span><span>NEW<span className="gold">YEAR</span></span></a>
      <nav className={open ? 'nav open' : 'nav'}>
        <a href="#offres" onClick={(e)=>goHome(e,'#offres')}>Accueil</a>
        <a href="#produits" onClick={(e)=>{e.preventDefault();setOpen(false);onNavigate('all')}}>Tous les produits</a>
        <a href="#avis" onClick={(e)=>goHome(e,'#avis')}>Avis</a>
        <a href="#faq" onClick={(e)=>goHome(e,'#faq')}>FAQ</a>
      </nav>
      <div className="header-actions">
        <button className="icon-btn search-btn" aria-label="Rechercher" onClick={()=>{const q=prompt('Rechercher un produit:');if(q){onNavigate('all');setTimeout(()=>{const input=document.querySelector('.search-box input');if(input){input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}))}},100)}}}><Search size={20}/></button>
        <button className="cart-btn" onClick={onCart} aria-label={`Panier, ${cartCount} article(s)`}><ShoppingBag size={20}/><span>Panier</span>{cartCount>0 && <b>{cartCount}</b>}</button>
        <button className="icon-btn menu-btn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      </div>
    </header>
  )
}

function HeroCarousel({ products, onAdd }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const product = products[index]
  const nextProduct = products[(index + 1) % products.length]

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setIndex(i => (i + 1) % products.length)
    }, 5200)
    return () => clearInterval(timer)
  }, [products.length])

  return (
    <div className="hero-visual">
      <div className="burst">JUSQU'À<br/><strong>{product.discount}</strong></div>
      <div className="hero-card hero-card-back"><span>NEW YEAR</span></div>
      <div className="hero-product">
        <div className="hero-slide hero-slide-next">
          <img src={nextProduct.image} alt={nextProduct.name}/>
        </div>
        <div key={product.id} className={`hero-slide hero-slide-current hero-slide-${direction}`}>
          <img src={product.image} alt={product.name}/>
        </div>
        <div className="hero-product-shade"/>
        <div className="hero-product-info">
          <span>{product.category}</span>
          <strong>{product.name}</strong>
          <div><b>{formatPrice(product.price)}</b><del>{formatPrice(product.oldPrice)}</del></div>
        </div>
      </div>
      <div className="hero-product-controls">
        <div className="hero-dots">
          {products.map((item, i) => <button key={item.id} aria-label={`Afficher ${item.name}`} className={i === index ? 'active' : ''} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }} />)}
        </div>
      </div>
      <div className="floating-card"><span>★ ★ ★ ★ ★</span><b>{product.rating}/5</b><small>{product.reviews} avis vérifiés</small></div>
      <div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="sparkle s3">✦</div>
      <div className="hero-mini-label"><span>OFFRE DU MOMENT</span><b>Économisez {formatPrice(product.oldPrice-product.price)}</b></div>
      <button className="hero-buy" onClick={() => onAdd(product)}>Acheter maintenant <ArrowRight size={16}/></button>
    </div>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy"/>
        <span className="product-tag">{product.tag}</span>
        <span className="discount">{product.discount}</span>
        {product.stock <= 5 && <span className="stock-alert">Plus que {product.stock} en stock</span>}
        <button className="quick-add" onClick={()=>onAdd(product)}><Plus size={20}/></button>
      </div>
      <div className="product-info">
        <span className="category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="rating"><span>{'★'.repeat(Math.round(product.rating))}</span><small>{product.rating} ({product.reviews})</small></div>
        <div className="price-row"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div>
        <button className="buy-btn" onClick={()=>onAdd(product)}>Acheter maintenant <ArrowRight size={17}/></button>
      </div>
    </article>
  )
}

function Cart({ items, onClose, onRemove, onChangeQty, onCheckout }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  const total = items.reduce((sum,i)=>sum+i.price*i.qty,0)
  const whatsappMsg = encodeURIComponent(`Bonjour ! Je souhaite passer commande :\n${items.map(i=>`• ${i.name} x${i.qty} — ${formatPrice(i.price*i.qty)}`).join('\n')}\n\nTotal : ${formatPrice(total)}`)
  const whatsappNumber = '22996123456'
  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Panier d'achat">
      <aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
        <div className="cart-head"><div><span>Votre panier</span><h2>{items.reduce((s,i)=>s+i.qty,0)} article(s)</h2></div><button className="icon-btn" onClick={onClose} aria-label="Fermer le panier"><X/></button></div>
        {items.length===0 ? <div className="empty-cart"><ShoppingBag size={42}/><h3>Votre panier est vide</h3><p>Ajoutez vos coups de cœur du Nouvel An.</p></div> :
        <>
          <div className="cart-items">{items.map(item=><div className="cart-item" key={item.id}><img src={item.image} alt={item.name} loading="lazy"/><div className="cart-item-info"><h4>{item.name}</h4><strong>{formatPrice(item.price)}</strong><div className="qty"><button onClick={()=>onChangeQty(item.id,-1)} aria-label="Diminuer la quantité"><Minus size={13}/></button><span>{item.qty}</span><button onClick={()=>onChangeQty(item.id,1)} aria-label="Augmenter la quantité"><Plus size={13}/></button></div></div><button className="remove" onClick={()=>onRemove(item.id)} aria-label={`Supprimer ${item.name}`}>Supprimer</button></div>)}</div>
          <div className="cart-footer">
            <div><span>Sous-total</span><strong>{formatPrice(total)}</strong></div>
            <button className="checkout" onClick={onCheckout} aria-label="Continuer vers le paiement">Continuer vers le paiement <ArrowRight/></button>
            <a className="whatsapp-btn" href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Commander sur WhatsApp
            </a>
            <div className="payment-badges">
              <span><CreditCard size={14}/> Visa</span>
              <span><CreditCard size={14}/> Mastercard</span>
              <span><ShieldCheck size={14}/> Paiement sécurisé</span>
            </div>
            <div className="secure-badges">
              <span><ShieldCheck size={14}/> Paiement sécurisé</span>
              <span><Truck size={14}/> Livraison suivie</span>
            </div>
          </div>
        </>}
      </aside>
    </div>
  )
}

function Checkout({ items, total, onClose, onConfirm }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  const [form, setForm] = useState({ name:'', phone:'', address:'', payment:'mobile' })
  const [errors, setErrors] = useState({})
  const handleChange = (e) => { setForm({...form, [e.target.name]:e.target.value}); setErrors({...errors, [e.target.name]:''}) }
  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nom requis'
    if (!form.phone.trim()) errs.phone = 'Téléphone requis'
    if (!form.address.trim()) errs.address = 'Adresse requise'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  const submit = (e) => { e.preventDefault(); if (validate()) onConfirm(form) }
  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Paiement">
      <aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
        <div className="cart-head"><div><span>Finaliser la commande</span><h2>Paiement</h2></div><button className="icon-btn" onClick={onClose} aria-label="Fermer"><X/></button></div>
        <form className="checkout-form" onSubmit={submit}>
          <div className="checkout-items">{items.map(item=><div className="checkout-item" key={item.id}><img src={item.image} alt={item.name} loading="lazy"/><div><h4>{item.name}</h4><span>{formatPrice(item.price)} × {item.qty}</span></div><strong>{formatPrice(item.price*item.qty)}</strong></div>)}</div>
          <div className="checkout-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <div className="form-group"><label htmlFor="co-name">Nom complet</label><input id="co-name" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" aria-label="Nom complet"/>{errors.name && <span className="error">{errors.name}</span>}</div>
          <div className="form-group"><label htmlFor="co-phone">Téléphone</label><input id="co-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Ex : 96 12 34 56" aria-label="Numéro de téléphone"/>{errors.phone && <span className="error">{errors.phone}</span>}</div>
          <div className="form-group"><label htmlFor="co-address">Adresse de livraison</label><textarea id="co-address" name="address" value={form.address} onChange={handleChange} placeholder="Quartier, rue, repère..." rows={3} aria-label="Adresse de livraison"/>{errors.address && <span className="error">{errors.address}</span>}</div>
          <div className="form-group"><label>Moyen de paiement</label><div className="payment-options"><label className={form.payment==='mobile'?'active':''}><input type="radio" name="payment" value="mobile" checked={form.payment==='mobile'} onChange={handleChange}/><CreditCard size={16}/> Mobile Money</label><label className={form.payment==='card'?'active':''}><input type="radio" name="payment" value="card" checked={form.payment==='card'} onChange={handleChange}/><CreditCard size={16}/> Carte bancaire</label><label className={form.payment==='cash'?'active':''}><input type="radio" name="payment" value="cash" checked={form.payment==='cash'} onChange={handleChange}/><Truck size={16}/> Paiement à la livraison</label></div></div>
          <button type="submit" className="checkout submit-btn">Confirmer la commande — {formatPrice(total)}</button>
          <small className="secure-note"><ShieldCheck size={13}/> Vos données sont sécurisées</small>
        </form>
      </aside>
    </div>
  )
}

function OrderConfirmation({ order, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Confirmation de commande">
      <aside className="cart-drawer confirmation" onClick={e=>e.stopPropagation()}>
        <div className="confirmation-icon"><Check size={40}/></div>
        <h2>Commande confirmée !</h2>
        <p className="confirmation-sub">Merci {order.name} ! Votre commande a bien été enregistrée.</p>
        <div className="confirmation-details">
          <div><span>Numéro de commande</span><strong>NY-{order.id}</strong></div>
          <div><span>Téléphone</span><strong>{order.phone}</strong></div>
          <div><span>Livraison</span><strong>{order.address}</strong></div>
          <div><span>Paiement</span><strong>{order.payment==='mobile'?'Mobile Money':order.payment==='card'?'Carte bancaire':'À la livraison'}</strong></div>
          <div><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
        </div>
        <p className="confirmation-note">Nous vous contacterons au {order.phone} pour confirmer la livraison. Livraison sous 24-48h.</p>
        <button className="checkout" onClick={onClose}>Continuer mes achats</button>
      </aside>
    </div>
  )
}

function ScratchCard({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  const [scratched, setScratched] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const prize = useMemo(() => {
    const prizes = ['-5%', '-10%', '-15%', '-20%', '-25%', '-30%']
    return prizes[Math.floor(Math.random() * prizes.length)]
  }, [])
  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Carte à gratter">
      <div className="scratch-modal" onClick={e=>e.stopPropagation()}>
        <button className="icon-btn wheel-close" onClick={onClose} aria-label="Fermer"><X/></button>
        <h2>Carte à <em>Gratter</em></h2>
        <p className="wheel-sub">Grattez la carte pour révéler votre réduction !</p>
        <div className="scratch-card" onClick={() => { setScratched(true); setTimeout(() => setRevealed(true), 600) }}>
          <div className="scratch-prize">
            <strong>{prize}</strong>
            <span>de réduction</span>
          </div>
          <div className={`scratch-cover ${scratched ? 'scratched' : ''}`}>
            <span>Grattez ici</span>
          </div>
        </div>
        {revealed && (
          <div className="wheel-result">
            <strong>Félicitations !</strong>
            <p>Vous avez gagné <b>{prize}</b> de réduction</p>
            <small>Code : SCRATCH{prize.replace('-', '').replace('%', '')}</small>
          </div>
        )}
      </div>
    </div>
  )
}

function GiftAssistant({ onClose, onAdd }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const questions = [
    { key: 'budget', question: 'Quel est votre budget ?', options: [
      { label: 'Moins de 30€', value: 'low' },
      { label: '30€ - 50€', value: 'mid' },
      { label: 'Plus de 50€', value: 'high' },
    ]},
    { key: 'person', question: 'Pour qui est le cadeau ?', options: [
      { label: 'Famille', value: 'family' },
      { label: 'Ami(e)', value: 'friend' },
      { label: 'Collègue', value: 'colleague' },
      { label: 'Partenaire', value: 'partner' },
    ]},
    { key: 'interest', question: 'Quel centre d\'intérêt ?', options: [
      { label: 'Maison & Déco', value: 'home' },
      { label: 'Mode', value: 'fashion' },
      { label: 'Bien-être', value: 'wellness' },
      { label: 'Tech', value: 'tech' },
    ]},
  ]
  const getRecommendation = () => {
    const { budget, person, interest } = answers
    if (interest === 'home') return products.find(p => p.category === 'Maison & déco' && (budget === 'low' ? p.price < 40 : budget === 'mid' ? p.price < 50 : p.price >= 50)) || products[0]
    if (interest === 'fashion') return products.find(p => p.category === 'Mode & accessoires' && (budget === 'low' ? p.price < 50 : budget === 'mid' ? p.price < 60 : p.price >= 60)) || products[1]
    if (interest === 'wellness') return products.find(p => p.category === 'Bien-être' && (budget === 'low' ? p.price < 30 : budget === 'mid' ? p.price < 50 : p.price >= 50)) || products[2]
    if (interest === 'tech') return products.find(p => p.category === 'Tech' && (budget === 'low' ? p.price < 30 : budget === 'mid' ? p.price < 50 : p.price >= 50)) || products[3]
    return products[0]
  }
  const currentQ = questions[step]
  const select = (value) => {
    const newAnswers = { ...answers, [currentQ.key]: value }
    setAnswers(newAnswers)
    setStep(step + 1)
  }
  const recommended = step === questions.length ? getRecommendation() : null
  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Assistant cadeau">
      <div className="assistant-modal" onClick={e=>e.stopPropagation()}>
        <button className="icon-btn wheel-close" onClick={onClose} aria-label="Fermer"><X/></button>
        <h2>Assistant <em>Cadeau</em></h2>
        <p className="wheel-sub">Trouvez le cadeau idéal en 3 questions</p>
        {!recommended ? (
          <div className="assistant-question">
            <div className="assistant-progress">Question {step + 1} / {questions.length}</div>
            <h3>{currentQ.question}</h3>
            <div className="assistant-options">
              {currentQ.options.map(opt => (
                <button key={opt.value} className="assistant-option" onClick={() => select(opt.value)}>{opt.label}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="assistant-result">
            <div className="assistant-progress">Votre cadeau idéal</div>
            <div className="assistant-product">
              <img src={recommended.image} alt={recommended.name} loading="lazy"/>
              <div>
                <h3>{recommended.name}</h3>
                <p>{recommended.category}</p>
                <div className="price-row"><strong>{formatPrice(recommended.price)}</strong><del>{formatPrice(recommended.oldPrice)}</del></div>
                <button className="buy-btn" onClick={() => { onAdd(recommended); onClose() }}>Ajouter au panier <ArrowRight size={14}/></button>
              </div>
            </div>
            <button className="outline-btn" onClick={() => { setStep(0); setAnswers({}) }}>Recommencer</button>
          </div>
        )}
      </div>
    </div>
  )
}

function AllProducts({ onAdd, onBack, onCart, cartCount, items, onChangeQty, onRemove, total, setCartOpen, setCheckoutOpen, confirmOrder, order, setOrder }) {
  const [category, setCategory] = useState('Tous')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const categories = ['Tous', 'Maison & déco', 'Mode & accessoires', 'Bien-être', 'Tech']
  
  let filtered = category === 'Tous' ? products : products.filter(p => p.category === category)
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
    <div className="page all-products-page">
      <div className="topbar"><Sparkles size={15}/> Offre Nouvel An : jusqu'à <b>-44%</b> sur une sélection</div>
      <header className="site-header">
        <a className="brand" href="#top" onClick={(e)=>{e.preventDefault();onBack()}}><span className="brand-mark">N</span><span>NEW<span className="gold">YEAR</span></span></a>
        <nav className="nav">
          <a href="#offres" onClick={(e)=>{e.preventDefault();onBack()}}>Accueil</a>
          <a href="#produits" onClick={(e)=>e.preventDefault()}>Tous les produits</a>
        </nav>
        <div className="header-actions">
          <button className="cart-btn" onClick={onCart} aria-label={`Panier, ${cartCount} article(s)`}><ShoppingBag size={20}/><span>Panier</span>{cartCount>0 && <b>{cartCount}</b>}</button>
        </div>
      </header>
      
      <main className="all-products-main">
        <div className="all-products-header">
          <button className="back-btn" onClick={onBack}><ChevronLeft size={18}/> Retour</button>
          <div className="all-products-title">
            <span className="eyebrow">Catalogue complet</span>
            <h1>Tous nos <em>produits</em></h1>
            <p>{filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="all-products-filters">
          <div className="filters">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="all-products-tools">
            <div className="search-box">
              <Search size={16}/>
              <input type="text" placeholder="Rechercher un produit..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="sort-select">
              <option value="default">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        <div className="product-grid all-products-grid">
          {filtered.map(p=><ProductCard key={p.id} product={p} onAdd={onAdd}/>)}
        </div>

        {filtered.length === 0 && (
          <div className="no-results">
            <Search size={40}/>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez avec d'autres termes de recherche</p>
          </div>
        )}
      </main>

      <footer>
        <div className="brand"><span className="brand-mark">N</span><span>NEW<span className="gold">YEAR</span></span></div>
        <p>Une nouvelle année, de nouvelles envies.</p>
        <div className="footer-contact"><span>Contact : 96 12 34 56</span><span>© 2027 New Year Store</span></div>
      </footer>
    </div>
    {cartOpen && <Cart items={items} onClose={()=>setCartOpen(false)} onRemove={onRemove} onChangeQty={onChangeQty} onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true)}}/>}
    {checkoutOpen && <Checkout items={items} total={total} onClose={()=>setCheckoutOpen(false)} onConfirm={confirmOrder}/>}
    {order && <OrderConfirmation order={order} onClose={()=>setOrder(null)}/>}
    <button className="mobile-buy-btn" onClick={()=>setCartOpen(true)} aria-label={`Ouvrir le panier, ${cartCount} article(s)`}><ShoppingBag size={18}/> Panier {cartCount>0 && <b>{cartCount}</b>}</button>
  </>
  )
}

function App() {
  const [items,setItems]=useState(()=>{
    try{const saved=localStorage.getItem('ny-cart');return saved?JSON.parse(saved):[]}catch(e){return[]}
  })
  const [cartOpen,setCartOpen]=useState(false)
  const [checkoutOpen,setCheckoutOpen]=useState(false)
  const [order,setOrder]=useState(null)
  const [category,setCategory]=useState('Tous')
  const [reviewIndex,setReviewIndex]=useState(0)
  const [currentPage,setCurrentPage]=useState('home')
  const [showScratch,setShowScratch]=useState(false)
  const [showAssistant,setShowAssistant]=useState(false)
  const categories=['Tous','Maison & déco','Mode & accessoires','Bien-être','Tech']
  const filtered=category==='Tous'?products:products.filter(p=>p.category===category)

  useEffect(()=>{localStorage.setItem('ny-cart',JSON.stringify(items))},[items])

  const [toast,setToast]=useState(null)
  const add=(product)=>{
    setItems(prev=>prev.some(i=>i.id===product.id)?prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i):[...prev,{...product,qty:1}])
    setToast(`${product.name} ajouté au panier`)
    setTimeout(()=>setToast(null),2500)
    setCartOpen(true)
  }
  const changeQty=(id,delta)=>setItems(prev=>prev.map(i=>i.id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0))
  const cartCount=items.reduce((s,i)=>s+i.qty,0)
  const total=items.reduce((s,i)=>s+i.price*i.qty,0)

  const confirmOrder=(form)=>{
    setOrder({ ...form, id: Math.floor(100000+Math.random()*900000), total })
    setCheckoutOpen(false)
    setCartOpen(false)
    setItems([])
  }

  if (currentPage === 'all') {
    return <>
      <AllProducts onAdd={add} onBack={()=>setCurrentPage('home')} onCart={()=>setCartOpen(true)} cartCount={cartCount} items={items} onChangeQty={changeQty} onRemove={id=>setItems(p=>p.filter(i=>i.id!==id))} total={total} setCartOpen={setCartOpen} setCheckoutOpen={setCheckoutOpen} confirmOrder={confirmOrder} order={order} setOrder={setOrder}/>
      {cartOpen && <Cart items={items} onClose={()=>setCartOpen(false)} onRemove={id=>setItems(p=>p.filter(i=>i.id!==id))} onChangeQty={changeQty} onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true)}}/>}
      {checkoutOpen && <Checkout items={items} total={total} onClose={()=>setCheckoutOpen(false)} onConfirm={confirmOrder}/>}
      {order && <OrderConfirmation order={order} onClose={()=>setOrder(null)}/>}
    </>
  }

  return <>
    <div id="top" className="page">
      <div className="topbar"><Sparkles size={15}/> Offre Nouvel An : jusqu'à <b>-44%</b> sur une sélection <a href="#produits">J'en profite <ArrowRight size={13}/></a></div>
      <Header onCart={()=>setCartOpen(true)} cartCount={cartCount} onNavigate={setCurrentPage} currentPage={currentPage}/>

      <main>
        <section className="hero" id="offres">
          <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
          <div className="hero-copy">
            <span className="eyebrow"><Gift size={16}/> Collection spéciale 2027</span>
            <h1>Commencez l'année<br/><em>en beauté.</em></h1>
            <p>Les essentiels qui font plaisir, sélectionnés pour vos cadeaux et vos moments de fête. Profitez des prix exceptionnels avant la fin de l'offre.</p>
            <div className="hero-actions"><a className="primary" href="#produits">Découvrir les offres <ArrowRight/></a><a className="secondary" href="#avis">Voir les avis <Star size={16}/></a></div>
            <div className="trust"><span><Check size={15}/> Paiement sécurisé</span><span><Check size={15}/> Retours 14 jours</span><span><Check size={15}/> Livraison suivie</span></div>
          </div>
          <HeroCarousel products={products} onAdd={add}/>
        </section>

        <section className="offer-strip">
          <div><Clock3/><span><b>OFFRE LIMITÉE</b><small>Les meilleures offres partent vite</small></span></div>
          <Countdown/>
          <a href="#produits">Voir les produits <ArrowRight size={16}/></a>
        </section>

        <section className="fun-section">
          <div className="section-heading center-heading"><div><span className="eyebrow">Jouez et gagnez</span><h2>Des surprises <em>vous attendent</em></h2></div><p>Grattez la carte ou laissez notre assistant vous guider.</p></div>
          <div className="fun-grid">
            <div className="fun-card" onClick={()=>setShowScratch(true)}>
              <div className="fun-icon">🎫</div>
              <h3>Carte à Gratter</h3>
              <p>Grattez et révélez votre réduction</p>
              <span className="fun-cta">Gratter <ArrowRight size={14}/></span>
            </div>
            <div className="fun-card" onClick={()=>setShowAssistant(true)}>
              <div className="fun-icon">🎁</div>
              <h3>Assistant Cadeau</h3>
              <p>Trouvez le cadeau idéal en 3 questions</p>
              <span className="fun-cta">Découvrir <ArrowRight size={14}/></span>
            </div>
          </div>
        </section>

        <section className="products-section" id="produits">
          <div className="section-heading"><div><span className="eyebrow">Nos offres</span><h2>Les favoris du <em>Nouvel An</em></h2></div><p>Des prix festifs sur les produits les plus appréciés.</p></div>
          <div className="filters">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p} onAdd={add}/>)}</div>
          <div className="center"><button className="outline-btn" onClick={()=>setCurrentPage('all')}>Voir toute la sélection <ArrowRight/></button></div>
        </section>

        <section className="mid-banner">
          <div><span className="eyebrow">Le cadeau parfait</span><h2>Faites durer la magie<br/><em>après minuit.</em></h2><p>Des idées cadeaux élégantes pour bien commencer l'année.</p><a className="primary" href="#produits">Explorer la collection <ArrowRight/></a></div>
          <div className="banner-art"><div className="ring"/><div className="year">2027</div><div className="confetti">✦ &nbsp; ✧ &nbsp; ✦</div></div>
        </section>

        <section className="packs-section">
          <div className="section-heading center-heading"><div><span className="eyebrow">Offres spéciales</span><h2>Packs <em>Nouvel An</em></h2></div><p>Combinez nos produits et économisez encore plus.</p></div>
          <div className="packs-grid">
            <div className="pack-card">
              <div className="pack-badge">-20%</div>
              <h3>Coffret Découverte</h3>
              <p>Coffret Lumière Étoilée + Diffuseur Aura</p>
              <div className="pack-price"><strong>29 900 F</strong><del>44 800 F</del></div>
              <button className="buy-btn" onClick={()=>{add(products[0]);add(products[2])}}>Ajouter le pack <ArrowRight size={14}/></button>
            </div>
            <div className="pack-card">
              <div className="pack-badge">-25%</div>
              <h3>Coffret Élégance</h3>
              <p>Montre Minimal Gold + Sac City Élégance</p>
              <div className="pack-price"><strong>35 900 F</strong><del>47 400 F</del></div>
              <button className="buy-btn" onClick={()=>{add(products[1]);add(products[4])}}>Ajouter le pack <ArrowRight size={14}/></button>
            </div>
            <div className="pack-card">
              <div className="pack-badge">-30%</div>
              <h3>Coffret Premium</h3>
              <p>Casque Nova + Set Verres Crystal</p>
              <div className="pack-price"><strong>34 900 F</strong><del>44 800 F</del></div>
              <button className="buy-btn" onClick={()=>{add(products[3]);add(products[5])}}>Ajouter le pack <ArrowRight size={14}/></button>
            </div>
          </div>
        </section>

        <section className="reviews-section" id="avis">
          <div className="section-heading center-heading"><div><span className="eyebrow">Ils en parlent</span><h2>Des clients <em>conquis.</em></h2></div><p>Une expérience pensée pour vous accompagner dans vos achats de fêtes.</p></div>
          <div className="reviews-wrap">
            <button className="review-nav" onClick={()=>setReviewIndex((reviewIndex-1+reviews.length)%reviews.length)}><ChevronLeft/></button>
            <div className="review-card"><div className="stars">{'★'.repeat(reviews[reviewIndex].rating)}</div><blockquote>"{reviews[reviewIndex].text}"</blockquote><strong>{reviews[reviewIndex].name}</strong><small>Achat vérifié</small></div>
            <button className="review-nav" onClick={()=>setReviewIndex((reviewIndex+1)%reviews.length)}><ChevronRight/></button>
          </div>
          <div className="review-dots">{reviews.map((_,i)=><button key={i} className={i===reviewIndex?'active':''} onClick={()=>setReviewIndex(i)}/>)}</div>
        </section>

        <section className="faq" id="faq">
          <div><span className="eyebrow">Besoin d'aide ?</span><h2>Questions<br/><em>fréquentes.</em></h2></div>
          <div className="faq-list">
            <details open><summary>Quels sont les délais de livraison ?<ChevronDown/></summary><p>Livraison sous 24 à 48h à Cotonou et environs, et 3 à 5 jours pour les autres villes du Bénin. Vous recevez un SMS de suivi dès l'expédition de votre colis.</p></details>
            <details><summary>Puis-je retourner un article ?<ChevronDown/></summary><p>Oui, vous disposez de 14 jours après réception pour retourner un article non utilisé dans son emballage d'origine. Le remboursement est effectué sous 48h après réception du retour.</p></details>
            <details><summary>Quels moyens de paiement acceptez-vous ?<ChevronDown/></summary><p>Nous acceptons Mobile Money (MTN MoMo, Moov Money), Visa, Mastercard, et le paiement à la livraison. Toutes les transactions sont sécurisées.</p></details>
            <details><summary>Comment suivre ma commande ?<ChevronDown/></summary><p>Après votre commande, vous recevez un SMS avec un numéro de suivi. Vous pouvez aussi nous contacter au 96 12 34 56 pour connaître le statut de votre livraison.</p></details>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark">N</span><span>NEW<span className="gold">YEAR</span></span></div>
        <p>Une nouvelle année, de nouvelles envies.</p>
        <div className="footer-contact"><span>Contact : 96 12 34 56</span><span>© 2027 New Year Store</span></div>
      </footer>
    </div>
    {cartOpen && <Cart items={items} onClose={()=>setCartOpen(false)} onRemove={id=>setItems(p=>p.filter(i=>i.id!==id))} onChangeQty={changeQty} onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true)}}/>}
    {checkoutOpen && <Checkout items={items} total={total} onClose={()=>setCheckoutOpen(false)} onConfirm={confirmOrder}/>}
    {order && <OrderConfirmation order={order} onClose={()=>setOrder(null)}/>}
    {showScratch && <ScratchCard onClose={()=>setShowScratch(false)}/>}
    {showAssistant && <GiftAssistant onClose={()=>setShowAssistant(false)} onAdd={add}/>}
    {toast && <div className="toast">{toast}</div>}
    <button className="mobile-buy-btn" onClick={()=>setCartOpen(true)} aria-label={`Ouvrir le panier, ${cartCount} article(s)`}><ShoppingBag size={18}/> Panier {cartCount>0 && <b>{cartCount}</b>}</button>
  </>
}
export default App
