import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { AgentBatteryLevelComponent } from './agent-battery-level.component';
import { By } from '@angular/platform-browser';

describe('AgentBatteryLevelComponent', () => {
  let component: AgentBatteryLevelComponent;
  let fixture: ComponentFixture<AgentBatteryLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, AgentBatteryLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentBatteryLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const testCases = [
    { level: 4, expectedIcon: 'battery_alert' },
    { level: 5, expectedIcon: 'battery_2_bar' },
    { level: 7, expectedIcon: 'battery_2_bar' },
    { level: 10, expectedIcon: 'battery_2_bar' },
    { level: 20, expectedIcon: 'battery_3_bar' },
    { level: 25, expectedIcon: 'battery_3_bar' },
    { level: 30, expectedIcon: 'battery_4_bar' },
    { level: 50, expectedIcon: 'battery_4_bar' },
  ];

  testCases.forEach(({ level, expectedIcon }) => {
    it(`should display ${expectedIcon} icon when batteryLevel is ${level}`, () => {
      component.batteryLevel = level;
      fixture.detectChanges();
      const icon = getMatIcon();
      expect(icon.textContent).toContain(expectedIcon);
    });
  });

  it('should not display any icon when batteryLevel is above 50', () => {
    component.batteryLevel = 60;
    fixture.detectChanges();
    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(icons.length).toBe(0);
  });

  function getMatIcon(): HTMLElement {
    return fixture.debugElement.query(By.css('mat-icon')).nativeElement;
  }
});
