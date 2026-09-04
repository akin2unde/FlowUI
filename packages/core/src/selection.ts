import type { TreeModel } from "./contracts";

export type SelectionValue = string | number;

export function flattenTree(nodes: TreeModel[]): TreeModel[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);
}

export function enabledSelectableDescendants(node: TreeModel): TreeModel[] {
  const children = node.children ?? [];
  if (!children.length) {
    return !node.disabled && node.selectable !== false ? [node] : [];
  }

  return children.flatMap(enabledSelectableDescendants);
}

export function filterTree(nodes: TreeModel[], query: string): TreeModel[] {
  const search = query.trim().toLowerCase();
  if (!search) return nodes;

  return nodes.flatMap((node) => {
    const children = filterTree(node.children ?? [], query);
    const matches = String(node.display).toLowerCase().includes(search);
    return matches || children.length ? [{ ...node, children }] : [];
  });
}

export function selectedTreeModels(
  nodes: TreeModel[],
  values: SelectionValue[],
): TreeModel[] {
  const selected = new Set(values);
  return flattenTree(nodes).filter((node) => selected.has(node.value));
}
