import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-select-autocomplete',
  templateUrl: './custom-select-autocomplete.component.html',
  styleUrls: ['./custom-select-autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomSelectAutocompleteComponent implements OnInit {

  @ViewChild('container', {static: false}) container: ElementRef;
  @ViewChild('listElement', {static: false}) listElement: ElementRef;

  @Input() label = '';
  @Input() placeholder = 'Nhập để tìm';
  @Input() keyName = '';
  @Input() keyValue = '';
  @Input() keyColorName = '';
  @Input() multiple = false;
  @Input() customClass = '';

  @Output() emitValue: EventEmitter<any> = new EventEmitter();

  private listMaxHeight = 300;
  private itemHeight = 48;
  private paddingTopHeight = 32;
  private distanceWhenListTop = 32;

  myControl = new FormControl();
  options: IOption[] = [];
  filteredOptions = this.options;
  searchStr = '';
  isColorName = false;
  idealHeightWhenOutParentNote = '';

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private element: ElementRef
  ) { }

  ngOnInit() {
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  private isOutOfViewport(elem) {
    // Get element's bounding
    const bounding = elem.getBoundingClientRect(),
      // Check if it's out of the viewport on each side
      out = {
        top: false,
        left: false,
        bottom: false,
        right: false,
        any: false,
        all: false
      };
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;
    return out;
  }

  private isOutOfParentNode(elem) {
    const bounding = elem.getBoundingClientRect(),
      // Check if it's out of the viewport on each side
      out = {
        top: false,
        idealMaxHeight: 0
        // left: false,
        // bottom: false,
        // right: false,
        // any: false,
        // all: false
      },
      position = bounding.top - this.paddingTopHeight - this.distanceWhenListTop;
    if (position < 0) {
      out.top = true;
      let i = 1;
      while (this.itemHeight * i + position < 0) {
        i++;
      }
      out.idealMaxHeight = this.listMaxHeight - (i * this.itemHeight);
    }
    // out.left = bounding.left < 0;
    // out.bottom = bounding.bottom > (this.element.nativeElement.parentNode.clientHeight || this.element.nativeElement.parentNode.innerHeight);
    // out.right = bounding.right > (this.element.nativeElement.parentNode.clientWidth || this.element.nativeElement.parentNode.innerWidth);
    // out.any = out.top || out.left || out.bottom || out.right;
    // out.all = out.top && out.left && out.bottom && out.right;
    console.log(out);
    return out;
  }

  setData(data: any[]) {
    this.options = data.map(item => {
      return new ModelOption({ name: item[this.keyName], value: item[this.keyValue], color: item[this.keyColorName] });
    });
    this.filteredOptions = [...this.options];
  }

  setSelectedDataBaseOnValue(selected: any[]) {
    selected.forEach(select => {
      const founded = this.filteredOptions.find(item => item.value === select);
      if (founded) {
        founded.selected = true;
      }
    });
    this.handleSearchString();
  }

  clearSelectedData() {
    console.log('CLEAR DATA');
    this.filteredOptions.forEach(item => {
      if (item.selected === true) {
        item.selected = false;
      }
    });
  }

  filterOptions() {
    const filterValue = this.searchStr.toLowerCase().trim();
    this.filteredOptions = this.options.filter(option => {
      const aliasLowerCase: string = this.changeAlias(option.name);
      return aliasLowerCase.includes(filterValue);
    });
  }

  mouseDownContainer(event) {
    event.preventDefault();
  }

  focus() {
    this.renderer.addClass(this.container.nativeElement, 'focus');
    this.searchStr = '';
    this.filterOptions();
    const out = this.isOutOfViewport(this.listElement.nativeElement);
    console.log(out.bottom);
    if (out.bottom) {
      this.renderer.addClass(this.container.nativeElement, 'display-top');
    }
    const outParentNode = this.isOutOfParentNode(this.listElement.nativeElement);
    if (outParentNode.top) {
      this.idealHeightWhenOutParentNote = outParentNode.idealMaxHeight + 'px';
      this.detectChanges();
    }
  }

  blur() {
    this.renderer.removeClass(this.container.nativeElement, 'focus');
    this.renderer.removeClass(this.container.nativeElement, 'display-top');
    this.idealHeightWhenOutParentNote = '';
    this.handleSearchString({ emit: true });
  }

  toggleOption(option) {
    option.selected = !option.selected;
  }

  private handleSearchString(options?: IHandleSearchString) {
    const selectedList = this.options.filter(item => item.selected);
    if (selectedList.length === 1) {
      this.searchStr = selectedList[0].name;
    } else if (selectedList.length > 1) {
      this.searchStr = selectedList[0].name + ` (+ ${selectedList.length - 1})`;
    }
    if (options && options.emit) {
      this.emitValue.emit(selectedList.map(item => item.value));
    }
  }

  private changeAlias(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  }

}

interface IHandleSearchString {
  emit?: boolean;
}

interface IOption {
  name?: string;
  value?: any;
  color?: string;
  selected?: boolean;
}

class ModelOption implements IOption {
  name = '';
  value;
  color = '';
  selected = false;
  constructor(data: IOption) {
    this.name = data.name;
    this.value = data.value;
    this.color = data.color;
  }
}
