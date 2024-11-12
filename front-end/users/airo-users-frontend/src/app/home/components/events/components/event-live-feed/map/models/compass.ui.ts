import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from '@babylonjs/gui/2D';
import { Camera } from './camera';

export class Compass {
    private compassBackground!: Rectangle;

    constructor(private camera: Camera) {
        this.createCompass();
    }

    private createCompass() {
        // Create a full-screen 2D UI for compass overlay
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create a small rectangle for the compass background
        this.compassBackground = new Rectangle();
        this.compassBackground.width = "80px";
        this.compassBackground.height = "80px";
        this.compassBackground.cornerRadius = 10;
        this.compassBackground.color = "white";
        this.compassBackground.thickness = 2;
        this.compassBackground.background = "black";
        this.compassBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.compassBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.compassBackground.top = "10px";
        this.compassBackground.left = "-10px";
        ui.addControl(this.compassBackground);

        // Add "N" for North
        const northText = new TextBlock();
        northText.text = "N";
        northText.color = "red";
        northText.fontSize = 24;
        northText.top = "-25px";
        this.compassBackground.addControl(northText);

        // Add "E" for East
        const eastText = new TextBlock();
        eastText.text = "E";
        eastText.color = "white";
        eastText.fontSize = 24;
        eastText.left = "25px";
        this.compassBackground.addControl(eastText);

        // Add "S" for South
        const southText = new TextBlock();
        southText.text = "S";
        southText.color = "white";
        southText.fontSize = 24;
        southText.top = "25px";
        this.compassBackground.addControl(southText);

        // Add "W" for West
        const westText = new TextBlock();
        westText.text = "W";
        westText.color = "white";
        westText.fontSize = 24;
        westText.left = "-25px";
        this.compassBackground.addControl(westText);

        // Add double-click event listener to reset camera position
        this.compassBackground.onPointerClickObservable.add(() => {
            this.camera.resetCameraPosition();
        });

        // Update compass orientation whenever the camera rotates
        this.camera.onViewMatrixChangedObservable.add(() => {
            this.updateCompass();
        });
    }

    private updateCompass() {
        // Rotate the compass according to the camera's Y-axis rotation (alpha)
        const rotationAngle = this.camera.alpha;
        this.compassBackground.rotation = rotationAngle;
    }
}