import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ReadPrivateUser, ReadPublicUser, User } from "../dto/user";

export const onCreateUser = functions
  .region("asia-northeast1")
  .firestore.document("users/{uid}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const user: User = {
      id: context.params.uid,
      name: data.name,
      email: data.email,
      address: data.address,
      likeCount: data.likeCount,
    };

    return admin
      .firestore()
      .runTransaction(async (transaction) => {
        const privateUser: ReadPrivateUser = {
          id: user.id,
          email: user.email,
          address: user.address,
        };
        await transaction.set(
          admin.firestore().collection("read_private_users").doc(user.id),
          privateUser
        );

        const publicUser: ReadPublicUser = {
          id: user.id,
          name: user.name,
          likeCount: user.likeCount,
        };
        await transaction.set(
          admin.firestore().collection("read_public_users").doc(user.id),
          publicUser
        );
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  });
