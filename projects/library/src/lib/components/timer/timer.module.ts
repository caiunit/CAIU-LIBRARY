import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { TimerComponent } from './timer.component';
import { TimerPipe } from './timer.pipe';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MatButtonModule
  ],
  declarations: [
    TimerComponent,
    TimerPipe,
  ],
  exports: [
    TimerComponent,
    TimerPipe,
  ]
})
export class TimerModule { }
