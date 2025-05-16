import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';


import { AuditFieldsComponent } from './audit-fields/audit-fields.component';
import { AuditHistoryComponent } from './audit-history/audit-history.component';
import { AuditHistoryLinkComponent } from './audit-history-link/audit-history-link.component';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AuditFieldsComponent,
    AuditHistoryComponent,
    AuditHistoryLinkComponent
  ],
  exports: [
    AuditFieldsComponent,
    AuditHistoryComponent,
    AuditHistoryLinkComponent
  ],
  imports: [SharedModule, MatButtonModule, MatTableModule, MatIconModule]
})
export class AuditModule { }
