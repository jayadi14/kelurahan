import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ability } from '@casl/ability';
import { environment } from '@env';
import { CiviliansApprovalNoteDialogComponent } from '@features/civilians/components/civilians-approval-note-dialog/civilians-approval-note-dialog.component';
import { DocumentSubmission } from '@features/document-submission/interfaces/document-submission';
import { DocumentSubmissionService } from '@features/document-submission/services/document-submission.service';
import {
  faCheck,
  faChevronDown,
  faDownload,
  faEye,
  faFile,
  faPlus,
  faTimes,
  faTruckMoving,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-document-submission-view',
  templateUrl: './document-submission-view.component.html',
  styleUrls: ['./document-submission-view.component.css'],
})
export class DocumentSubmissionViewComponent {
  private destroy$: any = new Subject();
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faFile = faFile;
  faDownload = faDownload;

  loading = false;
  documentSubmissionForm: FormGroup;

  actionButtons: any[] = [
    {
      label: 'Setuju',
      icon: faCheck,
      hidden: true,
      action: () => {
        this.approveUser();
      },
    },
    {
      label: 'Tolak',
      icon: faX,
      hidden: true,
      action: () => {
        this.rejectRegistration();
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

  documentSubmission: DocumentSubmission = {} as DocumentSubmission;
  constructor(
    private layoutService: LayoutService,
    private documentSubmissionService: DocumentSubmissionService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private router: Router,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private ability: Ability
  ) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.documentSubmission.id = Number(
        this.route.snapshot.paramMap.get('id')
      );
    }
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

  ngOnInit(): void {
    this.documentSubmissionService
      .getSubmission(this.documentSubmission.id)
      .subscribe({
        next: (res: any) => {
          this.documentSubmission = res.data;
          this.documentSubmissionForm.patchValue({
            type: this.document_type.find(
              (type: any) => type.id === this.documentSubmission.type
            ),
          });
          this.documentSubmission.document_attachments.forEach(
            (file: any, i: number) => {
              this.documentAttachments.push(
                new FormGroup({
                  file: new FormControl(null),
                  img_src: new FormControl(file.file_path),
                  type: new FormControl(file.document_type),
                  downloadLink: new FormControl(
                    `${environment.domain}/${file.file_path}`
                  ),
                })
              );
            }
          );
          console.log(this.documentAttachments.value);
        },
      });
  }
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
  rejectRegistration() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: `Apakah kamu yakin ingin menolak registrasi user ini?`,
      accept: () => {
        const ref = this.dialogService.open(
          CiviliansApprovalNoteDialogComponent,
          {
            data: {
              title: 'Tolak Registrasi',
            },
            showHeader: false,
            contentStyle: {
              padding: '0',
            },
            style: {
              overflow: 'hidden',
            },
            styleClass: 'rounded-sm',
            dismissableMask: true,
            width: '450px',
          }
        );
        ref.onClose.subscribe((data) => {
          if (data) {
            let bodyReqForm: FormGroup;
            bodyReqForm = new FormGroup({
              note: new FormControl(data.note),
              status: new FormControl(2),
            });
            this.documentSubmissionService
              .setProgressocumentSubmission(
                this.documentSubmission.id,
                bodyReqForm.value
              )
              .subscribe({
                next: (res: any) => {
                  this.fcToastService.add({
                    severity: 'success',
                    header: 'Tolak Registrasi Warga',
                    message: res.message,
                  });
                  this.actionButtons[0].hidden = true;
                  this.actionButtons[1].hidden = true;
                  this.router.navigate(['/civilians/list']);
                },
                error: (err) => {
                  this.fcToastService.add({
                    severity: 'error',
                    header: 'Tolak Registrasi Warga',
                    message: err.message,
                  });
                },
              });
          }
        });
      },
    });
  }

  approveUser() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: `Apakah kamu yakin ingin menyetujui registrasi user ini?`,
      accept: () => {
        let bodyReqForm: FormGroup;
        bodyReqForm = new FormGroup({
          status: new FormControl(1),
        });
        this.documentSubmissionService
          .setProgressocumentSubmission(
            this.documentSubmission.id,
            bodyReqForm.value
          )
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Approval Registrasi Warga',
                message: res.message,
              });
              this.actionButtons[0].hidden = true;
              this.actionButtons[1].hidden = true;
              this.router.navigate(['/civilians/list']);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Approval Registrasi Warga',
                message: err.message,
              });
            },
          });
      },
    });
  }
  back() {
    this.location.back();
  }
}
