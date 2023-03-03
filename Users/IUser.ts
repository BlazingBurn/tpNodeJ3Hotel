import joi from 'joi';
import { Password } from '../services/hashService';

export const userSchema = joi.object({
    nom: joi.string().alphanum(),
    prenom: joi.string().alphanum(),
    role: joi.string(),
    password: joi.string(),
    email: joi.string(),
})

interface IUser {
    id: number;
    nom: string;
    prenom: string;
    role: 'admin' | 'employé' | 'client';
    password: Password;
    email: string;
}

export const removePassword = (user: any) => {
    const { password, ...userWithoutPassword } = user
  
    return userWithoutPassword
}

export default IUser