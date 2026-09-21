import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleHighlight } from './title-highlight';
import { App } from '../../app';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TitleHighlight', () => {
  let fixture: ComponentFixture<App>;
  let debug: DebugElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    debug = fixture.debugElement.query(By.directive(TitleHighlight));
  });

  it('should create an instance', () => {
    const directive = new TitleHighlight();
    expect(directive).toBeTruthy();
  });

  it('should have initial host styles', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.style.color).toBe('var(--font-enabled-tab-color)');
    expect(title.style.transition).toBe('all 0.3s ease-in-out');
  });

  it('should use the specified color on mouse enter', async () => {
    const title = fixture.nativeElement.querySelector('h1');

    debug.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect(debug.nativeElement.style.color).toBe('var(--primary-color)');
  })
});
