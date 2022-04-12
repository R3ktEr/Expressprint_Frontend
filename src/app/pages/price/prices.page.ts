import {Component, OnInit} from '@angular/core';
import {PriceService} from 'src/app/services/prices.service';
import {PricesRequest} from '../../model/Products';
import {AuthService} from '../../services/auth.service';
import {_User} from '../../model/User';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EndedType, ImpressionsTypes, SheetSize, ThicknessType} from "../../model/Enums";

@Component({
  selector: 'app-price',
  templateUrl: './prices.page.html',
  styleUrls: ['./prices.page.scss'],
})
export class PricesPage implements OnInit {

  public formPrices: FormGroup;
  public prices: PricesRequest;
  public isAdmin: boolean;
  private user: _User;

  constructor(private fgb: FormBuilder, private priceService: PriceService, private authS: AuthService, private route: Router) {
    this.formPrices = this.fgb.group({
      priceColor: ['', Validators.required],
      priceBnW: ['', Validators.required],
      priceCopy:['', Validators.required],
      priceNE:['', Validators.required],
      priceBound:['', Validators.required],
      priceStapled:['', Validators.required],
      priceTwoHoles:['', Validators.required],
      priceFourHoles:['', Validators.required],
      priceNormal:['', Validators.required],
      priceTwoPages:['', Validators.required],
      priceTwoSlides:['', Validators.required],
      priceFourSlides:['', Validators.required],
      priceA3:['', Validators.required],
      priceA4:['', Validators.required],
      priceA5:['', Validators.required],
      priceG80:['', Validators.required],
      priceG160:['', Validators.required],
      priceG280:['', Validators.required],
    });
    /*this.formPrices = {
      priceColor: '',
      priceBnW: '',
      priceCopy:'',
      priceNE:'',
      priceBound:'',
      priceStapled:'',
      priceTwoHoles:'',
      priceFourHoles:'',
      priceNormal:'',
      priceTwoPages:'',
      priceTwoSlides:'',
      priceFourSlides:'',
      priceA3:'',
      priceA4:'',
      priceA5:'',
      priceG80:'',
      priceG160:'',
      priceG280:'',
    };*/
  }

  ngOnInit(): void {
    this.getPrices();
  }

  async ionViewWillEnter(): Promise<void> {
    this.user = await this.authS.loadSession();
    this.isAdmin = this.user.admin;
  }

  public getPrices(): void {
    this.priceService.getAllPrices().forEach(value => {
      value.forEach(value1 => {
        this.prices = value1;
        this.formPrices.get('priceBnW').setValue(value1.Color[0].price);
        this.formPrices.get('priceColor').setValue(value1.Color[1].price);
        this.formPrices.get('priceCopy').setValue(value1.Copy[0].price);
        this.formPrices.get('priceNE').setValue(value1.Endeds[0].price);
        this.formPrices.get('priceBound').setValue(value1.Endeds[1].price);
        this.formPrices.get('priceStapled').setValue(value1.Endeds[2].price);
        this.formPrices.get('priceTwoHoles').setValue(value1.Endeds[3].price);
        this.formPrices.get('priceFourHoles').setValue(value1.Endeds[4].price);
        this.formPrices.get('priceNormal').setValue(value1.ImpressionPerSide[0].price);
        this.formPrices.get('priceTwoPages').setValue(value1.ImpressionPerSide[1].price);
        this.formPrices.get('priceTwoSlides').setValue(value1.ImpressionPerSide[2].price);
        this.formPrices.get('priceFourSlides').setValue(value1.ImpressionPerSide[3].price);
        this.formPrices.get('priceA3').setValue(value1.Sizes[0].price);
        this.formPrices.get('priceA4').setValue(value1.Sizes[1].price);
        this.formPrices.get('priceA5').setValue(value1.Sizes[2].price);
        this.formPrices.get('priceG80').setValue(value1.Thickness[0].price);
        this.formPrices.get('priceG160').setValue(value1.Thickness[1].price);
        this.formPrices.get('priceG280').setValue(value1.Thickness[2].price);
        /*this.formPrices.priceColor = value1.Color[0].price;
        this.formPrices.priceBnW = value1.Color[1].price;
        this.formPrices.priceCopy = value1.Copy[0].price;
        this.formPrices.priceNE = value1.Endeds[0].price;
        this.formPrices.priceBound = value1.Endeds[1].price;
        this.formPrices.priceStapled = value1.Endeds[2].price;
        this.formPrices.priceTwoHoles = value1.Endeds[3].price;
        this.formPrices.priceFourHoles = value1.Endeds[4].price;
        this.formPrices.priceNormal = value1.ImpressionPerSide[0].price;
        this.formPrices.priceTwoPages = value1.ImpressionPerSide[1].price;
        this.formPrices.priceTwoSlides = value1.ImpressionPerSide[2].price;
        this.formPrices.priceFourSlides = value1.ImpressionPerSide[3].price;
        this.formPrices.priceA3 = value1.Sizes[0].price;
        this.formPrices.priceA4 = value1.Sizes[1].price;
        this.formPrices.priceA5 = value1.Sizes[2].price;
        this.formPrices.priceG80 = value1.Thickness[0].price;
        this.formPrices.priceG160 = value1.Thickness[1].price;
        this.formPrices.priceG280 = value1.Thickness[2].price;*/
      });
    });
  }

  public goBack(): void{
    this.route.navigate(['private/tabs/tab1']);
  }

  public sendNewPrices(): void{
    const newPricesArray: PricesRequest[] = [];
    const newPrices: PricesRequest = {
      Color: [
        {
          price: this.formPrices.get('priceBnW').value,
          isColor: false
        },
        {
          price: this.formPrices.get('priceColor').value,
          isColor: true
        }
      ],
      Copy: [
        {
          price: this.formPrices.get('priceCopy').value
        }
      ],
      Endeds: [
        {
          price: this.formPrices.get('priceNE').value,
          endedType: EndedType.no_ended
        },
        {
          price: this.formPrices.get('priceBound').value,
          endedType: EndedType.bound
        },
        {
          price: this.formPrices.get('priceStapled').value,
          endedType: EndedType.stapled
        },
        {
          price: this.formPrices.get('priceTwoHoles').value,
          endedType: EndedType.twoHoles
        },
        {
          price: this.formPrices.get('priceFourHoles').value,
          endedType: EndedType.fourHoles
        }
      ],
      ImpressionPerSide: [
        {
          price: this.formPrices.get('priceNormal').value,
          impressionsTypes: ImpressionsTypes.normal
        },
        {
          price: this.formPrices.get('priceTwoPages').value,
          impressionsTypes: ImpressionsTypes.twoPages
        },
        {
          price: this.formPrices.get('priceTwoSlides').value,
          impressionsTypes: ImpressionsTypes.twoSlides
        },
        {
          price: this.formPrices.get('priceFourSlides').value,
          impressionsTypes: ImpressionsTypes.fourSlides
        }
      ],
      Sizes: [
        //TODO cambiar sizeOfSheet¿?
        {
          price: this.formPrices.get('priceA3').value,
          sheetSize: SheetSize.A3,
          sizeOfSheet: 'A3'
        },
        {
          price: this.formPrices.get('priceA4').value,
          sheetSize: SheetSize.A4,
          sizeOfSheet: 'A4'
        },
        {
          price: this.formPrices.get('priceA5').value,
          sheetSize: SheetSize.A5,
          sizeOfSheet: 'A5'
        }
      ],
      Thickness: [
        //TODO cambiar descripción¿?
        {
          price: this.formPrices.get('priceG80').value,
          thicknessType: ThicknessType.G80,
          description: '80 g'
        },
        {
          price: this.formPrices.get('priceG160').value,
          thicknessType: ThicknessType.G160,
          description: '160 g'
        },
        {
          price: this.formPrices.get('priceG280').value,
          thicknessType: ThicknessType.G280,
          description: '280 g'
        }
      ]
    };
    newPricesArray.push(newPrices);
    this.priceService.changeAllPrices(newPricesArray).subscribe(() => {
      this.route.navigate(['private/tabs/tab1']);
    });
  }

  public getControlName(name: string): string {
    if (name === 'no_ended') {
      return 'priceNE';
    } else if (name === 'bound') {
      return 'priceBound';
    } else if (name === 'stapled') {
      return 'priceStapled';
    } else if (name === 'twoHoles') {
      return 'priceTwoHoles';
    } else if (name === 'fourHoles') {
      return 'priceFourHoles';
    } else if (name === 'normal') {
      return 'priceNormal';
    } else if (name === 'twoPages') {
      return 'priceTwoPages';
    } else if (name === 'twoSlides') {
      return 'priceTwoSlides';
    } else if (name === 'fourSlides') {
      return 'priceFourSlides';
    } else if (name === 'A3') {
      return 'priceA3';
    } else if (name === 'A4') {
      return 'priceA4';
    } else if (name === 'A5') {
      return 'priceA5';
    } else if (name === 'G80') {
      return 'priceG80';
    } else if (name === 'G160') {
      return 'priceG160';
    } else if (name === 'G280') {
      return 'priceG280';
    }
  }

}
