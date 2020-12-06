export interface WriteUser {
  id: string;
  name: string;
  email: string;
  address: string;
  likeCount: number;
}

export interface ReadPublicUser {
  id: string;
  name: string;
  likeCount: number;
}

export interface ReadPrivateUser {
  id: string;
  email: string;
  address: string;
}
