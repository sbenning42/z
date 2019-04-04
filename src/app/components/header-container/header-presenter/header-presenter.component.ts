import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Link } from '../../../models/link';

@Component({
  selector: 'app-header-presenter',
  templateUrl: './header-presenter.component.html',
  styleUrls: ['./header-presenter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderPresenterComponent implements OnInit {

  @Input() links: Link[];
  @Output() linkSelected: EventEmitter<Link> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  select(link: Link) {
    this.linkSelected.emit(link);
  }

}
