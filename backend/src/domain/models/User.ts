import { InvalidUserError } from "../applicationErrors";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class User {
  public readonly id?;
  public readonly name;
  public readonly email;
  public readonly password;

  constructor(user: UserDTO) {
    if (!user.name || !user.email || !user.password) {
      throw new InvalidUserError({
        message: "User needs a name",
      });
    }

    if (!user.email) {
      throw new InvalidUserError({
        message: "User needs an email",
      });
    }

    if (!user.password) {
      throw new InvalidUserError({
        message: "User needs a password",
      });
    }

    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }
}
