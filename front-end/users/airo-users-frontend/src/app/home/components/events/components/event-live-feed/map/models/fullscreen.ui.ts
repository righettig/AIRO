import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from '@babylonjs/gui/2D';

export class FullscreenButton {
    private buttonBackground!: Rectangle;

    constructor(private onClickHandler: () => void) {
        this.createButton();
    }

    private createButton() {
        // Create a full-screen 2D UI for compass overlay
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create a small rectangle for the button background
        this.buttonBackground = new Rectangle();
        this.buttonBackground.width = "120px";
        this.buttonBackground.height = "60px";
        this.buttonBackground.cornerRadius = 10;
        this.buttonBackground.color = "white";
        this.buttonBackground.thickness = 2;
        this.buttonBackground.background = "black";
        this.buttonBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.buttonBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.buttonBackground.top = "10px";
        this.buttonBackground.left = "10px";
        ui.addControl(this.buttonBackground);

        const label = new TextBlock();
        label.text = "Fullscreen";
        label.color = "red";
        label.fontSize = 18;
        this.buttonBackground.addControl(label);

        this.buttonBackground.onPointerClickObservable.add(() => {
            this.onClickHandler();
        });
    }
}