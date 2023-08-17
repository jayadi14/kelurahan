import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-input-number',
  templateUrl: './fc-input-number.component.html',
  styleUrls: ['./fc-input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcInputNumberComponent),
      multi: true,
    },
  ],
})
export class FcInputNumberComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;

  value = 0;

  @Input() title = 'Title';
  @Input() min = 0;
  @Input() max: number | null = 99999999999999999999999999999999999999;
  @Input() disabled = false;
  @Input() placeholder = '';

  onChange: any = () => {};

  onTouch: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  onRemoveValue() {
    this.onValueChange(0);
  }
  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(this.value);
      this.onTouch(this.value);
    }
  }
}
