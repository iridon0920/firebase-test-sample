import * as admin from "firebase-admin";

admin.initializeApp();

export { onCreateUser } from "./functions/onCreateUser";
