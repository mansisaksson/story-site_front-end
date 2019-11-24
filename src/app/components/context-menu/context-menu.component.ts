import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  ComponentFactoryResolver,
  ComponentFactory,
  Type
} from '@angular/core';

import { Router, ActivatedRouteSnapshot, Event, NavigationEnd } from '@angular/router'

@Component({
  template: `
  <div class="card" style="padding: 10px; padding-top: 5px; margin-top: 10px;">
    <ng-container #contextMenuSectionContainer ></ng-container>
  </div>`
})
export class ContextMenuSectionComponent {
  @ViewChild("contextMenuSectionContainer", { read: ViewContainerRef, static: true })
  container: ViewContainerRef

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public addComponent(component: Type<Component>): ComponentRef<Component> {
    let factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(component)
    return this.container.createComponent(factory)
  }
}

@Component({
  selector: 'app-side-bars',
  template: `
  <div class="container-fluid">
    <ng-container #contextMenuContainer></ng-container>
  </div>`
})
export class ContextMenuComponent implements OnInit {
  @ViewChild("contextMenuContainer", { read: ViewContainerRef, static: true })
  contextMenuContainer: ViewContainerRef;
  contextMenuSectionComponents: ComponentRef<ContextMenuSectionComponent>[] = new Array<ComponentRef<ContextMenuSectionComponent>>()

  constructor(private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.router.events
    .filter(e => e instanceof NavigationEnd)
    .forEach(e => {
      this.updateContextMenuContent(this.router.routerState.snapshot.root)
    })
  }


  private updateContextMenuContent(snapshot: ActivatedRouteSnapshot): void {
    this.clearContextMenu();
    let factory: ComponentFactory<ContextMenuSectionComponent> = this.componentFactoryResolver.resolveComponentFactory(ContextMenuSectionComponent)
    let componentsArray: any = (snapshot.data as { contextMenu: Component[] }).contextMenu;

    if (componentsArray !== undefined) {
      for (let components of componentsArray) {
        let componentRef: ComponentRef<ContextMenuSectionComponent> = this.contextMenuContainer.createComponent(factory)
        this.contextMenuSectionComponents.push(componentRef)

        if (components instanceof Array) {
          for (let component of components) {
            componentRef.instance.addComponent(component)
          }
        } else {
          componentRef.instance.addComponent(components)
        }
      }
    }

    for (let childSnapshot of snapshot.children) {
      this.updateContextMenuContent(childSnapshot)
    }
  }

  private clearContextMenu() {
    for (let contextSectionComponent of this.contextMenuSectionComponents) {
      contextSectionComponent.destroy()
    }
    this.contextMenuContainer.clear()
    this.contextMenuSectionComponents = []
  }

}