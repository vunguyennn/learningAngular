import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: `button[loading]`,
})
export class ButtonLoadingDirective implements OnChanges {
  @Input() loading: boolean = false;
  @Input() btnContent: string = '';
  btnEl!: HTMLButtonElement;

  constructor(private el: ElementRef) {
    this.btnEl = this.el.nativeElement;
    this.btnEl.innerHTML = this.btnContent;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.btnEl.innerHTML = this.loading ? 'Loading...' : this.btnContent;
  }
}
