import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  ComponentFactoryResolver,
  ComponentFactory,
  Type
} from '@angular/core';

import { Router, ActivatedRouteSnapshot, Event, NavigationEnd } from '@angular/router'
import { ISubscription } from 'rxjs/Subscription'
import { unescapeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  @ViewChild("navMenuTarget", { read: ViewContainerRef })
  navMenuTarget: ViewContainerRef

  navMenuComponent: ComponentRef<Component>

  constructor(private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) { 
  }

  ngOnInit() {
    this.router.events
    .filter(e => e instanceof NavigationEnd)
    .forEach(e => {
      this.updateContent(this.router.routerState.snapshot.root)
    })
  }

  private updateContent(snapshot: ActivatedRouteSnapshot): void {
    this.clearSidebar()
    let navMenu: any = (snapshot.data as { navMenu: Component }).navMenu

    if (navMenu != undefined) {
      let factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(navMenu)
      let componentRef: ComponentRef<Component> = this.navMenuTarget.createComponent(factory)
      this.navMenuComponent = componentRef
    }

    for (let childSnapshot of snapshot.children) {
      this.updateContent(childSnapshot)
    }
  }

  private clearSidebar() {
    if (this.navMenuComponent) {
      this.navMenuComponent.destroy()
    }
    if (this.navMenuTarget) {
      this.navMenuTarget.clear()
    }
    this.navMenuComponent = undefined
  }

}
