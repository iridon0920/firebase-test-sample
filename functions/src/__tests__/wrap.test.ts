import * as firebase from "@firebase/rules-unit-testing";
import functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import { onCreateUser } from "../onCreateUser";
import { ReadPrivateUser, ReadPublicUser, User } from "../dto/user";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const projectId = "playground-f8a4d";
const firestore = admin.initializeApp({ projectId }).firestore();
process.env.GCLOUD_PROJECT = projectId;

const testEnv = functions();
let wrapped: any;

const uid = "1";
const userRef = firestore.collection("users").doc(uid);
const privateUserRef = firestore.collection("read_private_users").doc(uid);
const publicUserRef = firestore.collection("read_public_users").doc(uid);

describe("ユーザ書き込み", () => {
  beforeAll(() => {
    wrapped = testEnv.wrap(onCreateUser);
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  test("ユーザ作成時、公開用/非公開用の読み込み用ユーザが作成される", async () => {
    const user: User = {
      id: uid,
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

    await userRef.set(user);
    const snapshot = await userRef.get();
    const context = {
      params: {
        uid,
      },
    };
    await wrapped(snapshot, context);

    const privateUserSnapshot = await privateUserRef.get();
    const privateUserData = privateUserSnapshot.data() as ReadPrivateUser;
    expect(privateUserData).toEqual(expectPrivateUser);

    const publicUserSnapshot = await publicUserRef.get();
    const publicUserData = publicUserSnapshot.data() as ReadPublicUser;
    expect(publicUserData).toEqual(expectPublicUser);
  });
});
