import 'zone.js/dist/zone';
import { Component, inject, InjectionToken, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Token } from '@angular/compiler';

export const token = new InjectionToken<string>('string token');
export const token2 = new InjectionToken<string>('string token2');

@Component({
  selector: 'test',
  standalone: true,
  template: `
  <p>test of token: {{token}}</p>
  <p>test of token2: {{token2}}</p>
  `,
})
export class TestCompo {
  token = inject(token, { optional: true });
  token2 = inject(token2, { optional: true });
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, DialogModule, RouterOutlet],
  providers: [
    {
      provide: token,
      useValue: 'token from my-app',
    },
  ],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class App {
  name = 'Angular';
  dialog = inject(Dialog);
  injector = inject(Injector);

  ngOnInit() {
    // this.dialog.open(TestCompo, { injector: this.injector });
    // this.dialog.open(TestCompo, {
    //   injector: Injector.create({
    //     providers: [
    //       {
    //         provide: token,
    //         useValue: 'ovverrided token from App',
    //       },
    //     ],
    //     parent: this.injector,
    //   }),
    // });
  }
}

@Component({
  selector: 'my-route',
  standalone: true,
  imports: [CommonModule, DialogModule, RouterOutlet],
  // providers: [{ provide: token, useExisting: token2 }],
  template: `
<p>value of token: {{token}}</p>
<p>value of token2: {{token2}}</p>

    <router-outlet></router-outlet>
  `,
})
export class RouteCompoennt {
  name = 'Angular';
  dialog = inject(Dialog);
  injector = inject(Injector);
  token = inject(token);
  token2 = inject(token2);

  ngOnInit() {
    this.dialog.open(TestCompo, { injector: this.injector });
    this.dialog.open(TestCompo, {
      injector: Injector.create({
        providers: [
          {
            provide: token,
            useValue: 'ovverrided token from RouteCompoennt ',
          },
        ],
        parent: this.injector,
      }),
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      {
        path: '',
        providers: [
          {
            provide: token,
            useValue: 'token provided in route',
          },
          {
            provide: token2,
            useValue: 'token2 provided in route',
          },
        ],
        component: RouteCompoennt,
      },
    ]),
  ],
});
