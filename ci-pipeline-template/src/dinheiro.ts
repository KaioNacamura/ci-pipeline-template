// Valores em dinheiro ficam em centavos (inteiro) para não sofrer
// com arredondamento de ponto flutuante: 0.1 + 0.2 !== 0.3.

export function paraCentavos(valor: string): number {
  const limpo = valor.trim().replace(/\./g, "").replace(",", ".");
  if (!/^-?\d+(\.\d{1,2})?$/.test(limpo)) {
    throw new Error(`Valor inválido: "${valor}"`);
  }
  const [inteiro, decimal = ""] = limpo.split(".");
  const negativo = inteiro!.startsWith("-");
  const centavos = Math.abs(Number(inteiro)) * 100 + Number(decimal.padEnd(2, "0"));
  return negativo ? -centavos : centavos;
}

export function formatarReais(centavos: number): string {
  if (!Number.isInteger(centavos)) {
    throw new Error("Centavos precisam ser inteiros");
  }
  const sinal = centavos < 0 ? "-" : "";
  const abs = Math.abs(centavos);
  const reais = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const resto = (abs % 100).toString().padStart(2, "0");
  return `${sinal}R$ ${reais},${resto}`;
}

export function dividirEmParcelas(totalCentavos: number, parcelas: number): number[] {
  if (!Number.isInteger(parcelas) || parcelas < 1) {
    throw new Error("Número de parcelas inválido");
  }
  const base = Math.floor(totalCentavos / parcelas);
  const sobra = totalCentavos - base * parcelas;
  // A sobra vai para as primeiras parcelas, um centavo em cada.
  return Array.from({ length: parcelas }, (_, i) => base + (i < sobra ? 1 : 0));
}
