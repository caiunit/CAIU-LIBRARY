import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { FileUploadComponent } from './file-upload.component';
import { FileControlComponent } from './file-control/file-control.component';
import { FilePreviewComponent } from './file-preview/file-preview.component';
import { UploadComponent } from './upload/upload.component';
import { UploadsComponent } from './uploads/uploads.component';
import { SharedModule } from '../../shared/shared.module';
import { UploaderComponent } from './uploader/uploader.component';

@NgModule({
  imports: [
    SharedModule,
    DragDropModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    FileControlComponent,
    FileUploadComponent,
    FilePreviewComponent,
    UploadComponent,
    UploadsComponent,
    UploaderComponent
  ],
  exports: [
    FileControlComponent,
    FileUploadComponent,
    FilePreviewComponent,
    UploadComponent,
    UploadsComponent
  ]
})
export class FileUploadModule { }
