import express from "express";
import IReservation from "./IReservation";

const router = express.Router();

const reservations: Array<IReservation> = [];

// CREATE a new reservation
router.post('/', (req, res) => {
  const { dateDebut, dateFin, prix, user, chambre } = req.body;

  // Check if the room is available for the selected dates
  const available = isRoomAvailable(chambre, dateDebut, dateFin);

  if (!available) {
    return res.status(400).send('Room not available for the selected dates');
  }

  const id = reservations.length + 1;
  const cancelled = false;
  const prixTotal = calculatePrice(chambre, dateDebut, dateFin, prix);
  const reservation = { id, dateDebut, dateFin, prix: prixTotal, cancelled, user, chambre };
  reservations.push(reservation);
  chambre.disponible = false;
  res.status(201).send(reservation);
});

// GET the price of a new reservation
router.get('/price', (req, res) => {
  const { dateDebut, dateFin, prix, user, chambre } = req.body;

  // Check if the room is available for the selected dates
  const available = isRoomAvailable(chambre, dateDebut, dateFin);

  if (!available) {
    return res.status(400).send('Room not available for the selected dates');
  }

  const prixTotal = calculatePrice(chambre, dateDebut, dateFin, prix);
  const reservation = { dateDebut, dateFin, prix: prixTotal, chambre };
  res.status(200).send(reservation);
});

// READ all reservations
router.get('/', (req, res) => {
  res.send(reservations);
});

// READ a specific reservation by ID
router.get('/:id', (req, res) => {
  const reservation = reservations.find(r => r.id === parseInt(req.params.id));
  if (!reservation) {
    return res.status(404).send('Reservation not found');
  }
  res.send(reservation);
});

// UPDATE a reservation
router.patch('/:id', (req, res) => {
  const reservation = reservations.find(r => r.id === parseInt(req.params.id));
  if (!reservation) {
    return res.status(404).send('Reservation not found');
  }
  const { dateDebut, dateFin, prix, cancelled } = req.body;
  if (dateDebut) {
    reservation.dateDebut = dateDebut;
  }
  if (dateFin) {
    reservation.dateFin = dateFin;
  }
  if (prix) {
    reservation.prix = prix;
  }
  if (cancelled !== undefined) {
    reservation.cancelled = cancelled;
  }
  res.send(reservation);
});

// DELETE a reservation
router.delete('/:id', (req, res) => {
  const index = reservations.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send('Reservation not found');
  }
  reservations.splice(index, 1);
  res.sendStatus(204);
});

// function pour verifier si une chambre est libre dans les selected dates
function isRoomAvailable(chambre: number, dateDebut: Date, dateFin: Date) {
  const reservationsForRoom = reservations.filter(r => r.chambre === chambre);
  for (const r of reservationsForRoom) {
    if (!(dateDebut >= r.dateFin || dateFin <= r.dateDebut)) {
      return false;
    }
  }
  return true;
}

function calculatePrice(chambre: number, dateDebut: Date, dateFin: Date, prix: number): number {
    
    const reservationsForRoom = reservations.filter(r => r.chambre === chambre);
  
    // Vérifier la saison et ajuster le prix si nécessaire
    const month = dateDebut.getMonth();
    if (month >= 5 && month <= 8) { // mois d'été
      prix *= 1.2; // augmentation de 20% du prix
    } else if (month <= 2 || month >= 11) { // mois d'hiver
      prix *= 0.8; // diminution de 20% du prix
    }
  
    return prix;
}

module.exports = router;
export default router;
