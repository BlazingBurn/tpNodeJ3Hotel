import express from "express";
import IUser, {userSchema, removePassword } from "./IUser";
import { users } from "../auth/AuthController";

const router = express.Router();

// // Route pour se connecter
// router.post('/login', (req, res) => {
//   const { nom, prenom, password, email } = req.body;

//   // Vérifier si l'utilisateur existe dans la base de données
//   const user = users.find(user => user.nom === nom && user.prenom === prenom);

//   if (!user) {
//   return res.status(400).json({ message: "L'email ou le mot de passe est incorrect" });
//   }

//   // Stocker les informations d'identification de l'utilisateur dans la session
//   (req.session as any).user = user;

//   res.json({ message: "Vous êtes maintenant connecté" });
// });

// // Route pour se déconnecter
// router.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       return res.status(500).json({ message: "Erreur de déconnexion" });
//     }
//     res.clearCookie("user");
//     res.json({ message: "Vous êtes maintenant déconnecté" });
//   });
// });

// Middleware pour vérifier si l'utilisateur est authentifié
router.use((req, res, next) => {

  // (req.session as any).user = connectedUser;
  if (!(req.session as any).user || !(req.session as any).user.id) {
    return res.status(401).json({ message: "Vous devez vous connecter pour accéder à cette ressource" });
  }
  next();
});

// Route pour créer un utilisateur
router.post('/', (req, res) => {
  const { nom, prenom, role, password, email } = req.body;
  
  // Vérifier que l'utilisateur a le droit de créer un utilisateur
  if ((req.session as any).role === 'employe' && role !== 'client') {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation de créer un utilisateur" });
  }

  // Vérifier que l'utilisateur a le droit de créer un utilisateur
  if ((req.session as any).user.role !== "admin" && (role !== "employe" || role !== "client")) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation de créer un utilisateur" });
  }

  // Vérifier que le rôle est valide
  if (!['admin', 'employe', 'client'].includes(role)) {
    return res.status(400).json({ message: "Le rôle doit être admin, employe ou client" });
  }

  // Créer l'utilisateur
  const user = {
    id: users.length + 1,
    nom,
    prenom,
    role,
    password, email
  };

  // Ajouter l'utilisateur à la liste
  users.push(user);

  res.status(201).json(user);
});

// Route pour récupérer tous les utilisateurs
router.get('/', (req, res) => {
  res.json(removePassword(users.map((user) => removePassword(user))));
});

// Route pour récupérer un utilisateur par ID
router.get('/:id', (req, res) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  res.status(200).json(user);
});

// Route pour mettre à jour un utilisateur
router.put('/:id', (req, res) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  // Vérifier que l'utilisateur a le droit de mettre à jour un utilisateur
  if ((req.session as any).role === 'employe' && (req.session as any).id.toString() !== user.id.toString()) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation de mettre à jour cet utilisateur" });
  }

  if ((req.session as any).role !== 'admin' && (req.session as any).id.toString() !== user.id.toString()) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation de mettre à jour cet utilisateur" });
  }

  // Mettre à jour les champs spécifiés
  if (req.body.nom) {
    user.nom = req.body.nom;
  }
  if (req.body.prenom) {
    user.prenom = req.body.prenom;
  }
  if (req.body.role) {
    user.role = req.body.role;
  }

  res.json(user);
});

// Route pour supprimer un utilisateur
router.delete('/:id', (req, res) => {
  const index = users.findIndex(user => user.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  // Vérifier que l'utilisateur a le droit de supprimer un utilisateur
  if ((req.session as any).user.role !== 'admin' && (req.session as any).id.toString() !== users[index].id.toString()) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation de supprimer cet utilisateur" });
  }

  users.splice(index, 1);

  res.json({ message: "Utilisateur supprimé" });
});

module.exports = router;
export default router;