export async function ajustarLayout() {
  const idGadget = 707; // ID do Componente BI -- 623 o original
    try {
    await JSK.removerFrame({
      paginaInicial: "index.jsp",
      nuGdt: idGadget,
    });
    console.log("Layout ajustado (Frame removido).");
  } catch (error) {

  }
}
