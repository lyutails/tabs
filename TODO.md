Create a tab group that reads projected tab components, derives the enabled tabs, and activates the first enabled tab. Use a content query and `@let`. ng-container + ng-template.


@Component({
  selector: 'app-tab',
  standalone: true,
  template: ``,
})
export class Tab {     
  label = input.required<string>();
  disabled = input(false);
}


@Component({
  selector: 'app-tab-group',
  standalone: true,
  template: ``,
})
export class TabGroup {
  
}