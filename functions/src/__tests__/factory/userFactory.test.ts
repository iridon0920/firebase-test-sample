import { ReadPrivateUser, ReadPublicUser, WriteUser } from "../../dto/user";
import { UserFactory } from "../../factory/userFactory";

describe("ユーザデータ生成", () => {
  const user: WriteUser = {
    id: "test",
    name: "テストユーザ",
    email: "test@example.com",
    address: "Aichi Nagoya",
    likeCount: 10,
  };
  const factory = new UserFactory(user);

  test("非公開ユーザデータの生成", () => {
    const expectPrivateUser: ReadPrivateUser = {
      id: user.id,
      email: user.email,
      address: user.address,
    };

    expect(factory.createPrivateUser()).toEqual(expectPrivateUser);
  });

  test("公開ユーザデータの生成", () => {
    const expectPublicUser: ReadPublicUser = {
      id: user.id,
      name: user.name,
      likeCount: user.likeCount,
    };
    expect(factory.createPublicUser()).toEqual(expectPublicUser);
  });
});
