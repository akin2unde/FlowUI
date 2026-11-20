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

export function treeCheckState(
  node: TreeModel,
  selected: ReadonlySet<SelectionValue>,
): boolean | "mixed" {
  const leaves = enabledSelectableDescendants(node);
  const checked = leaves.filter((leaf) => selected.has(leaf.value)).length;
  if (!checked) return false;
  return checked === leaves.length ? true : "mixed";
}

export function toggleTreeCheck(
  node: TreeModel,
  values: readonly SelectionValue[],
): SelectionValue[] {
  const selected = new Set(values);
  if (node.disabled || node.selectable === false) return [...selected];
  const remove = treeCheckState(node, selected) === true;
  for (const leaf of enabledSelectableDescendants(node)) {
    if (remove) selected.delete(leaf.value);
    else selected.add(leaf.value);
  }
  return [...selected];
}
