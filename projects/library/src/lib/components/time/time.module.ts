import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { DateTimeControlComponent } from './datetime-control/datetime-control.component';
import { TimeControlComponent } from './time-control/time-control.component';
import { FormsModule } from '../../forms/forms.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DateTimeControlComponent, TimeControlComponent],
  imports: [SharedModule, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  exports: [DateTimeControlComponent, TimeControlComponent]
})
export class TimeModule {}
