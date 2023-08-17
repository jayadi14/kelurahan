import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AnimationItem } from 'lottie-web';
import { FcToast } from '../fc-toast/fc-toast.interface';

@Component({
  selector: 'fc-boolean-input',
  templateUrl: './fc-boolean-input.component.html',
  styleUrls: ['./fc-boolean-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcBooleanInputComponent),
      multi: true,
    },
  ],
})
export class FcBooleanInputComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  value = false;

  lottieOption =
  [
    {
      path: '/assets/lotties/boolean-true.json',
      loop: false,
    },
    {
      path: '/assets/lotties/boolean-false.json',
      loop: false,
    },
  ]

  @Input() title = 'Title';
  @Input() description = 'Change this status';

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
    this.onValueChange('');
  }
  onValueChange(val: any) {
    if (val !== undefined && this.value !== val) {
      this.value = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }
}
