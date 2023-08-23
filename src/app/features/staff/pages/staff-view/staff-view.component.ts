import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CiviliansService } from '@features/civilians/services/civilians.service';
import {
  faCheck,
  faEye,
  faPlus,
  faRefresh,
  faSave,
  faTruckMoving,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { User } from '@features/civilians/interfaces/civilian';
import { UserStaff } from '@features/staff/interfaces/staff';
import { StaffService } from '@features/staff/services/staff.service';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.css']
})
export class StaffViewComponent implements OnInit, OnDestroy, AfterContentInit  {
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  staffForm: FormGroup;
  loading = false;
  private destroy$: any = new Subject();

  actionButtons: any[] = [

  ];

  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,
      action: () => {
        this.refresh();
      },
    },
  ];

  role=[
    {
      id: 0,
      name: 'Warga'
    },
    {
      id: 1,
      name: 'Lurah'
    },
    {
      id: 2,
      name: 'RT'
    },
    {
      id: 3,
      name: 'RW'
    },
  ]


  staffId: number;
  staff!: UserStaff;

  constructor(
    private layoutService: LayoutService,
    private staffService: StaffService,
    private route: ActivatedRoute,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private router: Router,
    private location: Location
  ) {
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));
    this.layoutService.setHeaderConfig({
      title: 'Detail Staff',
      icon: '',
      showHeader: true,
    });
    this.staffForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      role: new FormControl(null, Validators.required),
      staff: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.destroy$.next();
    this.staffService
      .getStaff(this.staffId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.staff = res.data;

        this.staffForm.patchValue({
          name: this.staff.name,
          email: this.staff.email,
          role: this.staff.role,
          staff: this.staff.staff,
        });

        console.log(this.staffForm.value)
      });
  }


  back() {
    this.location.back();
  }

  refresh() {
    this.staffForm.reset();
    this.loadData();
  }
}
