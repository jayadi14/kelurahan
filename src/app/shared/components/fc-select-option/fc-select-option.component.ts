import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-select-option',
  templateUrl: './fc-select-option.component.html',
  styleUrls: ['./fc-select-option.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcSelectOptionComponent),
      multi: true,
    },
  ],
})
export class FcSelectOptionComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimes = faTimes;
  showModal = false;
  value = null;

  @Input() title = 'Title';

  @Input() desktopView = 'modal';

  @Input() mobileView = 'modal';

  @Input() options: any = [];

  @Input() optionLable = '';

  @Input() optionValue = '';

  @Input() pagination = false;

  @Input() searchable = false;

  @Input() placeholder = '';

  @Input() disabled = false;

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  onChange: any = () => {};

  onTouch: any = () => {};

  valueLabel = '';

  writeValue(value: any) {
    this.value = value;
    if (value != null) {
      let selectedOption = this.options.find((x: any) => {
        if (this.optionValue != '') {
          return x[this.optionValue] == this.value;
        } else {
          return JSON.stringify(x) == JSON.stringify(this.value);
        }
      });
      if (selectedOption) {
        this.valueLabel = selectedOption[this.optionLable];
      }
    }
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
    if (val !== null && this.value !== val) {
      this.value = this.optionValue != '' ? val[this.optionValue] : val;
      this.valueLabel = val[this.optionLable];
      this.onChange(this.value);
      this.onTouch(this.value);
      let selectedOption = this.options.find((x: any) => {
        if (this.optionValue != '') {
          return x[this.optionValue] == this.value;
        } else {
          return x == this.value;
        }
      });
      this.onSelect.emit(selectedOption);
    } else {
      this.value = null;
      this.valueLabel = '';
      this.onChange(this.value);
      this.onTouch(this.value);
      this.onSelect.emit(null);
    }
  }

  searchQuery = '';
  get showableOptions() {
    if (this.searchQuery) {
      let filteredOptions = this.options.filter((x: any) =>
        x[this.optionLable]
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
      return filteredOptions;
    }
    return this.options;
  }
}
