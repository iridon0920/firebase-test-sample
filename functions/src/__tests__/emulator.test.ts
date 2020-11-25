import * as firebase from "@firebase/rules-unit-testing";
import { ReadPublicUser, ReadPrivateUser, User } from "../dto/user";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const projectId = "playground-f8a4d";
const firestore = firebase.initializeAdminApp({ projectId }).firestore();
let unsubscribe: () => void;

describe("ユーザ書き込み", () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  afterEach(async () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  test("ユーザ作成時、公開用/非公開用の読み込み用ユーザが作成される", async () => {
    const user: User = {
      id: "test",
      name: "テストユーザ",
      email: "test@example.com",
      address: "Aichi Nagoya",
      likeCount: 10,
    };

    const expectPrivateUser: ReadPrivateUser = {
      id: user.id,
      email: user.email,
      address: user.address,
    };

    const expectPublicUser: ReadPublicUser = {
      id: user.id,
      name: user.name,
      likeCount: user.likeCount,
    };

    await firestore.collection("users").doc(user.id).set(user);

    await new Promise((resolve) => {
      unsubscribe = firestore
        .collection("read_private_users")
        .doc(user.id)
        .onSnapshot((snap) => {
          if (snap.exists) {
            expect(snap.data()).toEqual(expectPrivateUser);
            resolve();
          }
        });
    });
    unsubscribe();

    await new Promise((resolve) => {
      unsubscribe = firestore
        .collection("read_public_users")
        .doc(user.id)
        .onSnapshot((snap) => {
          if (snap.exists) {
            expect(snap.data()).toEqual(expectPublicUser);
            resolve();
          }
        });
    });
  });
});
