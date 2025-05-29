import { _IdGenerator } from '@angular/cdk/a11y';
import {
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ProductGroupingType = 'GROUP' | 'SECTION' | 'SUBGROUP';

interface ProductGroupingNode {
  id: string;
  description: string;
  type: ProductGroupingType;
  children?: ProductGroupingNode[];
  parentId?: string;
  editing?: boolean;
}

@Component({
  selector: 'tree-flat-child-accessor-overview-example',
  templateUrl: 'tree-flat-child-accessor-overview-example.html',
  imports: [
    CommonModule,
    FormsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeFlatChildAccessorOverviewExample {
  protected consoleLog: any;

  @ViewChild('tree') treeControl: MatTree<ProductGroupingNode>;

  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _idGenerator = inject(_IdGenerator);

  public dataSource = signal<ProductGroupingNode[]>([]);

  childrenAccessor = (node: ProductGroupingNode) => node.children ?? [];

  hasPotentialChild = (_: number, node: ProductGroupingNode) =>
    node.type !== 'SUBGROUP';

  public addSection(): void {
    const newNode: ProductGroupingNode = {
      id: this._idGenerator.getId('SECTION-'),
      description: 'Nova seção',
      type: 'SECTION',
      editing: true,
      children: [],
    };

    this.dataSource.set([...this.dataSource(), newNode]);

    this._changeDetectorRef.detectChanges();
  }

  public addProductGrouping(parent: ProductGroupingNode): void {
    const newType: ProductGroupingType =
      parent.type === 'SECTION' ? 'GROUP' : 'SUBGROUP';
    const newDescription: string =
      parent.type === 'SECTION' ? 'Novo grupo' : 'Novo subgrupo';

    const newNode: ProductGroupingNode = {
      id: this._idGenerator.getId(`${newType}-`),
      description: newDescription,
      type: newType,
      editing: true,
      parentId: parent.id,
    };
    parent.children = parent.children ?? [];
    parent.children.push(newNode);

    if (!this.treeControl.isExpanded(parent)) {
      this.treeControl.expand(parent);
    }

    this.dataSource.set([...this.dataSource()]);

    this._changeDetectorRef.detectChanges();
  }

  public editProductGrouping(node: ProductGroupingNode): void {}

  public removeProductGrouping(node: ProductGroupingNode): void {
    this.dataSource.update((data) => {
      const newData = [...data];

      if (node.type === 'SECTION') {
        const index = newData.findIndex((section) => section.id === node.id);
        if (index >= 0) {
          newData.splice(index, 1);
        }
      } else if (node.type === 'GROUP') {
        for (const section of newData) {
          const groupIndex =
            section.children?.findIndex((group) => group.id === node.id) ?? -1;
          if (groupIndex >= 0) {
            section.children!.splice(groupIndex, 1);
            break;
          }
        }
      } else if (node.type === 'SUBGROUP') {
        for (const section of newData) {
          const group = section.children?.find(
            (group) => group.id === node.parentId
          );
          if (group && group.children) {
            const subGroupIndex = group.children.findIndex(
              (sub) => sub.id === node.id
            );
            if (subGroupIndex >= 0) {
              group.children.splice(subGroupIndex, 1);
              break;
            }
          }
        }
      }

      return newData;
    });

    this._changeDetectorRef.detectChanges();
  }

  public toggleEditingNode(node: ProductGroupingNode) {
    node.editing = !node.editing;
    this._changeDetectorRef.detectChanges();
  }
}
