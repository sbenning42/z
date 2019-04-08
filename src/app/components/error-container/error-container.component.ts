import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppError } from 'src/app/core/stores/app/config';

@Component({
  selector: 'app-error-container',
  templateUrl: './error-container.component.html',
  styleUrls: ['./error-container.component.css']
})
export class ErrorContainerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ErrorContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppError[]
  ) { }

  ngOnInit() {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
