import {Component, OnInit} from '@angular/core';
import {PriceService} from 'src/app/services/prices.service';
import {PricesRequest} from '../../model/Products';
import {AuthService} from '../../services/auth.service';
import {_User} from '../../model/User';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EndedType, ImpressionsTypes, SheetSize, ThicknessType} from '../../model/Enums';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-price',
  templateUrl: './prices.page.html',
  styleUrls: ['./prices.page.scss'],
})
export class PricesPage implements OnInit {

  public formPrices: FormGroup;
  public prices: PricesRequest;
  public isAdmin: boolean;
  public noPrices = false;
  public noDDBBPrices: PricesRequest;
  private user: _User;

  constructor(private notS: NotificationsService, private fgb: FormBuilder, private priceService: PriceService
    , private authS: AuthService, private route: Router) {
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
    this.noDDBBPrices = {
      Color: [
        {
          price: 0.0,
          isColor: false
        },
        {
          price: 0.0,
          isColor: true
        }
      ],
      Copy: [
        {
          price: 0.0
        }
      ],
      Endeds: [
        {
          price: 0.0,
          endedType: EndedType.no_ended
        },
        {
          price: 0.0,
          endedType: EndedType.bound
        },
        {
          price: 0.0,
          endedType: EndedType.stapled
        },
        {
          price: 0.0,
          endedType: EndedType.twoHoles
        },
        {
          price: 0.0,
          endedType: EndedType.fourHoles
        }
      ],
      ImpressionPerSide: [
        {
          price: 0.0,
          impressionsTypes: ImpressionsTypes.normal
        },
        {
          price: 0.0,
          impressionsTypes: ImpressionsTypes.twoPages
        },
        {
          price: 0.0,
          impressionsTypes: ImpressionsTypes.twoSlides
        },
        {
          price: 0.0,
          impressionsTypes: ImpressionsTypes.fourSlides
        }
      ],
      Sizes: [
        //TODO cambiar sizeOfSheet¿?
        {
          price: 0.0,
          sheetSize: SheetSize.A3,
          sizeOfSheet: 'A3'
        },
        {
          price: 0.0,
          sheetSize: SheetSize.A4,
          sizeOfSheet: 'A4'
        },
        {
          price: 0.0,
          sheetSize: SheetSize.A5,
          sizeOfSheet: 'A5'
        }
      ],
      Thickness: [
        //TODO cambiar descripción¿?
        {
          price: 0.0,
          thicknessType: ThicknessType.G80,
          description: '80 g'
        },
        {
          price: 0.0,
          thicknessType: ThicknessType.G160,
          description: '160 g'
        },
        {
          price: 0.0,
          thicknessType: ThicknessType.G280,
          description: '280 g'
        }
      ]
    };
  }

  ngOnInit(): void {
    this.notS.presentLoading().then(async () => {
      this.getPrices();
      await this.notS.dismissLoading();
    });
  }

  async ionViewWillEnter(): Promise<void> {
    this.user = await this.authS.loadSession();
    this.isAdmin = this.user.admin;
  }

  public async getPrices(): Promise<void> {
    await this.priceService.getAllPrices().forEach(value => {
      value.forEach(value1 => {
        if(value1.Color === undefined){
          this.noPrices = true;
          this.prices = this.noDDBBPrices;
        }else{       

          value1.Endeds[0].endedType = 0;
          value1.Endeds[1].endedType = 1;
          value1.Endeds[2].endedType = 2;
          value1.Endeds[3].endedType = 3;
          value1.Endeds[4].endedType = 4;
          value1.ImpressionPerSide[0].impressionsTypes = 0;
          value1.ImpressionPerSide[1].impressionsTypes = 1;
          value1.ImpressionPerSide[2].impressionsTypes = 2;
          value1.ImpressionPerSide[3].impressionsTypes = 3;
          value1.Sizes[0].sheetSize = 0;
          value1.Sizes[1].sheetSize = 1;
          value1.Sizes[2].sheetSize = 2;
          value1.Thickness[0].thicknessType = 0;
          value1.Thickness[1].thicknessType = 1;
          value1.Thickness[2].thicknessType = 2;

          this.prices = value1;
        }

        this.formPrices.get('priceBnW').setValue(this.prices.Color[0].price);
        this.formPrices.get('priceColor').setValue(this.prices.Color[1].price);
        this.formPrices.get('priceCopy').setValue(this.prices.Copy[0].price);
        this.formPrices.get('priceNE').setValue(this.prices.Endeds[0].price);
        this.formPrices.get('priceBound').setValue(this.prices.Endeds[1].price);
        this.formPrices.get('priceStapled').setValue(this.prices.Endeds[2].price);
        this.formPrices.get('priceTwoHoles').setValue(this.prices.Endeds[3].price);
        this.formPrices.get('priceFourHoles').setValue(this.prices.Endeds[4].price);
        this.formPrices.get('priceNormal').setValue(this.prices.ImpressionPerSide[0].price);
        this.formPrices.get('priceTwoPages').setValue(this.prices.ImpressionPerSide[1].price);
        this.formPrices.get('priceTwoSlides').setValue(this.prices.ImpressionPerSide[2].price);
        this.formPrices.get('priceFourSlides').setValue(this.prices.ImpressionPerSide[3].price);
        this.formPrices.get('priceA3').setValue(this.prices.Sizes[0].price);
        this.formPrices.get('priceA4').setValue(this.prices.Sizes[1].price);
        this.formPrices.get('priceA5').setValue(this.prices.Sizes[2].price);
        this.formPrices.get('priceG80').setValue(this.prices.Thickness[0].price);
        this.formPrices.get('priceG160').setValue(this.prices.Thickness[1].price);
        this.formPrices.get('priceG280').setValue(this.prices.Thickness[2].price);
      });
    });
  }

  public goBack(): void{
    this.route.navigate(['private/tabs/tab1']);
  }

  public async sendNewPrices(): Promise<void>{
    const newPricesArray: PricesRequest[] = [{
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
    }];
    await this.notS.presentLoading();
    console.log(newPricesArray);
    await this.priceService.changeAllPrices(newPricesArray).toPromise().then(async () => {
      await this.notS.presentToast('Precios actualizados correctamente','success');
      await this.getPrices();
    }).catch(async () => {
      await this.notS.presentToast('Error al actualizar los precios','danger');
    });
    await this.notS.dismissLoading();
  }

  public getControlName(name: string, noDDBBPrices?: string): string {
    if (!noDDBBPrices) {
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
    } else {
      if (noDDBBPrices === 'Endeds') {
        if (name === '0') {
          return 'priceNE';
        } else if (name === '1') {
          return 'priceBound';
        } else if (name === '2') {
          return 'priceStapled';
        } else if (name === '3') {
          return 'priceTwoHoles';
        } else if (name === '4') {
          return 'priceFourHoles';
        }
      } else if (noDDBBPrices === 'ImpressionsPerSide') {
        if (name === '0') {
          return 'priceNormal';
        } else if (name === '1') {
          return 'priceTwoPages';
        } else if (name === '2') {
          return 'priceTwoSlides';
        } else if (name === '3') {
          return 'priceFourSlides';
        }
      } else if (noDDBBPrices === 'SheetSize') {
        if (name === '0') {
          return 'priceA3';
        } else if (name === '1') {
          return 'priceA4';
        } else if (name === '2') {
          return 'priceA5';
        }
      } else if (noDDBBPrices === 'Thickness') {
        if (name === '0') {
          return 'priceG80';
        } else if (name === '1') {
          return 'priceG160';
        } else if (name === '2') {
          return 'priceG280';
        }
      }
    }
  }

}
