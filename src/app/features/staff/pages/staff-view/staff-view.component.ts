import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Staff } from '@features/staff/interfaces/staff';
import { StaffService } from '@features/staff/services/staff.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.css'],
})
export class StaffViewComponent {
  private readonly destroy$ = new Subject<void>();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,

      hidden: true,
      action: () => {
        this.submit();
      },
    },
  ];
  @Input() staff: Staff = {} as Staff;
  @Input() quickView: Boolean = false;

  loading = true;

  staffForm: FormGroup;
  confirmPassword: string = '';
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private staffService: StaffService
  ) {
    this.staff.id = String(this.route.snapshot.paramMap.get('staffId'));

    this.layoutService.setHeaderConfig({
      title: 'Staff',
      icon: '',
      showHeader: true,
    });
    // init form
    this.staffForm = new FormGroup({
      note: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    if (!this.quickView) {
      this.loadData();
    }
  }
  ngOnChanges(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.staffService.getStaff(this.staff.id).subscribe((res: any) => {
      this.staff = res.data;
      this.staffForm.patchValue({
        note: this.staff.note,
      });
      this.loading = false;
    });
  }
  submit() {}
}
