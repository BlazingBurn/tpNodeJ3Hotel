import express from "express";

const router = express.Router();

// Exemple de données stockées en mémoire
let chambres = [
  { numero: 1, etage: 1, prix: 100, disponible: true },
  { numero: 2, etage: 1, prix: 120, disponible: true },
  { numero: 3, etage: 2, prix: 150, disponible: true },
];

// Obtenir la liste des chambres
router.get('/', (req, res) => {
  res.json(chambres);
});

// Obtenir une chambre par son numéro
router.get('/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  const chambre = chambres.find(c => c.numero === numero);

  if (!chambre) {
    res.status(404).send('Chambre non trouvée');
  } else {
    res.json(chambre);
  }
});

// Ajouter une nouvelle chambre (admin seulement)
router.post('/', (req, res) => {
  const { numero, etage, prix } = req.body;
  const isAdmin = (req.session as any).user.role === 'admin';

  if (!isAdmin) {
    res.status(403).send('Seuls les administrateurs peuvent ajouter une chambre');
  } else if (chambres.some(c => c.numero === numero)) {
    res.status(400).send(`La chambre numéro ${numero} existe déjà`);
  } else {
    chambres.push({ numero, etage, prix, disponible:true });
    res.status(201).send('Chambre ajoutée avec succès');
  }
});

// Mettre à jour une chambre (admin seulement)
router.put('/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  const { etage, prix } = req.body;
  const isAdmin = (req.session as any).user.role === 'admin';

  if (!isAdmin) {
    res.status(403).send('Seuls les administrateurs peuvent modifier une chambre');
  } else {
    const chambreIndex = chambres.findIndex(c => c.numero === numero);

    if (chambreIndex === -1) {
      res.status(404).send('Chambre non trouvée');
    } else {
      chambres[chambreIndex].etage = etage ?? chambres[chambreIndex].etage;
      chambres[chambreIndex].prix = prix ?? chambres[chambreIndex].prix;
      res.status(200).send('Chambre mise à jour avec succès');
    }
  }
});

// Supprimer une chambre (admin seulement)
router.delete('/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  const isAdmin = (req.session as any).user.role === 'admin';

  if (!isAdmin) {
    res.status(403).send('Seuls les administrateurs peuvent supprimer une chambre');
  } else {
    const chambreIndex = chambres.findIndex(c => c.numero === numero);

    if (chambreIndex === -1) {
      res.status(404).send('Chambre non trouvée');
    } else {
      chambres.splice(chambreIndex, 1);
      res.status(200).send('Chambre supprimée avec succès');
    }
  }
});

module.exports = router;
export default router;