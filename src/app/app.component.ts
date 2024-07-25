import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container p-4">
      <div>{{title}}</div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  title = 'Budget Builder'
}
