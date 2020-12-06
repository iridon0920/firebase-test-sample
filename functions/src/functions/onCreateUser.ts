import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserFactory } from "../factory/userFactory";

export const onCreateUser = functions
  .region("asia-northeast1")
  .firestore.document("users/{uid}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const uid = context.params.uid;
    const factory = new UserFactory({
      id: uid,
      name: data.name,
      email: data.email,
      address: data.address,
      likeCount: data.likeCount,
    });

    return admin
      .firestore()
      .runTransaction(async (transaction) => {
        await transaction.set(
          admin.firestore().collection("read_private_users").doc(uid),
          factory.createPrivateUser()
        );

        await transaction.set(
          admin.firestore().collection("read_public_users").doc(uid),
          factory.createPublicUser()
        );
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  });
