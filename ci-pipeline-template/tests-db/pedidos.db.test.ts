import { readFile } from "node:fs/promises";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Este teste roda contra um PostgreSQL de verdade.
// No CI o banco sobe como "service" do GitHub Actions.
const url = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/ci_test";
const client = new pg.Client({ connectionString: url });

beforeAll(async () => {
  await client.connect();
  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  await client.query(schema);
  await client.query("TRUNCATE pedidos");
});

afterAll(async () => {
  await client.end();
});

describe("tabela pedidos", () => {
  it("grava e lê um pedido", async () => {
    await client.query("INSERT INTO pedidos (cliente, total_cents) VALUES ($1, $2)", ["Ana", 4990]);
    const { rows } = await client.query("SELECT cliente, total_cents FROM pedidos");
    expect(rows).toEqual([{ cliente: "Ana", total_cents: 4990 }]);
  });

  it("o banco recusa total negativo", async () => {
    await expect(
      client.query("INSERT INTO pedidos (cliente, total_cents) VALUES ($1, $2)", ["Bia", -1]),
    ).rejects.toThrow(/check constraint/);
  });
});
