import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-presenter',
  templateUrl: './error-presenter.component.html',
  styleUrls: ['./error-presenter.component.css']
})
export class ErrorPresenterComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
