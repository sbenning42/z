import { Component, OnInit, Input } from '@angular/core';
import { AppLoading } from 'src/app/core/stores/app/config';

@Component({
  selector: 'app-loading-presenter',
  templateUrl: './loading-presenter.component.html',
  styleUrls: ['./loading-presenter.component.css']
})
export class LoadingPresenterComponent implements OnInit {

  @Input() loadings: AppLoading[];

  constructor() { }

  ngOnInit() {
  }

}
