import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { WidgetComponent } from './widget/widget.component';
import { WidgetsMenuComponent } from './widgets-menu/widgets-menu.component';

@NgModule({
  declarations: [
    WidgetComponent,
    WidgetsMenuComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    WidgetComponent,
    WidgetsMenuComponent,
    DragDropModule
  ]
})
export class WidgetsModule { }
