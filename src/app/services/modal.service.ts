import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private appRef = inject(ApplicationRef);

  private modalRef?: ComponentRef<any>;

  open<T>(component: new (...args: any) => T, props?: Partial<T>): ComponentRef<any> {
    // close if already opened
    this.close();

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
    return this.modalRef;
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}
