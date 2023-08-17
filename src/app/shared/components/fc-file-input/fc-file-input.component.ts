import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'fc-file-input',
  templateUrl: './fc-file-input.component.html',
  styleUrls: ['./fc-file-input.component.css'],
})
export class FcFileInputComponent {
  @Input() multiple: boolean = false;

  @Output() onInput: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {}

  @ViewChild('fileInput') fileInput: any;

  uploadFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (this.multiple) {
        let files = event.target.files;
        let selectedFiles: any = [];
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (_e) => {
            let sanitizedImg = this.sanitizer.bypassSecurityTrustUrl(
              reader.result as string
            );
            selectedFiles.push({
              file: file,
              img_src: sanitizedImg,
            });
            if (selectedFiles.length == files.length) {
              this.onInput.emit(selectedFiles);
              if (this.fileInput) this.fileInput.nativeElement.value = '';
            }
          };
        }
      } else {
        let file = event.target.files[0];
        if (this.fileInput) this.fileInput.nativeElement.value = '';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_e) => {
          let sanitizedImg = this.sanitizer.bypassSecurityTrustUrl(
            reader.result as string
          );
          this.onInput.emit({
            file: file,
            img_src: sanitizedImg,
          });
        };
      }
    }
  }
}
