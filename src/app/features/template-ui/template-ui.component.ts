import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';

@Component({
  selector: 'app-template-ui',
  templateUrl: './template-ui.component.html',
  styleUrls: ['./template-ui.component.css'],
})
export class TemplateUiComponent {
  faCheck = faCheck;
  faTrash = faTrash;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    date: new FormControl(null, Validators.required),
    dateRange: new FormControl(
      {
        start: new Date(),
        end: new Date(),
      },
      Validators.required
    ),
    number: new FormControl(0),
    calculatorNumber: new FormControl(0),
    image: new FormControl(''),
    images: new FormArray([]),
    is_active: new FormControl(false),
    fcNumber: new FormControl(0),
  });

  options: any = [
    {
      id: 0,
      name: 'Option 1',
    },
    {
      id: 1,
      name: 'Option 2',
    },
    {
      id: 2,
      name: 'Option 3',
    },
  ];
  constructor(
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService
  ) {}
  submit() {}
  changeDate() {}
  getFileName(file: any): string {
    return file.file.name;
  }

  get imagesArrayForm(): FormArray {
    return this.form.get('images') as FormArray;
  }
  addMultipleImage(images: any) {
    images.forEach((element: any) => {
      (this.form.get('images') as FormArray).push(
        new FormGroup({
          file: new FormControl(element.file),
          img_src: new FormControl(element.img_src),
        })
      );
    });
  }
  addSingleImage(image: any) {
    this.form.patchValue({
      image: image,
    });
  }
  openToast(severity: string = '') {
    this.fcToastService.clear();
    switch (severity) {
      case 'success':
        this.fcToastService.add({
          header: 'Order',
          subheader: 'Success to update data',
          message:
            'Your data has been updated, if you want to see the result, please go to the order page',
          severity: severity,
        });
        break;
      case 'error':
        this.fcToastService.add({
          header: 'Order',
          subheader: 'Request failed',
          message: 'Please check your data and try again',
          severity: severity,
          actionButtons: [
            {
              label: 'Go to page',
              // icon: this.faCheck,
              action: () => {
                console.log('Action');
              },
            },
          ],
        });
        break;
      default:
        this.fcToastService.add({
          header: 'Order',
          subheader: 'Success to update data',
          message:
            'Your data has been updated, if you want to see the result, please go to the order page',
          actionButtons: [
            {
              label: 'Go to page',
              // icon: this.faCheck,
              action: () => {
                console.log('Action');
              },
            },
          ],
          lottieOption: {
            path: '/assets/lotties/hamster.json',
            loop: false,
          },
        });

        break;
    }
  }
  openConfirmDialog(text: string) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        console.log(text);
      },
    });
  }
}
