import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';

import { PrismaService } from '../../src/prisma/prisma.service.js';
import { createE2eApp } from '../helpers/create-e2e-app.js';
import { cleanDb } from '../helpers/clean-db.js';

let app: NestFastifyApplication;
let prisma: PrismaService;

beforeAll(async () => {
  app = await createE2eApp();
  prisma = app.get(PrismaService);
});

afterEach(async () => {
  await cleanDb(prisma);
});

afterAll(() => app.close());

async function registerAndGetToken(
  name: string,
  email: string,
  password: string,
): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: { name, email, password },
  });
  return (JSON.parse(res.body) as { access_token: string }).access_token;
}

async function createFiction(token: string): Promise<number> {
  const res = await app.inject({
    method: 'POST',
    url: '/fiction',
    headers: { authorization: `Bearer ${token}` },
    payload: {
      title: 'Ficção Teste',
      link: 'https://exemplo.com/ficcao',
    },
  });
  return (JSON.parse(res.body) as { id: number }).id;
}

describe('POST /fictions/:fictionId/authors', () => {
  it('201 - deve adicionar autor a uma ficção', async () => {
    const token = await registerAndGetToken(
      'Beatriz',
      'beatriz@email.com',
      'senha123',
    );
    const fictionId = await createFiction(token);

    const res = await app.inject({
      method: 'POST',
      url: `/fictions/${fictionId}/authors`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Autor Colaborador', role: 'coauthor' },
    });

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body) as Record<string, unknown>).toMatchObject({
      name: 'Autor Colaborador',
      role: 'coauthor',
    });
  });

  it('401 - deve rejeitar adição de autor sem token', async () => {
    const token = await registerAndGetToken(
      'Beatriz',
      'beatriz@email.com',
      'senha123',
    );
    const fictionId = await createFiction(token);

    const res = await app.inject({
      method: 'POST',
      url: `/fictions/${fictionId}/authors`,
      payload: { name: 'Autor Colaborador', role: 'coauthor' },
    });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /fictions/:fictionId/authors', () => {
  it('200 - deve listar autores de uma ficção', async () => {
    const token = await registerAndGetToken(
      'Beatriz',
      'beatriz@email.com',
      'senha123',
    );
    const fictionId = await createFiction(token);

    const res = await app.inject({
      method: 'GET',
      url: `/fictions/${fictionId}/authors`,
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(res.body) as unknown[])).toBe(true);
  });
});
