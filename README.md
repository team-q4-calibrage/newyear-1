# NEW YEAR — Offres exclusives du Nouvel An

Site e-commerce pour les offres spéciales du Nouvel An, proposant une sélection de cadeaux et produits tendance à prix réduits.

## 🎯 Fonctionnalités

### Catalogue de produits
- **7 produits** répartis en 4 catégories : Maison & déco, Mode & accessoires, Bien-être, Tech
- **Carrousel automatique** mettant en vedette les produits vedettes
- **Filtres par catégorie** pour une navigation facile
- **Recherche de produits** par nom
- **Tri** par prix (croissant/décroissant), note ou nom
- **Badges de stock** pour les produits en quantité limitée

### Panier et commande
- **Panier dynamique** avec gestion des quantités
- **Persistance locale** du panier (localStorage)
- **Formulaire de commande** avec validation
- **Moyens de paiement** : Mobile Money, Carte bancaire, Paiement à la livraison
- **Confirmation de commande** avec numéro de suivi
- **Commande via WhatsApp** pour un contact direct

### Expérience utilisateur
- **Carte à gratter** interactive pour débloquer des réductions (-5% à -30%)
- **Assistant cadeau** : répondez à 3 questions pour obtenir une recommandation personnalisée
- **Compte à rebours** pour les offres limitées
- **Avis clients** avec navigation par diapositives
- **FAQ** accordéon pour les questions fréquentes

### Packs spéciaux
- **3 packs Nouvel An** avec réductions combinées (-20%, -25%, -30%)
- Ajout en un clic de plusieurs produits au panier

### Design et interface
- **Design moderne** avec thème noir et or
- **Responsive** : optimisé pour mobile, tablette et desktop
- **Animations fluides** pour une expérience utilisateur agréable
- **Notifications toast** lors de l'ajout au panier
- **Navigation SPA** (Single Page Application) sans rechargement

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📁 Structure du projet

```
newyear-1/
├── public/
│   └── images/           # Images des produits
├── src/
│   ├── components/       # Composants React
│   ├── data/
│   │   └── products.js   # Données des produits
│   ├── styles/
│   │   └── index.css     # Styles globaux
│   ├── App.jsx           # Composant principal
│   └── main.jsx          # Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Configuration

### Gestion des produits
Les produits sont définis dans le fichier `src/data/products.js`. Chaque produit contient :
- `id` : identifiant unique
- `name` : nom du produit
- `category` : catégorie (Maison & déco, Mode & accessoires, Bien-être, Tech)
- `price` : prix actuel en FCFA
- `oldPrice` : prix original pour afficher la réduction
- `discount` : pourcentage de réduction affiché
- `image` : chemin vers l'image (dans `public/images/`)
- `rating` : note moyenne (0-5)
- `reviews` : nombre d'avis
- `tag` : badge (Best-seller, Nouveau, etc.)
- `stock` : quantité en stock

Pour ajouter ou modifier un produit, éditez directement ce fichier.

### Numéro WhatsApp
Le numéro WhatsApp utilisé pour les commandes est configuré dans `src/App.jsx` à la ligne 148 :
```javascript
const whatsappNumber = '22996123456'
```
Modifiez cette valeur avec votre numéro de téléphone au format international (indicatif pays + numéro sans espaces).

## 🛠️ Technologies

- **React 18.3.1** — Framework JavaScript
- **Vite 6.0.7** — Build tool et serveur de développement
- **Lucide React 0.468.0** — Bibliothèque d'icônes
- **CSS pur** — Styling sans framework CSS

## 💰 Gestion des images

Les images des produits sont stockées dans le dossier `public/images/` et sont référencées dans `src/data/products.js` avec des chemins relatifs (`/images/produit-1.jpg`).

## 📱 Contact

- **Téléphone** : 96 12 34 56
- **Livraison** : 24-48h à Cotonou, 3-5 jours pour le reste du Bénin

## 📄 Licence

Ce projet est privé et destiné à un usage commercial.

---

Développé avec ❤️ pour les fêtes de fin d'année