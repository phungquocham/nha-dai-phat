import { Component, OnInit, HostListener, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { DialogConfirmComponent } from 'src/app/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogUpdateNameComponent } from 'src/app/shared/components/dialogs/dialog-update-name/dialog-update-name.component';
import { CONFIRM, TYPE_COMPONENT } from 'src/app/shared/helpers/const';

@Component({
  selector: 'app-input-basic',
  templateUrl: './input-basic.component.html',
  styleUrls: ['./input-basic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InputBasicComponent implements OnInit {

  @Input() item: any;
  @Input() message: string;
  @Input() onlyEvent = false;
  @Input() type = '';
  @Output() value: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  TYPE_COMPONENT = TYPE_COMPONENT;
  showActions = false;

  @HostListener('mouseover') onMouseOver() {
    this.showActions = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.showActions = false;
  }

  constructor(
    private dialog: DialogService
  ) { }

  ngOnInit() {
  }

  private emitValue(value) {
    this.value.emit(value);
  }

  private emitConfirm(value) {
    this.confirm.emit(value);
  }

  confirmDelete() {
    this.dialog.open({
      component: DialogConfirmComponent,
      data: {
        message: this.message
      }
    }).subscribe(ok => {
      if (ok === CONFIRM.OK) {
        this.emitConfirm(this.item.id);
      }
    });
  }

  edit() {
    if (this.onlyEvent) {
      this.emitValue(CONFIRM.OK);
      return;
    }
    this.dialog.open({
      component: DialogUpdateNameComponent,
      data: {
        name: this.item.name
      }
    }).subscribe(value => {
      if (value !== CONFIRM.CANCEL) {
        this.emitValue({
          id: this.item.id,
          value: value
        });
      }
    });
  }

}
