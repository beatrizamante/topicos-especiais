import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fictionId: number, dto: CreateAuthorDto, userId: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id: fictionId },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    if (fiction.authorId !== userId) {
      throw new ForbiddenException(
        'Apenas o autor da ficção pode vincular escritores',
      );
    }

    return this.prisma.author.create({
      data: {
        name: dto.name,
        role: dto.role,
        fictionId,
      },
    });
  }

  async findAll(fictionId: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id: fictionId },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    return this.prisma.author.findMany({
      where: { fictionId },
    });
  }

  async remove(fictionId: number, id: number, userId: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id: fictionId },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    if (fiction.authorId !== userId) {
      throw new ForbiddenException(
        'Apenas o autor da ficção pode remover escritores',
      );
    }

    const author = await this.prisma.author.findFirst({
      where: { id, fictionId },
    });

    if (!author) {
      throw new NotFoundException('Escritor não encontrado');
    }

    return this.prisma.author.delete({ where: { id } });
  }
}
