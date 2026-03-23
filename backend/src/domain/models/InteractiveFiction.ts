import { InvalidFictionError } from "../applicationErrors";

export interface InteractiveFictionDTO {
  id?: number;
  title: string;
  description?: string;
  genre?: string;
  link: string;
  authorId?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InteractiveFiction {
  public readonly id?;
  public readonly title;
  public readonly description?;
  public readonly genre?;
  public readonly link;
  public readonly publishedAt?;
  public readonly authorId?;
  public readonly createdAt?;
  public readonly updatedAt?;

  constructor(fiction: InteractiveFictionDTO) {
    if (!fiction.title)
      throw new InvalidFictionError({ message: "This fiction needs a title" });

    if (fiction.title.length < 1)
      throw new InvalidFictionError({
        message: "This fiction needs a valid title",
      });

    if (!fiction.link)
      throw new InvalidFictionError({
        message: "This fiction needs a demo link",
      });

    if (!URL.canParse(fiction.link))
      throw new InvalidFictionError({
        message: "This fiction needs a valid demo link",
      });

    this.id = fiction.id;
    this.title = fiction.title;
    this.description = fiction.description;
    this.genre = fiction.genre;
    this.link = fiction.link;
    this.publishedAt = fiction.publishedAt;
    this.authorId = fiction.authorId;
    this.createdAt = fiction.createdAt;
    this.updatedAt = fiction.updatedAt;
  }
}
