import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsSlider } from './products-slider';

describe('ProductsSlider', () => {
  let component: ProductsSlider;
  let fixture: ComponentFixture<ProductsSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
