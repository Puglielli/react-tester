export interface ExpandedProps {
  id: string;
  enabled: boolean;
}

export function expandedPanel(
  panels: Array<ExpandedProps>,
  id: string,
  expand?: boolean
) {
  const index = panels.findIndex((item) => item.id === id);
  const newExpended = [...panels];

  newExpended[index].enabled = expand ?? !newExpended[index].enabled;

  return newExpended;
}
