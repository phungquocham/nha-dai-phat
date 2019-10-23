import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appRouterHover]'
})
export class RouterHoverDirective {

  @Input() routersList = [];

  constructor(
    private ele: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseover')
  onMouseOver() {
    const index = this.routersList.findIndex(x => x === 'forms');
    if (index > -1) {
      this.routersList.splice(index, 1);
    }
    // const url = Routing.PROJECTS + '/' + Projects.getProjectId() + (this.routersList.length > 0 ? `/${this.routersList.join('/')}` : ``);
    const url = '';
    this.renderer.setAttribute(this.ele.nativeElement, 'href', url);
  }
}
