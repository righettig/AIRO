import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export class Camera {
    private camera!: ArcRotateCamera;

    private initialCameraAlpha!: number;
    private initialCameraBeta!: number;
    private initialCameraPosition!: Vector3;

    get alpha() {
        return this.camera.alpha;
    }

    get onViewMatrixChangedObservable() {
        return this.camera.onViewMatrixChangedObservable;
    }

    set upperRadiusLimit(value: number) {
        this.camera.upperRadiusLimit = value;
        this.camera.radius = value / 1.5;
    }

    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        const minBeta = 0; // Minimum angle (45 degrees)
        const maxBeta = Math.PI / 2.25; // Maximum angle (120 degrees)
        const minZoomDistance = 15; // Minimum zoom-in distance

        // Store initial camera orientation and position
        this.initialCameraAlpha = 0;
        this.initialCameraBeta = (maxBeta + minBeta) / 2;
        this.initialCameraPosition = new Vector3(0, -2.5, 0);

        // Create a camera and light for the scene
        this.camera = new ArcRotateCamera(
            'Camera',
            this.initialCameraAlpha,
            this.initialCameraBeta,
            0,
            this.createCenterVector(),
            scene
        );
        this.camera.attachControl(canvas, true);

        this.camera.lowerBetaLimit = minBeta;
        this.camera.upperBetaLimit = maxBeta;
        this.camera.lowerRadiusLimit = minZoomDistance; // Set zoom limits
    }

    public resetCameraPosition() {
        // Reset the camera's target (the center of the scene)
        this.camera.setTarget(this.createCenterVector());

        // Reset the camera's alpha and beta to the initial settings
        this.camera.alpha = this.initialCameraAlpha;
        this.camera.beta = this.initialCameraBeta;
    }

    private createCenterVector(): Vector3 {
        return new Vector3(
            this.initialCameraPosition.x,
            this.initialCameraPosition.y,
            this.initialCameraPosition.z);
    }
}