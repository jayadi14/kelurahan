import { Location } from '@angular/common';
import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentSubmissionService } from '@features/document-submission/services/document-submission.service';
import {
  faChevronDown,
  faEye,
  faFile,
  faPlus,
  faSave,
  faTimes,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-document-submission-add',
  templateUrl: './document-submission-add.component.html',
  styleUrls: ['./document-submission-add.component.css'],
})
export class DocumentSubmissionAddComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  private destroy$: any = new Subject();
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faFile = faFile;

  loading = false;
  documentSubmissionForm: FormGroup;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];
  document_file_enums = [
    'Surat Pengantar RT RW (dengan keterangan tempat usaha)',
    'EKTP Pemilik Usaha',
    'Foto tempat usaha',
    'Surat Pengantar RT RW (dengan keterangan akan Menikah)',
    'EKTP',
    'KK',
    'Akte Kelahiran',
    'Ijazah terakhir',
    'Foto 3x4 background Merah',
    'Surat Kematian/akte cerai (janda/duda)→(jika ada)',
    'Surat Pengantar RT RW setempat',
    'KTP dan KK Almarhum/Almarhumah',
    'Buku Nikah / Akte Pernikahan Almarhum / Almarhumah',
    'Surat Keterangan kematian dari rumah sakit',
    'Surat pemakaman dari TPU tempat dimakamkan',
    'Akte Kematian',
    'KTP dan KK Ahli Waris',
    'Akte Kelahiran semua Ahli Waris',
    'KTP saksi 2 orang',
  ];

  document_type = [
    {
      id: 0,
      name: 'Surat Keterangan Usaha',
      required_files: [
        'Surat Pengantar RT RW (dengan keterangan tempat usaha)',
        'EKTP Pemilik Usaha',
        'Foto tempat usaha',
      ],
    },
    {
      id: 1,
      name: 'Surat Pengantar Nikah',
      required_files: [
        'Surat Pengantar RT RW (dengan keterangan akan Menikah)',
        'EKTP',
        'KK',
        'Akte Kelahiran',
        'Ijazah terakhir',
        'Foto 3x4 background Merah',
        'Surat Kematian/akte cerai (janda/duda)→(jika ada)',
      ],
    },
    {
      id: 2,
      name: 'Surat Keterangan Kematian',
      required_files: [
        'KTP dan KK Almarhum/Almarhumah',
        'Buku Nikah / Akte Pernikahan Almarhum / Almarhumah',
        'Surat Keterangan kematian dari rumah sakit',
        'Surat pemakaman dari TPU tempat dimakamkan',
      ],
    },
    {
      id: 3,
      name: 'Surat Ahli Waris',
      required_files: [
        'Akte Kematian',
        'KTP dan KK Almarhum/Almarhumah',
        'Buku Nikah / Akte Pernikahan Almarhum / Almarhumah',
        'KTP dan KK Ahli Waris',
        'Akte Kelahiran semua Ahli Waris',
        'KTP saksi 2 orang',
      ],
    },
  ];
  selectedDocumentType: any = null;

  constructor(
    private layoutService: LayoutService,
    private documentSubmissionService: DocumentSubmissionService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private router: Router,
    private messageService: MessageService,
    private location: Location
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Pengajuan Dokumen',
      icon: '',
      showHeader: true,
    });
    // init form
    this.documentSubmissionForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      document_attachments: new FormArray([]),
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    let fd = new FormData();
    fd.append('type', this.documentSubmissionForm.value.type.id);
    if (
      this.documentAttachments.value.length ===
      this.documentSubmissionForm.value.type.required_files.length
    ) {
      this.documentSubmissionForm.value.document_attachments.forEach(
        (file: any, i: number) => {
          fd.append(`document_attachments[${i}][file]`, file.file);
          fd.append(`document_attachments[${i}][document_type]`, file.type);
        }
      );
      this.documentSubmissionService.createSubmission(fd).subscribe({
        next: (res: any) => {
          this.fcToastService.add({
            severity: 'success',
            header: 'Berhasil',
            message: 'Dokumen berhasil diajukan',
          });
          this.back();
        },
        error: (err: any) => {
          this.fcToastService.add({
            severity: 'error',
            header: 'Gagal',
            message: 'Dokumen gagal diajukan',
          });
        },
      });
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Gagal',
        message: 'Mohon lengkapi semua dokumen yang dibutuhkan',
      });
    }
  }
  onSelectType(event: any) {
    this.documentSubmissionForm.removeControl('document_attachments');
    this.documentSubmissionForm.addControl(
      'document_attachments',
      new FormArray([])
    );
  }
  addImage(image: any, type: any) {
    // check if has type in form
    let fileIndex = this.documentAttachments.value.findIndex(
      (file: any) => file.type === type
    );
    if (fileIndex > -1) {
      // update image
      this.documentAttachments.controls[fileIndex].patchValue({
        file: image.file,
        img_src: image.img_src,
      });
    } else {
      // add image
      this.documentAttachments.push(
        new FormGroup({
          file: new FormControl(image.file),
          img_src: new FormControl(image.img_src),
          type: new FormControl(type),
        })
      );
    }
  }
  get documentAttachments(): FormArray {
    return this.documentSubmissionForm.get('document_attachments') as FormArray;
  }
  getDocumentAttachmentFile(type: any) {
    let file = this.documentAttachments.value.find(
      (file: any) => file.type === type
    );
    if (file) {
      return file;
    } else {
      return null;
    }
  }

  getFileName(file: any): string {
    return file.file.name;
  }
  back() {
    this.location.back();
  }
}
