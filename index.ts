import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cookieParser from "cookie-parser"
import { jwt } from './auth/authMiddleware'
import authRouter from './auth/AuthController'
import dotenv from 'dotenv'
import errorHandler from './error/errorsMiddleware'
import expressSession from "express-session"
import usersRouter from "./Users/UserController"
import reservationRouter from "./Reservation/ReservationController"
import chambreRouter from "./Chambre/ChambreController"

// import { Session, SessionData } from 'express-session';
// // Étendre l'interface `SessionData`
// declare module 'express-session' {
//   interface SessionData {
//     // user?: {
//     //     id: number;
//     //     role: string;
//     // }
//   }
// }

// // Utilisez l'interface `Session` avec la propriété `role`
// interface CustomRequest extends Request {
//   session: Session & Partial<SessionData>;
// }

const port = 3000;
const app = express();
app.use(express.json())
dotenv.config()

app.use(jwt());
app.use(errorHandler);
const upload = multer();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSession({secret: "secret", resave: true, saveUninitialized: true}))
app.use(upload.array("filename"))


// middleware pour vérifier le rôle de l'utilisateur
function checkRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.body.user.role !== role) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    };
}

app.use("/users", usersRouter)
app.use("/auth", authRouter)
app.use("/reservations", reservationRouter)
app.use("/chambre", chambreRouter)

app.listen(port)