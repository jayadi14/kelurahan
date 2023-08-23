import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CiviliansService } from '@features/civilians/services/civilians.service';
import {
  faEye,
  faPlus,
  faRefresh,
  faSave,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { User } from '@features/civilians/interfaces/civilian';

@Component({
  selector: 'app-civilians-view',
  templateUrl: './civilians-view.component.html',
  styleUrls: ['./civilians-view.component.css'],
})
export class CiviliansViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  civilianForm: FormGroup;
  loading = false;
  private destroy$: any = new Subject();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        // this.submit();
      },
    },
  ];

  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,
      action: () => {
        // this.refresh();
      },
    },
  ];

  gender = [
    {
      id: '0',
      name: 'Laki-Laki',
    },
    {
      id: '1',
      name: 'Perempuan',
    },
  ];

  userId: number;
  user!: User;

  constructor(
    private layoutService: LayoutService,
    private civiliansService: CiviliansService,
    private route: ActivatedRoute,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private location: Location
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.layoutService.setHeaderConfig({
      title: 'Detail Warga',
      icon: '',
      showHeader: true,
    });
    this.civilianForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      birth_place: new FormControl('', Validators.required),
      birth_date: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      nik: new FormControl(null, Validators.required),
      rt: new FormControl(null, Validators.required),
      rw: new FormControl(null, Validators.required),
      phone_no: new FormControl('', Validators.required),
      religion: new FormControl(null, Validators.required),
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
    this.civiliansService
      .getCivilian(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.user = res.data;
        this.civilianForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          birth_place: this.user.civilian.birth_place,
          birth_date: this.user.civilian.birth_date,
          gender: this.user.civilian.gender,
          nik: this.user.civilian.nik,
          rt: this.user.civilian.rt,
          rw: this.user.civilian.rw,
          phone_no: this.user.civilian.phone_no,
          religion: this.user.civilian.religion,
        });
      });
  }

  back() {
    this.location.back();
  }

  refresh() {
    this.civilianForm.reset();
    this.loadData();
  }
}
