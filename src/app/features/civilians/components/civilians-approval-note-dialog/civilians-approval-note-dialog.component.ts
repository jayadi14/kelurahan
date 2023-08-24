import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '@features/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  title = '';

  approvalForm: FormGroup;

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

    this.approvalForm = new FormGroup({
      note: new FormControl(null, Validators.required),
    });
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
    this.ref.close(this.approvalForm.value);
  }

  onClose() {
    this.ref.close();
  }
}
