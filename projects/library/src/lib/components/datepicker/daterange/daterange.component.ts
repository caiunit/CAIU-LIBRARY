import {
   ChangeDetectionStrategy,
   Component,
   forwardRef,
   Input,
   ViewChild,
   Output,
   EventEmitter,
   ChangeDetectorRef,
   OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatepickerComponent } from '../datepicker.component';
import { DateRange } from '../../../shared/date';
import { build } from '../../../shared/utils';

export const DATERANGE_ACCESSOR: any = {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => DaterangeComponent),
   multi: true
};

@Component({
   selector: 'iu-daterange',
   templateUrl: './daterange.component.html',
   styleUrls: ['./daterange.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
   providers: [DATERANGE_ACCESSOR]
})

export class DaterangeComponent implements ControlValueAccessor, OnInit {
   @Input() debug = false;
   @Input() inline = false;
   @Input() min: Date;
   @Input() max: Date; 
   @Input() required: boolean = false;
   @Input() startAt: Date;
   @Input() startLabel = 'Start Date';
   @Input() endLabel = 'End Date';
   @Input() startView;
   @Input() touchUi;
   @Output() startDateChanged = new EventEmitter<Date>();
   @Output() endDateChanged = new EventEmitter<Date>();
   @ViewChild('startDate', { static: true })
   startDatepicker: DatepickerComponent;
   @ViewChild('endDate', { static: true }) endDatepicker: DatepickerComponent;
   private onModelChange: Function;
   private onTouch: Function;
   _value: DateRange = new DateRange();
   focused: DateRange = new DateRange();
   now = new Date();

   constructor(private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit() {}

   get value(): DateRange {
      return this._value;
   }

   @Input()
   set value(val: DateRange) {
      this._value = val;
      if (this.startDatepicker) {
         this.startDatepicker.value = val?.startDate;
      }
      if (this.endDatepicker) {
         this.endDatepicker.value = val?.endDate;
      }
      if (
         this &&
         this.changeDetectorRef &&
         !this.changeDetectorRef['destroyed']
      ) {
         this.changeDetectorRef.detectChanges();
      }
   }

   get startDateId() {
      return this.startDatepicker.id;
   }

   get startDateOpened() {
      return this.startDatepicker.opened;
   }

   get endDateId() {
      return this.endDatepicker.id;
   }

   get endDateOpened() {
      return this.endDatepicker.opened;
   }

   get startDateValue(): Date {
      return this.value.startDate ? new Date(this.value.startDate) : null;
   }

   set startDateValue(value: Date) {
      this.changeStartDate(value);
   }

   get endDateValue(): Date {
      return this.value.endDate ? new Date(this.value.endDate) : null;
   }

   set endDateValue(value: Date) {
      this.changeEndDate(value);
   }

   get startDateLastDay() {
      return new Date(
         this.startDateValue.getFullYear(),
         this.startDateValue.getMonth() + 1,
         0
      );
   }

   filter(d: Date): boolean {
      return this.ifMonthSame(d) || this.ifMonthDifferent(d);
   };

   changeStartDate(date: Date) {
      this.onChange(
         build(DateRange, {
            endDate: this.value.endDate,
            startDate: date
         })
      );
      this.startDateChanged.emit(date);
   }

   ifMonthSame(d: Date) {
      return (
         d.getMonth() === this.startDateValue.getMonth() &&
         d.getDate() >= this.startDateValue.getDate() &&
         d.getFullYear() === this.startDateValue.getFullYear()
      );
   }

   ifMonthDifferent(d: Date) {
      return (
         (d.getMonth() > this.startDateValue.getMonth() &&
            d.getFullYear() >= this.startDateValue.getFullYear() &&
            (1 < d.getDate() ||
               this.startDateValue.getDate() <= this.startDateLastDay.getDate())) ||
         d.getFullYear() > this.startDateValue.getFullYear()
      );
   }

   closeStartDate() {
      this.startDatepicker.close();
   }

   openStateDate() {
      this.startDatepicker.open();
   }

   changeEndDate(date: Date) {
      this.onChange(
         build(DateRange, {
            endDate: date,
            startDate: this.value.startDate
         })
      );
      this.endDateChanged.emit(date);
      if (this.debug) {
         console.dir('changeEndDate ran');
         console.dir('Start Date: ' + this.startDateValue);
         console.dir('End Date:' + date);
      }
   }

   closeEndDate() {
      this.endDatepicker.close();
   }

   openEndDate() {
      this.endDatepicker.open();
   }

   registerOnChange(fn: Function) {
      this.onModelChange = fn;
   }

   registerOnTouched(fn: Function) {
      this.onTouch = fn;
   }

   writeValue(value: DateRange) {
      this.value = value;
   }

   onChange(value: DateRange) {
      this.value = value;
      if (this.onModelChange) {
         this.onModelChange(value);
      }
   }

   onFocus(value: DateRange) {
      this.focused = value;
      if (this.onTouch) {
         this.onTouch();
      }
   }
}
