import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import type { TooltipLocation, TreeModel } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-variant]="variant"
    >
      <header *ngIf="header" class="fui-card-header">
        <ng-container [ngTemplateOutlet]="header" />
      </header>

      <div class="fui-card-body">
        <ng-content />
      </div>

      <footer *ngIf="footer" class="fui-card-footer">
        <ng-container [ngTemplateOutlet]="footer" />
      </footer>
    </article>
  `,
})
export class FlowCardComponent extends FlowComponentBase {
  @Input() header?: TemplateRef<unknown>;
  @Input() footer?: TemplateRef<unknown>;
  @Input() variant: "outline" | "elevated" | "filled" = "outline";

  view = () => this.resolved("fui-card");
}

@Component({
  selector: "fui-slider",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-slider"
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value"
        [name]="name ?? ''"
        [disabled]="disabled"
        (input)="valueChange.emit(+$any($event.target).value)"
      />
      <output *ngIf="showValue" class="fui-slider-value">
        {{ value }}
      </output>
    </div>
  `,
})
export class FlowSliderComponent extends FlowComponentBase {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() value = 0;
  @Input() name?: string;
  @Input() disabled = false;
  @Input() showValue = true;

  @Output() valueChange = new EventEmitter<number>();

  view = () => this.resolved("fui-slider-wrap");
}

@Component({
  selector: "fui-switch",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-switch-input"
        type="checkbox"
        role="switch"
        [checked]="checked"
        [name]="name ?? ''"
        [disabled]="disabled"
        (change)="checkedChange.emit($any($event.target).checked)"
      />
      <span class="fui-switch-track" aria-hidden="true">
        <span class="fui-switch-thumb"></span>
      </span>
      <span *ngIf="label">{{ label }}</span>
    </label>
  `,
})
export class FlowSwitchComponent extends FlowComponentBase {
  @Input() checked = false;
  @Input() label?: string;
  @Input() name?: string;
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  view = () => this.resolved("fui-switch-label");
}

interface VisibleTreeNode {
  node: TreeModel;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

@Component({
  selector: "fui-tree",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <ul [class]="view().className" [ngStyle]="view().style" role="tree">
      <li
        *ngFor="let item of visibleNodes"
        class="fui-tree-item"
        role="treeitem"
        [attr.aria-expanded]="item.hasChildren ? item.expanded : null"
      >
        <div
          class="fui-tree-row"
          [class.fui-tree-row-selected]="value === item.node.value"
          [style.padding-left.rem]="item.depth"
        >
          <button
            class="fui-tree-toggle"
            type="button"
            [disabled]="!item.hasChildren"
            [attr.aria-label]="item.expanded ? 'Collapse' : 'Expand'"
            (click)="toggle(item.node.value)"
          >
            <fui-icon
              *ngIf="item.hasChildren"
              [icon]="
                'fa-solid fa-chevron-' + (item.expanded ? 'down' : 'right')
              "
            />
          </button>

          <button
            class="fui-tree-select"
            type="button"
            (click)="selected.emit(item.node)"
          >
            {{ item.node.display }}
          </button>
        </div>
      </li>
    </ul>
  `,
})
export class FlowTreeComponent extends FlowComponentBase {
  @Input() nodes: TreeModel[] = [];
  @Input() value?: string | number;
  @Input() defaultExpanded = false;

  @Output() selected = new EventEmitter<TreeModel>();

  private readonly expanded = new Set<string | number>();
  private initialized = false;

  get visibleNodes(): VisibleTreeNode[] {
    if (!this.initialized && this.defaultExpanded) {
      for (const node of this.nodes) {
        this.expanded.add(node.value);
      }
      this.initialized = true;
    }

    const result: VisibleTreeNode[] = [];

    const visit = (nodes: TreeModel[], depth: number): void => {
      for (const node of nodes) {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = this.expanded.has(node.value);

        result.push({
          node,
          depth,
          hasChildren,
          expanded: isExpanded,
        });

        if (hasChildren && isExpanded) {
          visit(node.children ?? [], depth + 1);
        }
      }
    };

    visit(this.nodes, 0);
    return result;
  }

  toggle(value: string | number): void {
    if (this.expanded.has(value)) {
      this.expanded.delete(value);
    } else {
      this.expanded.add(value);
    }
  }

  view = () => this.resolved("fui-tree fui-tree-view");
}

@Component({
  selector: "fui-tooltip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-location]="location"
    >
      <ng-content />
      <span class="fui-tooltip-content" role="tooltip">
        {{ text }}
      </span>
    </span>
  `,
})
export class FlowTooltipComponent extends FlowComponentBase {
  @Input({ required: true }) text!: string;
  @Input() location: TooltipLocation = "top";
  @Input() delay = 150;

  view = () => {
    const resolved = this.resolved("fui-tooltip");
    resolved.style["--fui-tooltip-delay"] = `${this.delay}ms`;
    return resolved;
  };
}
