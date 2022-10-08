import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMsg: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }
  add() {
    const formData = this.categoryForm.value;
    var data = {
      name: formData.name,
    };
    this.categoryService.addCategory(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMsg = response.message;
        this.snackbar.openSnackBar(this.responseMsg, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMsg = error.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMsg, GlobalConstants.error);
      }
    );
  }
  edit() {
    const formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };
    this.categoryService.updateCategory(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMsg = response.message;
        this.snackbar.openSnackBar(this.responseMsg, 'success');
      },
      (error) => {
        this.dialogRef.close();
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
