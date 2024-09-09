import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountTypeSelectionComponent } from './account-type-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from "@angular/material/select/testing";

let loader: HarnessLoader;

describe('AccountTypeSelectionComponent', () => {
    let component: AccountTypeSelectionComponent;
    let fixture: ComponentFixture<AccountTypeSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AccountTypeSelectionComponent,
                MatSelectModule,
                MatIconModule,
                FormsModule,
                NoopAnimationsModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountTypeSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have "free" as the default account type', () => {
        expect(component.accountType).toBe('free');
    });

    it('should display the account type options', async () => {
        const selectHarness = await loader.getHarness(MatSelectHarness);
        await selectHarness.open();

        const options = await selectHarness.getOptions();
        const optionsText = await Promise.all(options.map(async el => await el.getText()));
        
        expect(options.length).toBe(2);
        expect(optionsText[0].trim()).toBe('Free');
        expect(optionsText[1].trim()).toBe('Pro');
    });

    it('should emit the selected account type when changed', async () => {
        spyOn(component.accountTypeChange, 'emit');

        const selectHarness = await loader.getHarness(MatSelectHarness);
        await selectHarness.open();

        const options = await selectHarness.getOptions();
        await options[1].click();

        expect(component.accountType).toBe('pro');
        expect(component.accountTypeChange.emit).toHaveBeenCalledWith('pro');
    });
});
