import { Directive, ElementRef, HostListener } from '@angular/core';
import * as math from 'mathjs';

@Directive({
  selector: '[fcNumber]',
})
export class FcNumberDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    const pattern = /^[\d+\-*/().=%]+$/;

    if (!pattern.test(inputValue) && this.el.nativeElement.type == 'text') {
      inputElement.value = inputValue.replace(/[^\d+\-*/().=%]/g, '');
    }
  }
  @HostListener('keyup', ['$event'])
  onKeyup(event: any) {
    if (
      event.keyCode == 187 &&
      event.key == '=' &&
      this.el.nativeElement.value[0] != '='
    ) {
      this.el.nativeElement.type = 'text';
      this.el.nativeElement.value =
        '=' + this.el.nativeElement.value.replace(/=/g, '');
    } else if (
      event.keyCode == 187 &&
      event.key == '=' &&
      this.el.nativeElement.value[0] == '='
    ) {
      // remove all equal sign
      let calculation = this.el.nativeElement.value.replace(/=/g, '');
      try {
        calculation = math.evaluate(calculation);
        this.el.nativeElement.value = calculation;
        this.el.nativeElement.type = 'number';
        // focus
        this.el.nativeElement.focus();
      } catch (error) {
        this.el.nativeElement.value = this.el.nativeElement.value.slice(0, -1);
      }
    }
  }
}
