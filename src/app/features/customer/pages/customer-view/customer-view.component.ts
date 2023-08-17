import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '@features/customer/interfaces/customer';
import { CustomerService } from '@features/customer/services/customer.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css'],
})
export class CustomerViewComponent {
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
  @Input() customer: Customer = {} as Customer;
  @Input() quickView: Boolean = false;

  loading = true;

  customerForm: FormGroup;
  confirmPassword: string = '';
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {
    this.customer.id = String(this.route.snapshot.paramMap.get('customerId'));

    this.layoutService.setHeaderConfig({
      title: 'Customer',
      icon: '',
      showHeader: true,
    });
    // init form
    this.customerForm = new FormGroup({
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
    this.customerService.getCustomer(this.customer.id).subscribe((res: any) => {
      this.customer = res.data;
      this.customerForm.patchValue({
        note: this.customer.note,
      });
      this.loading = false;
    });
  }
  submit() {}
}
