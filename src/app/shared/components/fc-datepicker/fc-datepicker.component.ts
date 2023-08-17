import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faCalendarDay, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterDateService } from '../fc-filter-date/fc-filter-date.service';

@Component({
  selector: 'fc-datepicker',
  templateUrl: './fc-datepicker.component.html',
  styleUrls: ['./fc-datepicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcDatepickerComponent),
      multi: true,
    },
  ],
})
export class FcDatepickerComponent implements ControlValueAccessor {
  faCalendarDay = faCalendarDay;
  faTimes = faTimes;

  @Input() title = 'Date';

  @Input() type = 'single';
  @Input() placeholder = '';
  @Input() disabled = false;

  presetDates = [
    { label: 'Hari ini', value: 0 },
    { label: 'Kemarin', value: 1 },
    { label: 'Dalam 7 hari', value: 2 },
    { label: 'Dalam 14 hari', value: 3 },
    { label: 'Dalam 30 hari', value: 4 },
    { label: 'Minggu ini', value: 5 },
    { label: 'Minggu lalu', value: 6 },
    { label: 'Bulan ini', value: 7 },
    { label: 'Bulan lalu', value: 8 },
    { label: 'Maksimal', value: 99 },
  ];

  selectionDates: any = [null, null];

  value: any = null;

  onChange: any = () => {};

  onTouch: any = () => {};

  constructor(private fcFilterDateService: FcFilterDateService) {}

  ngOnInit(): void {}

  writeValue(value: any) {
    if (this.type == 'range') {
      if (value) {
        this.value = value;
        this.selectionDates = [value.start, value.end];
      } else {
        this.value = {
          start: null,
          end: null,
        };
        this.selectionDates = [];
      }
    } else {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  //  Date
  setDefaultDate() {
    this.selectionDates = [];
  }
  setDate() {
    if (this.type == 'range') {
      this.value.start = this.selectionDates[0];
      if (!this.selectionDates[1]) {
        this.value.end = this.selectionDates[0];
      } else {
        this.value.end = this.selectionDates[1];
      }
    }
  }

  datePreset(preset: number) {
    let selectedDatePreset = this.fcFilterDateService.getPresetDate(preset);
    this.value = {
      start: selectedDatePreset.start,
      end: selectedDatePreset.end,
    };
    this.selectionDates = [selectedDatePreset.start, selectedDatePreset.end];
    this.onValueChange(this.value);
  }
  onRemoveValue() {
    if (this.type == 'range') {
      this.value.start = null;
      this.value.end = null;
      this.onValueChange(this.value);
    } else {
      this.value = null;
      this.onValueChange(this.value);
    }
    this.resetDate();
  }
  resetDate() {
    if (this.type == 'range') {
      this.selectionDates = [];
    }
  }
  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }
}
