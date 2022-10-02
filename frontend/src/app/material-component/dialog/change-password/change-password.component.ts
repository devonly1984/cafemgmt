import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup;
  responseMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }
  validateSubmit() {
    if (
      this.changePasswordForm.controls['newPassword'].value !=
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      return true;
    } else {
      return false;
    }
  }
  handleChangePasswordSubmit() {
    this.ngxService.start();
    const formData = this.changePasswordForm.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };
    console.log(data);
    this.userService.changePassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMsg = response?.message;
        this.dialogRef.close();
        this.snackbar.openSnackBar(this.responseMsg, 'success');
      },
      (error) => {
        console.log(error);
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
