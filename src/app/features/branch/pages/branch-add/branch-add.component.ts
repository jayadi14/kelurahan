import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '@features/branch/services/branch.service';
import { faRefresh, faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.css'],
})
export class BranchAddComponent implements OnInit, OnDestroy, AfterContentInit {
  private destroy$: any = new Subject();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,

      action: () => {
        this.submit();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {},
    },
  ];

  branchForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private branchService: BranchService,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Branch',
      icon: '',
      showHeader: true,
    });
    this.branchForm = new FormGroup({
      address: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    if (this.branchForm.valid) {
      this.actionButtons[0].loading = true;
      this.branchService.addBranch(this.branchForm.value).subscribe({
        next: (res: any) => {
          this.branchForm.reset();
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Branch',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Branch',
            message: err.message,
          });
        },
      });
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Branch',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
}
