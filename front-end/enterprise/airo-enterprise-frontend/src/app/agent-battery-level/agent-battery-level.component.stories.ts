import { Meta, StoryObj } from '@storybook/angular';
import { AgentBatteryLevelComponent } from './agent-battery-level.component';
import { MatIconModule } from '@angular/material/icon';

export default {
    title: 'Components/AgentBatteryLevel',
    component: AgentBatteryLevelComponent,
    decorators: [
        (story) => ({
            moduleMetadata: {
                imports: [MatIconModule],
            },
            template: `<div style="padding: 3rem">${story()}</div>`,
        }),
    ],
} as Meta;

type Story = StoryObj<AgentBatteryLevelComponent>;

export const FullBattery: Story = {
    args: {
        batteryLevel: 100
    },
};

export const HalfBattery: Story = {
    args: {
        batteryLevel: 50
    },
};

export const LowBattery: Story = {
    args: {
        batteryLevel: 10
    },
};

export const CriticalBattery: Story = {
    args: {
        batteryLevel: 3
    },
};
