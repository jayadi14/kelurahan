import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-input-text',
  templateUrl: './fc-input-text.component.html',
  styleUrls: ['./fc-input-text.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcInputTextComponent),
      multi: true,
    },
  ],
})
export class FcInputTextComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;

  @Input() value: string = '';

  @Input() title = 'Title';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() inputId = 'textInput';
  @Input() isInvalid: boolean | undefined = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Output() onRemove = new EventEmitter<any>();

  onChange: any = () => {};

  onTouch: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state of your custom control
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  onRemoveValue() {
    this.onValueChange(null);
    this.onRemove.emit(null);
  }
  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(this.value);
      this.onTouch(this.value);
    }
  }
}
