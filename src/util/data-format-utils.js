/* ── Formatadores ── */
export function fmtBRL(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function fmtPct(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "—";
  return n.toFixed(3).replace(".", ",") + "%";
}

export function fmtDate(value) {
  if (!value) return "—";
  if (typeof value === "string") {
    return new Date(value).toLocaleDateString("pt-BR");
  }
  return value;
}

export function fmtCompact(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "0";

  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(".", ",") + " MI";
  } else if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(".", ",") + " MIL";
  }
  return n.toFixed(2).replace(".", ",");
}

export function fmtNumber(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "-";
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
