import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredefinedUserSelectionComponent } from './predefined-user-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from "@angular/material/select/testing";

let loader: HarnessLoader;

describe('PredefinedUserSelectionComponent', () => {
    let component: PredefinedUserSelectionComponent;
    let fixture: ComponentFixture<PredefinedUserSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                PredefinedUserSelectionComponent,
                MatSelectModule,
                MatIconModule,
                NoopAnimationsModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PredefinedUserSelectionComponent);
        component = fixture.componentInstance;
        component.users = [
            { email: 'user1@example.com', password: 'pass1' },
            { email: 'user2@example.com', password: 'pass2' },
        ];
        fixture.detectChanges();

        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display users in the select dropdown', async () => {
        const selectHarness = await loader.getHarness(MatSelectHarness);
        await selectHarness.open();

        const options = await selectHarness.getOptions();
        const optionsText = await Promise.all(options.map(async el => await el.getText()));
        
        expect(options.length).toBe(2);
        expect(optionsText[0].trim()).toBe('user1@example.com');
        expect(optionsText[1].trim()).toBe('user2@example.com');
    });

    it('should emit selected user when user is changed', () => {
        spyOn(component.userSelected, 'emit');

        const matSelect = fixture.debugElement.query(By.css('mat-select'));
        matSelect.triggerEventHandler('valueChange', component.users[1]);

        expect(component.userSelected.emit).toHaveBeenCalledWith({ email: 'user2@example.com', password: 'pass2' });
    });

    it('should show the account_circle icon', () => {
        const icon = fixture.debugElement.query(By.css('mat-icon'));
        expect(icon.nativeElement.textContent).toBe('account_circle');
    });
});
