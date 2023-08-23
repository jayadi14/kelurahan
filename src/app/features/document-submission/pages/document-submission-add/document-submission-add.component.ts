import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  faChevronDown,
  faEye,
  faPlus,
  faSave,
  faTimes,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { DocumentSubmissionService } from '@features/document-submission/services/document-submission.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-document-submission-add',
  templateUrl: './document-submission-add.component.html',
  styleUrls: ['./document-submission-add.component.css']
})
export class DocumentSubmissionAddComponent implements OnInit, OnDestroy, AfterContentInit {
  private destroy$: any = new Subject();
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

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

  document_type = [
    {
      id: 0,
      name: 'Surat Keterangan Usaha'
    },
    {
      id: 1,
      name: 'Surat Pengantar Nikah'
    },
    {
      id: 2,
      name: 'Surat Keterangan Kematian'
    },
    {
      id: 3,
      name: 'Surat Ahli Waris'
    }
  ]


  constructor(
    private layoutService: LayoutService,
    private documentSubmissionService: DocumentSubmissionService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Pengajuan Dokumen',
      icon: '',
      showHeader: true,
    });
    // init form
    this.documentSubmissionForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      document_attachments: new FormArray([])
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeType(){

  }

  submit(){}

}
