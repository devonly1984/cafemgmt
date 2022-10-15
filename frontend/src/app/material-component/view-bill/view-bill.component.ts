import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource: any;
  responseMsg: any;
  constructor(
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.billService.getBills().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
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
  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
    };
    dialogConfig.width = '100%';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  downloadReportAction(values: any) {
    this.ngxService.start();
    const data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total,
      productDetails: values.productDetails,
    };
    this.billService.getPDF(data).subscribe(
      (response: any) => {
        saveAs(response, values.uuid + '.pdf');
        this.ngxService.stop();
      },
      (error) => {
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
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Delete ' + values.name + ' Bill',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response: any) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );
  }
  deleteProduct(id: any) {
    this.billService.deleteBills(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMsg = response?.message;
        this.snackbar.openSnackBar(this.responseMsg, 'Success');
      },
      (error) => {
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
