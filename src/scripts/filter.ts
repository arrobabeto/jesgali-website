export type FilterOptions = {
  /** Selector de las tarjetas filtrables, p. ej. '.post-card' o '.vacante-row'. */
  cardSelector: string;
  /** Atributos data-* (sin el prefijo) contra los que se compara el filtro, p. ej. ['area','tipo'] o ['categoria']. */
  matchAttrs: string[];
  /** Selector de los botones de filtro. Default '.filter-btn'. */
  buttonSelector?: string;
  /** Id del bloque "sin resultados". Default 'no-results'. */
  noResultsId?: string;
};

/**
 * Filtrado progresivo y sin dependencias para listados editoriales.
 * Muestra/oculta tarjetas según el atributo data-filter del botón pulsado,
 * marca el botón activo y alterna el bloque de "sin resultados".
 */
export function initFilter({
  cardSelector,
  matchAttrs,
  buttonSelector = '.filter-btn',
  noResultsId = 'no-results',
}: FilterOptions): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(buttonSelector);
  const cards = document.querySelectorAll<HTMLElement>(cardSelector);
  const noResults = document.getElementById(noResultsId);

  if (buttons.length === 0 || cards.length === 0) return;

  const applyFilter = (filter: string) => {
    let visible = 0;

    cards.forEach(card => {
      const match =
        filter === 'all' || matchAttrs.some(attr => card.getAttribute(`data-${attr}`) === filter);
      card.style.display = match ? '' : 'none';
      if (match) visible += 1;
    });

    if (noResults) noResults.style.display = visible > 0 ? 'none' : 'block';

    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
  });
}
