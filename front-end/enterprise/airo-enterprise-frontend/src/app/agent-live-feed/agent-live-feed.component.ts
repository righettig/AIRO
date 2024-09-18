import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  Mesh,
  StandardMaterial,
  Color3,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { AgentState } from '../agent-details/agent-details.component';
import { Status } from '../models/status.enum';

@Component({
  selector: 'app-agent-live-feed',
  standalone: true,
  templateUrl: './agent-live-feed.component.html',
  styleUrl: './agent-live-feed.component.scss',
})
export class AgentLiveFeedComponent implements AfterViewInit, OnChanges {
  @ViewChild('renderCanvas', { static: true })
  renderCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() agentState!: AgentState;

  public engine!: Engine;

  private scene!: Scene;
  private topDownCamera!: ArcRotateCamera;
  private freeCamera!: FreeCamera;
  private isTopDownCamera = false; // Track the current view
  private agentMeshes: Mesh[] = [];

  private readonly OFFLINE_COLOR = new Color3(1, 0, 0);
  private readonly UNAVAILABLE_COLOR = new Color3(0.5, 0.5, 0.5);
  private readonly DEFAULT_COLOR = new Color3(0.8, 0.5, 0.3);

  ngAfterViewInit(): void {
    const canvas = this.renderCanvas.nativeElement;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    this.initializeScene(canvas);

    this.engine.runRenderLoop(() => this.scene.render());

    window.addEventListener('resize', () => this.engine.resize());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agentState']) {
      this.updateAgentState(changes['agentState'].currentValue);
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 't') {
      this.toggleCamera();
    }
  }

  public toggleCamera(): void {
    this.isTopDownCamera = !this.isTopDownCamera;
    this.scene.activeCamera = this.isTopDownCamera
      ? this.topDownCamera
      : this.freeCamera;
  }

  private initializeScene(canvas: HTMLCanvasElement): void {
    this.createCameras(canvas);
    this.createLight();
    this.createGround();
    this.createRooms();
    this.createAnymalAgent(this.agentState.position);
  }

  private createCameras(canvas: HTMLCanvasElement): void {
    this.topDownCamera = new ArcRotateCamera(
      'topDownCamera',
      -Math.PI / 2,
      Math.PI / 2.5,
      50,
      Vector3.Zero(),
      this.scene
    );
    this.topDownCamera.attachControl(canvas, true);

    this.freeCamera = new FreeCamera(
      'freeCamera',
      new Vector3(0, 10, -30),
      this.scene
    );
    this.freeCamera.setTarget(Vector3.Zero());
    this.freeCamera.attachControl(canvas, true);

    this.scene.activeCamera = this.freeCamera;
  }

  private createLight(): void {
    new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
  }

  private createGround(): void {
    const gridMaterial = new GridMaterial('grid', this.scene);
    gridMaterial.gridRatio = 1;
    gridMaterial.majorUnitFrequency = 1;
    gridMaterial.minorUnitVisibility = 0.45;
    gridMaterial.backFaceCulling = false;
    gridMaterial.mainColor = new Color3(1, 1, 1);
    gridMaterial.lineColor = new Color3(0.5, 0.5, 0.5);

    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: 50, height: 50, subdivisions: 50 },
      this.scene
    );
    ground.material = gridMaterial;
  }

  private createRooms(): void {
    const roomConfigs = [
      { position: new Vector3(-10, 1.5, -10), color: new Color3(1, 0, 0) },
      { position: new Vector3(10, 1.5, -10),  color: new Color3(0, 1, 0) },
      { position: new Vector3(-10, 1.5, 10),  color: new Color3(0, 0, 1) },
    ];

    roomConfigs.forEach((config) =>
      this.createRoom(config.position, 10, 3, 0.2, config.color)
    );
  }

  private createRoom(
    position: Vector3,
    size: number,
    height: number,
    thickness: number,
    objectColor: Color3
  ): void {
    const halfSize = size / 2;

    const wall1 = MeshBuilder.CreateBox(
      'wall1',
      { width: size, height: height, depth: thickness },
      this.scene
    );
    wall1.position = new Vector3(position.x, position.y, position.z - halfSize);

    const wall2 = MeshBuilder.CreateBox(
      'wall2',
      { width: size, height: height, depth: thickness },
      this.scene
    );
    wall2.position = new Vector3(position.x, position.y, position.z + halfSize);

    const wall3 = MeshBuilder.CreateBox(
      'wall3',
      { width: thickness, height: height, depth: size },
      this.scene
    );
    wall3.position = new Vector3(position.x - halfSize, position.y, position.z);

    const wall4 = MeshBuilder.CreateBox(
      'wall4',
      { width: thickness, height: height, depth: size },
      this.scene
    );
    wall4.position = new Vector3(position.x + halfSize, position.y, position.z);

    this.createRoomObject(position, objectColor);
  }

  private createRoomObject(position: Vector3, color: Color3): void {
    const object = MeshBuilder.CreateBox('roomObject', { size: 1 }, this.scene);
    object.position = new Vector3(position.x, 0.5, position.z);

    const material = new StandardMaterial('objectMaterial', this.scene);
    material.diffuseColor = color;
    object.material = material;
  }

  private createAnymalAgent(position: Vector3): void {
    this.clearAgentMeshes();

    const body = MeshBuilder.CreateBox(
      'body',
      { width: 1, height: 0.5, depth: 2 },
      this.scene
    );
    body.position = new Vector3(position.x, position.y + 0.25, position.z);
    this.agentMeshes.push(body);

    const head = MeshBuilder.CreateBox(
      'head',
      { width: 0.6, height: 0.6, depth: 0.6 },
      this.scene
    );
    head.position = new Vector3(
      position.x,
      position.y + 0.65,
      position.z - 1.3
    );
    this.agentMeshes.push(head);

    const ear1 = MeshBuilder.CreateBox(
      'ear1',
      { width: 0.2, height: 0.4, depth: 0.1 },
      this.scene
    );
    ear1.position = new Vector3(
      position.x - 0.25,
      position.y + 1,
      position.z - 1.5
    );
    this.agentMeshes.push(ear1);

    const ear2 = MeshBuilder.CreateBox(
      'ear2',
      { width: 0.2, height: 0.4, depth: 0.1 },
      this.scene
    );
    ear2.position = new Vector3(
      position.x + 0.25,
      position.y + 1,
      position.z - 1.5
    );
    this.agentMeshes.push(ear2);

    const legs = [
      { x: -0.4, z: 0.7 },
      { x: 0.4, z: 0.7 },
      { x: -0.4, z: -0.7 },
      { x: 0.4, z: -0.7 },
    ];
    legs.forEach((leg, i) => {
      const legMesh = MeshBuilder.CreateCylinder(
        `leg${i}`,
        { height: 0.6, diameter: 0.2 },
        this.scene
      );
      legMesh.position = new Vector3(position.x + leg.x, position.y - 0.3, position.z + leg.z);
      this.agentMeshes.push(legMesh);
    });

    const tail = MeshBuilder.CreateCylinder(
      'tail',
      { height: 0.8, diameter: 0.1 },
      this.scene
    );
    tail.position = new Vector3(position.x, position.y + 0.2, position.z + 1.2);
    tail.rotation.x = Math.PI / 4;
    this.agentMeshes.push(tail);

    const dogMaterial = new StandardMaterial('dogMaterial', this.scene);
    dogMaterial.diffuseColor = this.DEFAULT_COLOR;
    this.agentMeshes.forEach((mesh) => (mesh.material = dogMaterial));
  }

  private clearAgentMeshes(): void {
    this.agentMeshes.forEach((mesh) => mesh.dispose());
    this.agentMeshes = [];
  }

  private updateAgentState(state: AgentState): void {
    this.clearAgentMeshes();
    this.createAnymalAgent(state.position);
    this.updateAgentColor(state.status);
    
    if (this.isTopDownCamera) {
      this.updateAgentLabel(state.name);
    } else {
      // TODO: hide agentLabel
    }
   
    this.showBatteryDepletedAlert(state.name, state.batteryLevel);
  }

  private updateAgentColor(status: Status): void {
    let color = this.DEFAULT_COLOR;
    if (status === Status.Offline) color = this.OFFLINE_COLOR;
    else if (status === Status.Unavailable) color = this.UNAVAILABLE_COLOR;

    this.agentMeshes.forEach((mesh) => {
      const material = <StandardMaterial>mesh.material;
      material.diffuseColor = color;
    });
  }

  private updateAgentLabel(agentName: string): void {
    const texture = AdvancedDynamicTexture.CreateFullscreenUI('agentLabel');
    const label = new TextBlock();
    label.text = agentName;
    label.color = 'white';
    label.fontSize = 24;
    label.top = '-40px';
    texture.addControl(label);
  }

  private showBatteryDepletedAlert(agentName: string, batteryLevel: number): void {
    if (batteryLevel < 99) {
      // Create a GUI
      const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
        'UI',
        true,
        this.scene
      );

      // Create a text block in GUI
      const guiTextBlock = new TextBlock();
      guiTextBlock.text = `Battery almost depleted for '${agentName}'`;
      guiTextBlock.color = 'white';
      guiTextBlock.fontSize = 24;
      guiTextBlock.textHorizontalAlignment =
        TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      guiTextBlock.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      guiTextBlock.paddingLeft = '10px'; // Add padding from the left
      guiTextBlock.paddingTop = '10px'; // Add padding from the top
      advancedTexture.addControl(guiTextBlock);
    }
  }
}
