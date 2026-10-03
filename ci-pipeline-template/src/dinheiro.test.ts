import { describe, expect, it } from "vitest";
import { dividirEmParcelas, formatarReais, paraCentavos } from "./dinheiro.js";

describe("paraCentavos", () => {
  it("converte valores com vírgula e milhar", () => {
    expect(paraCentavos("1.234,56")).toBe(123456);
    expect(paraCentavos("0,1")).toBe(10);
    expect(paraCentavos("10")).toBe(1000);
    expect(paraCentavos("-2,50")).toBe(-250);
  });

  it("recusa texto que não é valor", () => {
    expect(() => paraCentavos("abc")).toThrow();
    expect(() => paraCentavos("1,234")).toThrow();
  });
});

describe("formatarReais", () => {
  it("formata com separador de milhar", () => {
    expect(formatarReais(123456789)).toBe("R$ 1.234.567,89");
    expect(formatarReais(5)).toBe("R$ 0,05");
    expect(formatarReais(-250)).toBe("-R$ 2,50");
  });

  it("recusa centavos quebrados", () => {
    expect(() => formatarReais(10.5)).toThrow();
  });
});

describe("dividirEmParcelas", () => {
  it("não perde nem cria centavo", () => {
    const parcelas = dividirEmParcelas(1000, 3);
    expect(parcelas).toEqual([334, 333, 333]);
    expect(parcelas.reduce((a, b) => a + b, 0)).toBe(1000);
  });
});
