import joi from 'joi';

export const reservationSchema = joi.object({
    numero: joi.number(),
    etage: joi.number(),
    prix: joi.number()
})

interface IReservation {
    id: number; // unique
    dateDebut: Date;
    dateFin: Date;
    prix: number;
    cancelled : boolean; // (default = false)
    user: number; // correspondant à l'ID de l’utilisateur ayant réservé 
    chambre: number; // numéro de la chambre louée
}

export default IReservation