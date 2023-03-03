# Sujet TP

Créer une API qui simule un système de gestion d'hôtel.
CRUD : chambres, utilisateurs, réservations

Il y a trois types d'utilisateurs : employé, client et admin.

### Sachant que :
Un admin seulement peut ajouter ou supprimer des chambres.

Un client peut uniquement créer ou annuler une réservation.

## Information supplémentaire :
- Un utilisateur répond à l’interface suivante:  
    nom : string
    prénom: string
    role: admin | employé | client

- Seul un admin peut créer un employé 
- Seul un employé peut créer un user

#### Le rôle est utilisé dans la session pour vérifier qu’un utilisateur a le droit de faire une requête

- Une chambre répond à l’interface suivante :
    numéro: number unique
    étage: number
    prix: number

#### Seul un admin peut créer ou modifier une chambre, mais tout le monde peut checker la liste des chambres

- Une route /chambres/:nb/available doit permettre de savoir si la chambre est disponible

- Une réservation doit répondre à l’interface suivante:
    id: nombre unique
    dateDebut: date
    dateFin: date
    prix: number
    cancelled : boolean (default = false)
    user: number correspondant à l'ID de l’utilisateur ayant réservé 
    chambre: number - numéro de la chambre louée

- Seul un client peut créer une réservation, ou l’annuler (pas en la supprimant, mais en mettant son champ cancelled a `true`
Lors de la création de la réservation, on doit vérifier que la chambre est disponible sur le créneau demandé.

#### Un utilisateur doit pouvoir estimer le prix que cela lui coûterait de réserver sur un créneau. Pour ça on fera une route /reservations/estimate qui renverra un prix sans créer de réservation.

## Comme nous n’avons pas encore vu les bases de données, les entités seront stockées pour le moment dans des listes, dans la mémoire.

# bonus: Votre hôtel est dans une station balnéaire. Gérer des prix fluctuants tels qu’ils sont diminués de 20% en période hivernale et augmentés de 20% en période estivale.