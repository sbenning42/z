import { Component, OnInit, Input } from '@angular/core';
import { AppError } from 'src/app/core/stores/app/config';

@Component({
  selector: 'app-error-presenter',
  templateUrl: './error-presenter.component.html',
  styleUrls: ['./error-presenter.component.css']
})
export class ErrorPresenterComponent implements OnInit {

  @Input() errors: AppError[];

  constructor() { }

  ngOnInit() {
  }

}
