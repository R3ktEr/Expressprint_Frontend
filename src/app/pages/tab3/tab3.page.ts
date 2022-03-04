import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
public orderForm:FormGroup
  constructor(public formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({
      nCopies:['',Validators.compose([Validators.required])],
      isColor:['',Validators.compose([Validators.required])],
      size:['',Validators.compose([Validators.required])],
      thickness:['',Validators.compose([Validators.required])],
      isTwoSides:['',Validators.compose([Validators.required])],
      finishType:['',Validators.compose([Validators.required])],
      impressionPerSide:['',Validators.compose([Validators.required])],
      isVertical:['',Validators.compose([Validators.required])],
      ringedPosition:['',Validators.compose([Validators.required])]
    })
  }

  addOrder(){
    console.log(this.orderForm.value);
  }
  

}
