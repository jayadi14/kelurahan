import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import {
  faCalculator,
  faCopy,
  faDeleteLeft,
  faPaste,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { evaluate } from 'mathjs';

@Component({
  selector: 'fc-calculator',
  templateUrl: './fc-calculator.component.html',
  styleUrls: ['./fc-calculator.component.css'],
})
export class FcCalculatorComponent {
  faCalculator = faCalculator;
  faTimes = faTimes;
  faDeleteLeft = faDeleteLeft;
  faCopy = faCopy;
  faPaste = faPaste;

  @Input() target: any;

  title = 'Calculator';
  value: string = '0';

  calculateString = '';

  @Output() onSubmit = new EventEmitter();

  calclulatorButtons = [
    {
      label: 'Copy',
      value: 'copy',
      isOperator: true,
      icon: faCopy,
    },
    {
      label: 'Paste',
      value: 'paste',
      isOperator: true,
      icon: faPaste,
    },
    {
      label: '',
      value: '%',
    },
    {
      label: 'Clear',
      value: 'C',
      isOperator: true,
    },
    {
      label: 'Delete',
      value: 'del',
      isOperator: true,
      icon: faDeleteLeft,
    },
    {
      label: '',
      value: '7',
    },
    {
      label: '',
      value: '8',
    },
    {
      label: '',
      value: '9',
    },
    {
      label: '',
      value: '(',
    },
    {
      label: '',
      value: ')',
    },
    {
      label: '',
      value: '4',
    },
    {
      label: '',
      value: '5',
    },
    {
      label: '',
      value: '6',
    },

    {
      label: 'divide',
      value: '/',
      isOperator: true,
    },
    {
      label: 'multiply',
      value: '*',
      isOperator: true,
    },
    {
      label: '',
      value: '1',
    },
    {
      label: '',
      value: '2',
    },
    {
      label: '',
      value: '3',
    },
    {
      label: 'subtract',
      value: '-',
      isOperator: true,
    },
    {
      label: 'add',
      value: '+',
      isOperator: true,
    },
    {
      label: 'comma',
      value: '.',
    },
    {
      label: '',
      value: '0',
    },
    {
      label: '',
      value: '00',
    },
  ];

  constructor(private clipboard: Clipboard) {}
  onRemoveValue() {
    this.calculateString = '';
    this.value = '0';
  }

  @ViewChild('calculator') calculator: any;

  addValue(calculate: any) {
    if (calculate.isEqual) {
      let sum = evaluate(this.calculateString);
      if (sum > 0) {
        this.value = sum;
      } else {
        this.value = '0';
      }
      this.onSubmit.emit(this.value);
    } else if (calculate.isOperator) {
      switch (calculate.value) {
        case 'copy':
          this.clipboard.copy(this.calculateString);
          break;
        case 'paste':
          let clipboardContent = '';
          navigator.clipboard
            .readText()
            .then((text) => {
              clipboardContent = text;
              this.calculateString += clipboardContent;
            })
            .catch((err) => {
              console.error('Failed to read clipboard contents:', err);
            });
          break;
        case 'del':
          this.calculateString = this.calculateString.slice(
            0,
            this.calculateString.length - 1
          );
          break;
        case 'C':
          this.value = '0';
          this.calculateString = '';
          break;
        default:
          this.calculateString += calculate.value;
          break;
      }
    } else {
      this.calculateString += calculate.value;
    }
  }
  calculateValue() {
    let calculation = this.calculateString;
    let sum = 0;
    try {
      sum = evaluate(calculation);
    } catch (error) {
      sum = Number(this.value);
    }
    this.value = String(sum);
  }
}
