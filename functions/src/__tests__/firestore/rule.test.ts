import * as firebase from "@firebase/rules-unit-testing";
import { TokenOptions } from "@firebase/rules-unit-testing/dist/src/api";
import { readFileSync } from "fs";

const projectId = "rule-test";

function getAuthFirestore(auth: TokenOptions) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

describe("firestore セキュリティルールテスト", () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId,
      rules: readFileSync("../firestore.rules", "utf8"),
    });
  });

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  describe("ユーザ読み書きテスト", () => {
    test("usersのデータは、ユーザ本人のみ書き込み可能", async () => {
      const firestore = getAuthFirestore({ uid: "user" });
      const ref = firestore.collection("users").doc("user");
      await firebase.assertSucceeds(ref.set({ name: "サンプル" }));

      const otherUserRef = firestore.collection("users").doc("userB");
      await firebase.assertFails(otherUserRef.set({ name: "サンプル" }));
    });

    test("read_private_usersのデータは、ユーザ本人のみ読み込み可能", async () => {
      const firestore = getAuthFirestore({ uid: "user" });
      const ref = firestore.collection("read_private_users").doc("user");
      await firebase.assertSucceeds(ref.get());

      const otherUserRef = firestore
        .collection("read_private_users")
        .doc("userB");
      await firebase.assertFails(otherUserRef.get());
    });

    test("read_public_usersのデータは、認証済ユーザは誰でも閲覧可能", async () => {
      const firestore = getAuthFirestore({ uid: "user" });
      const ref = firestore.collection("read_public_users").doc("user");
      await firebase.assertSucceeds(ref.get());

      const otherUserRef = firestore
        .collection("read_public_users")
        .doc("userB");
      await firebase.assertSucceeds(otherUserRef.get());
    });
  });
});
