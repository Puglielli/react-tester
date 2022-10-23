export interface Panel {
  id: string;
  enabled: boolean;
}

export function setPanelExpand(
  panels: Array<Panel>,
  id: string,
  expand: boolean | undefined,
  setPanels: (state: Array<Panel>) => void
): void {
  const index = panels.findIndex((item) => item.id === id);
  const newPanels = [...panels];

  newPanels[index].enabled = expand ?? !newPanels[index].enabled;

  setPanels(newPanels);
}
