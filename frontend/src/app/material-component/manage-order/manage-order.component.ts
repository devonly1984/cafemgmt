import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit',
  ];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMsg: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbar: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.categories = response;
      },
      (error: any) => {
        this.ngxService.stop();
        {
          this.ngxService.stop();
          if (error.error?.message) {
            this.responseMsg = error.error?.message;
          } else {
            this.responseMsg = GlobalConstants.genericError;
          }
          this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
        }
      }
    );
  }
  getProductsByCategory(value: any) {
    this.productService.getProductsbyCategory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMsg = error.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
      }
    );
  }
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe(
      (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMsg = error.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
      }
    );
  }
  setQuantity(value: any) {
    const temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }
  validateProductAdd() {
    if (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  validateSubmit() {
    if (
      this.totalAmount === 0 ||
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !this.manageOrderForm.controls['email'].valid ||
      !this.manageOrderForm.controls['contactNumber'].valid
    ) {
      return true;
    } else {
      return false;
    }
  }
  addProduct() {
    const formData = this.manageOrderForm.value;

    const productName = this.dataSource.find(
      (e: { id: number }) => e.id == formData.product.id
    );
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbar.openSnackBar(GlobalConstants.productAdded, 'success');
    } else {
      this.snackbar.openSnackBar(
        GlobalConstants.productExistError,
        GlobalConstants.error
      );
    }
  }
  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);

    this.dataSource = [...this.dataSource];
  }
  submitAction() {
    this.ngxService.start();
    const formData = this.manageOrderForm.value;
    const data = {
      name: formData.name,
      email: formData.email,

      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource),
    };
    this.billService.generateReport(data).subscribe(
      (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMsg = error.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
      }
    );
  }
  downloadFile(fileName: any) {
    const data = {
      uuid: fileName,
    };
    this.billService.getPDF(data).subscribe(
      (response: any) => {
        saveAs(response, fileName + '.pdf');
        this.ngxService.stop();
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMsg = error.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
      }
    );
  }
}
