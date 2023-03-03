import joi from 'joi';

export const chambreSchema = joi.object({
    numero: joi.number(),
    etage: joi.number(),
    prix: joi.number()
})

interface IChambre {
    numero: number;
    etage: number;
    prix: number;
    disponible?: boolean;
}

export default IChambre