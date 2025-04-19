import { Component } from "@angular/core";
import { ButtonComponent } from "./Button";

@Component({
  selector: 'ComboBox',
  imports: [ButtonComponent],
  template: `<Button>
    <div></div>
  </Button>`,
  styleUrl: 'ComboBox.scss',
})
export class ComboBox {

}