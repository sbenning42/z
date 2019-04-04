import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from './material-design/material-design.module';
import { RoutingModule } from './routing/routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [],
  exports: [
    MaterialDesignModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
