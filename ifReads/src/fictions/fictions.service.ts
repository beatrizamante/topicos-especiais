import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFictionDto } from './dto/create-fiction.dto.js';
import { UpdateFictionDto } from './dto/update-fiction.dto.js';

@Injectable()
export class FictionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFictionDto, authorId: number) {
    return this.prisma.fiction.create({
      data: {
        ...dto,
        authorId,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.fiction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true },
          },
          authors: true,
        },
      }),
      this.prisma.fiction.count(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        authors: true,
        reviews: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    return fiction;
  }

  async update(id: number, dto: UpdateFictionDto, userId: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    if (fiction.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode editar esta ficção');
    }

    return this.prisma.fiction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const fiction = await this.prisma.fiction.findUnique({
      where: { id },
    });

    if (!fiction) {
      throw new NotFoundException('Ficção não encontrada');
    }

    if (fiction.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode excluir esta ficção');
    }

    return this.prisma.fiction.delete({ where: { id } });
  }
}
