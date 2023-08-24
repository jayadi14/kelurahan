import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { faFile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-civilians-approval-note-dialog',
  templateUrl: './civilians-approval-note-dialog.component.html',
  styleUrls: ['./civilians-approval-note-dialog.component.css'],
})
export class CiviliansApprovalNoteDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faFile = faFile;
  title = '';

  approvalForm: FormGroup;
  type: string = '';
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.type) {
      this.type = this.config.data.type;
      this.approvalForm = new FormGroup({
        note: new FormControl(null),
        file: new FormControl(null, Validators.required),
      });
    } else {
      this.approvalForm = new FormGroup({
        note: new FormControl(null, Validators.required),
        file: new FormControl(null),
      });
    }
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isSubmitAllowed(): boolean {
    if (this.approvalForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    console.log(this.approvalForm.value);
    this.ref.close(this.approvalForm.value);
  }
  addFile(file: any) {
    this.approvalForm.patchValue({
      file: file.file,
    });
  }
  onClose() {
    this.ref.close();
  }
}
