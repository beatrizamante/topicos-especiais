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

describe('GET /users/me', () => {
  it('200 - deve retornar o usuário autenticado', async () => {
    const token = await registerAndGetToken(
      'Beatriz',
      'beatriz@email.com',
      'senha123',
    );

    const res = await app.inject({
      method: 'GET',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(body).toMatchObject({ name: 'Beatriz', email: 'beatriz@email.com' });
    expect(body).not.toHaveProperty('password');
  });

  it('401 - deve rejeitar requisição sem token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/users/me',
    });

    expect(res.statusCode).toBe(401);
  });
});

describe('PATCH /users/me', () => {
  it('200 - deve atualizar o perfil do usuário autenticado', async () => {
    const token = await registerAndGetToken(
      'Beatriz',
      'beatriz@email.com',
      'senha123',
    );

    const res = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Beatriz Atualizada' },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body) as Record<string, unknown>).toMatchObject({
      name: 'Beatriz Atualizada',
    });
  });

  it('401 - deve rejeitar atualização sem token', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      payload: { name: 'Qualquer' },
    });

    expect(res.statusCode).toBe(401);
  });
});
