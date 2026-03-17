export function sortData(data, key, direction) {
  // Se não houver direção, retorna os dados originais
  if (!direction) return data;

  return [...data].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    // Tratamento para valores nulos ou indefinidos
    if (valA === null || valA === undefined) valA = '';
    if (valB === null || valB === undefined) valB = '';

    // Ordenação para números
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    // Ordenação para strings (ordem alfabética)
    return direction === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}