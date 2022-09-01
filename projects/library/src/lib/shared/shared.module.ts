import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DateMaskDirective } from './date-mask.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
  ],
  declarations: [DateMaskDirective],
  exports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    DateMaskDirective
  ]
})
export class SharedModule { }
