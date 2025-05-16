import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { EditorComponent } from './editor.component';
import { EditorWindowComponent } from './editor-window/editor-window.component';
import { DialogModule } from '../dialog/dialog.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    DialogModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
  ],
  declarations: [
    EditorComponent,
    EditorWindowComponent,
  ],
  exports: [
    EditorComponent,
    EditorWindowComponent,
  ],
})
export class EditorModule { }
