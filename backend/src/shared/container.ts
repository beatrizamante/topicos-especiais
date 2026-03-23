import { makeServer } from "../interface/http/server";

export function bootstrap(): void {
  const app = makeServer();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger docs em http://localhost:${PORT}/api/docs`);
  });
}
