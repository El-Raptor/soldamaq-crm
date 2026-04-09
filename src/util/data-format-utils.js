/* ── Formatadores ── */
export function fmtBRL(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const fmtDhBaixa = (value) => {
    if (!value) {
        return `<span class="pill pill-danger">Pagamento Pendente</span>`;
    }
    return `<span class="pill pill-success">${fmtDate(value)}</span>`;
};

export const fmtDiasAtraso = (value, decimals, row) => {
    const dias = parseInt(value, 10);
    const absDias = Math.abs(dias);
    
    // Se DHBAIXA for nulo ou vazio (Ainda não pagou)
    if (!row.DHBAIXA) {
        if (dias < 0) {
            return `<span class="pill pill-warning">Vence em ${absDias} dias</span>`;
        } else if (dias > 0) {
            return `<span class="pill pill-danger">${absDias} dias em atraso</span>`;
        } else {
            return `<span class="pill pill-warning">Vence hoje</span>`;
        }
    } 
    // Se tem DHBAIXA (Já pagou)
    else {
        if (dias < 0) {
            return `<span class="pill pill-success">Pago ${absDias} dias antes</span>`;
        } else if (dias > 0) {
            return `<span class="pill pill-danger">Pago ${absDias} dias atrasado</span>`;
        } else {
            return `<span class="pill pill-success">Pago no prazo</span>`;
        }
    }
};

export function fmtPct(value) {
  const n = parseFloat(value);
  if (value == null || value === "" || isNaN(n)) return "—";
  return n.toFixed(3).replace(".", ",") + "%";
}

export function fmtDate(value) {
  if (!value) return "—";

  if (typeof value === "string") {
    // Se a data já veio com barras (ex: "26/04/2026 14:30:00.000")
    // O split(" ") separa pelo espaço em branco e o [0] pega só a data.
    if (value.includes("/")) {
      return value.split(" ")[0]; 
    }

    // Fallback: caso o banco devolva em formato ISO ("2026-04-26T14:30:00")
    const dateObj = new Date(value);
    if (!isNaN(dateObj)) {
      return dateObj.toLocaleDateString("pt-BR");
    }
  }

  // Se o valor já for um objeto Date do JavaScript
  if (value instanceof Date) {
    return value.toLocaleDateString("pt-BR");
  }

  return "—";
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
