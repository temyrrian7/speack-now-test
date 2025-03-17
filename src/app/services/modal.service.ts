import { Injectable, Injector, ApplicationRef, ComponentRef, createComponent, EmbeddedViewRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<any>;

  constructor(private appRef: ApplicationRef, private injector: Injector) {}

  open<T>(component: new (...args: any) => T, props?: Partial<T>): void {
    this.close(); // close if already opened

    this.modalRef = createComponent(component, {
      environmentInjector: this.appRef.injector
    });

    if (props) {
      Object.assign(this.modalRef.instance, props);
    }

    this.appRef.attachView(this.modalRef.hostView);

    const domElem = (this.modalRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}
