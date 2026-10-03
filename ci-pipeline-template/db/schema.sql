CREATE TABLE IF NOT EXISTS pedidos (
  id          bigserial PRIMARY KEY,
  cliente     text        NOT NULL,
  total_cents integer     NOT NULL CHECK (total_cents >= 0),
  criado_em   timestamptz NOT NULL DEFAULT now()
);
