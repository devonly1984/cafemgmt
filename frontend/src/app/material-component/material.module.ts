import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { MaterialModule } from '../shared/material-module';
import { MaterialRoutes } from './material.routing';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { CategoryComponent } from './dialog/category/category.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ProductComponent } from './dialog/product/product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    ViewBillComponent,
  ],
})
export class MaterialComponentsModule {}
