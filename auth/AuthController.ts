import { Router } from 'express';
import { comparePassword } from '../services/hashService';
import IUser, { removePassword } from '../Users/IUser';
import { generateToken } from './authService';
import type ILoginDTO from '../Users/ILoginDTO';
import { loginSchema } from '../Users/ILoginDTO';

const router = Router()

export const users: Array<IUser> = [
    {
      id:1, 
      nom:"admin", 
      prenom:"admin", 
      role:"admin", 
      password:{
        salt:"19f7e5a4764f", 
        password:"df09bc7a6be1d13a7858f0771f66bcd54aa5f95c5b0eeb264f34a812dde70d9764976878821f8ce62d95b79da9555acc115d8eaa31482b78ca70ce464e6e6806"
      }, 
      email: "admin@ad.com"
    },
  ];

router.post('/login', (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error != null) {
    return res.status(400).json({ error: error.message })
  }

  const loginDTO = req.body as ILoginDTO

  const connectedUser = users.find(user => user.email === loginDTO.email);
  if ((connectedUser == null) || !comparePassword(loginDTO.password, connectedUser.password)) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const userWithToken = generateToken(connectedUser);
  const userWithoutToken = removePassword(userWithToken);
  (req.session as any).user = userWithoutToken;
  res.status(200).json(userWithoutToken);
})
  
// Route pour se déconnecter
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Erreur de déconnexion" });
      }
      res.clearCookie("user");
      res.json({ message: "Vous êtes maintenant déconnecté" });
    });
});

export default router