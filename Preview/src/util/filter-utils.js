export function getUniqueValues(data, col) {
  const values = data.map((row) => {
    const val = col.fmt ? col.fmt(row[col.key]) : row[col.key];
    return String(val ?? ""); // Converte para string para facilitar comparação
  });
  return [...new Set(values)].sort();
}

export function applyFilters(data, cols, filterState) {
  // Se não houver filtros ativos, retorna os dados intocados
  if (!filterState || Object.keys(filterState).length === 0) return data;

  return data.filter((row) => {
    // A linha deve passar por TODOS os filtros de coluna ativos
    return Object.entries(filterState).every(([colKey, allowedValues]) => {
      // Se não tem restrição para esta coluna, passa
      if (!allowedValues || allowedValues.length === 0) return true;

      const col = cols.find((c) => c.key === colKey);
      if (!col) return true;

      const val = col.fmt ? col.fmt(row[col.key]) : row[col.key];
      const valStr = String(val ?? "");

      return allowedValues.includes(valStr);
    });
  });
}