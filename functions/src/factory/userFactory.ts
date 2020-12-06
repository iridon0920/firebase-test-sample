import { WriteUser, ReadPublicUser, ReadPrivateUser } from "../dto/user";

export class UserFactory {
  private user: WriteUser;

  constructor(writeUser: WriteUser) {
    this.user = writeUser;
  }

  createPublicUser(): ReadPublicUser {
    const publicUser: ReadPublicUser = {
      id: this.user.id,
      name: this.user.name,
      likeCount: this.user.likeCount,
    };
    return publicUser;
  }

  createPrivateUser(): ReadPrivateUser {
    const privateUser: ReadPrivateUser = {
      id: this.user.id,
      email: this.user.email,
      address: this.user.address,
    };
    return privateUser;
  }
}
