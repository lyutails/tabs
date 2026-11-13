import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Result } from '../../../scripts/catalog-importer/catalog-importer.model';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'tabs-lab',
  styleUrl: './lab.scss',
  templateUrl: './lab.html',
})
export class Lab {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private loaderGLTF = new GLTFLoader();

  @Input() public rotationSpeedX: number = 0.02;
  @Input() public rotationSpeedY: number = 0.02;
  @Input() public size: number = 200;
  @Input() public texture: string =
    '/public/assets/pics/frost-and-ice-on-a-screen1.jpg';
  @Input() public cameraZ: number = 450;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClippinig') public farClippingPlane: number = 1000;

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private lightOne!: THREE.PointLight;
  private lightTwo!: THREE.PointLight;
  private lightThree!: THREE.PointLight;
  private lightFour!: THREE.PointLight;
  private lightFive!: THREE.PointLight;
  private lightSix!: THREE.PointLight;
  private controls!: OrbitControls;
  public isBrowser = false;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private hoveredObject: THREE.Object3D | null = null;
  private selectedObject: THREE.Object3D | null = null;
  selectedName = signal<string | null>(null);
  isCreamHovered = signal(false);
  private originalEmissive = new Map<
    THREE.Material,
    { color: THREE.Color; intensity: number }
  >(); private originalMaterials = new Map<
    THREE.Material,
    {
      color?: THREE.Color;
      emissive?: THREE.Color;
      emissiveIntensity?: number;
    }
  >();
  private labelRenderer!: CSS2DRenderer;
  private labels = new Map<THREE.Object3D, CSS2DObject>();
  private labelElements = new Map<THREE.Object3D, HTMLDivElement>();
  private composer!: EffectComposer;
  private outlinePass!: OutlinePass;
  isProductSliderOpen = signal(false);
  selectedProduct = signal<Result | null>(null);
  sliderX = signal(0);
  sliderY = signal(0);
  private productLabels = new Map<
    THREE.Object3D,
    {
      element: HTMLElement;
      anchorX: number;
      anchorY: number;
      anchorZ: number;
      offsetX: number;
      offsetY: number;
    }
  >();
  private chemistry!: THREE.Object3D;
  private chemistryPivot!: THREE.Group;
  private bubbleOne!: THREE.Object3D;
  private bubbleInitialY = 0;
  private bubbleFloatSpeed = 1.2;
  private bubbleFloatAmplitude = 0.32;
  private bubbleTwo!: THREE.Object3D;
  private bubbleTwoInitialY = 0;
  private bubbleTwoFloatSpeed = 1.2;
  private bubbleTwoFloatAmplitude = 0.32;
  private bubbleThree!: THREE.Object3D;
  private bubbleThreeInitialY = 0;
  private bubbleThreeFloatSpeed = 1.2;
  private bubbleThreeFloatAmplitude = 0.32;
  chemistryModelGLB =
    '/three/chemistry12.glb';
  bubbleOneModelGLB =
    '/three/bubble_1_1.glb';
  bubbleTwoModelGLB =
    '/three/bubble_2_1.glb';
  bubbleThreeModelGLB =
    '/three/bubble_3_1.glb';
  chemistryIngredientsVisible = signal(true);
  chemistryIngredientsPositioned = signal(false);
  readonly chemistryIngredients = [
    {
      name: 'Центелла',
      image: '/three/ingredients/centella2.png',
      query: 'centella',
      description: `Центелла азиатская (Centella Asiatica) и её производные 
      (Madecassoside, Asiaticoside) —
      успокаивающий растительный ингредиент, который помогает 
      уменьшать раздражение и поддерживать восстановление кожного барьера.`,
      color: '0, 255, 96',
    },
    {
      name: 'Пантенол',
      image: '/three/ingredients/b5.png',
      query: 'panthenol',
      description: `Пантенол (Panthenol, провитамин B5) — увлажняющий и 
      восстанавливающий компонент, который помогает поддерживать кожный 
      барьер и уменьшать раздражение.`,
      color: '255, 180, 60',
    },
    {
      name: 'Церамиды',
      image: '/three/ingredients/hexa3.png',
      query: 'ceramide',
      description: `Церамиды (Ceramides) — липиды, естественно присутствующие 
      в роговом слое кожи. Они укрепляют защитный барьер, уменьшают потерю 
      влаги и помогают коже сохранять мягкость и устойчивость к раздражителям.`,
      color: '255, 100, 180',
    },
    {
      name: 'Ниацинамид',
      image: '/three/ingredients/molec5.png',
      query: 'niacinamide',
      description: `Ниацинамид (Niacinamide, витамин B3) — многофункциональный актив, 
      который укрепляет кожный барьер, помогает регулировать выработку себума и 
      уменьшать пигментацию.`,
      color: '80, 180, 255',
    },
  ];
  dnaIngredientsVisible = signal(false);
  dnaIngredientsPositioned = signal(false);
  readonly dnaIngredients = [
    {
      name: 'PDRN',
      image: '/three/ingredients/dna1.png',
      query: 'dna',
      description: `PDRN (Polydeoxyribonucleotide) — фрагменты ДНК, обычно получаемые 
      из рыбного сырья, которые изучаются за способность поддерживать процессы 
      восстановления тканей и уменьшать воспаление.`,
      color: '255, 113, 106',
    }
  ];
  orangeIngredientsVisible = signal(false);
  orangeIngredientsPositioned = signal(false);
  readonly orangeIngredients = [
    {
      name: 'Витамин C',
      image: '/three/ingredients/orange.png',
      query: 'vitamin C',
      description: `Витамин C (Vitamin C) — антиоксидант, который помогает защищать 
      кожу от окислительного стресса, осветлять пигментацию и поддерживать синтез коллагена.`,
      color: '255, 84, 0',
    }
  ];
  ingredientTextColor = signal('255, 84, 0');
  readonly labIngredients = [
    ...this.chemistryIngredients,
    ...this.dnaIngredients,
    ...this.orangeIngredients,
  ];
  private readonly speed = 45;
  displayedText = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;
  @ViewChild('sceneContainer')
  private sceneContainerRef!: ElementRef<HTMLElement>;
  private chemistryRotationSpeed = 0.005;
  private resizeObserver?: ResizeObserver;
  private chemistryHorizontalOffset = 0;
  private get sceneContainer(): HTMLElement {
    return this.sceneContainerRef.nativeElement;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.camera) return;

    const rect = this.canvas.getBoundingClientRect();

    this.pointer.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = [this.chemistry].filter(
      (object): object is THREE.Object3D => !!object
    );

    const intersects = this.raycaster.intersectObjects(targets, true);
    const hitObject = intersects[0]?.object ?? null;

    let current: THREE.Object3D | null = hitObject;
    let nextHovered: THREE.Object3D | null = null;

    while (current) {
      if (targets.includes(current)) {
        nextHovered = current;
        break;
      }

      current = current.parent;
    }

    this.hoveredObject = nextHovered;

    const sliderOpen = this.isProductSliderOpen();

    if (sliderOpen && this.selectedObject) {
      this.setHighlight(this.selectedObject, true);
    }

    for (const object of targets) {
      if (sliderOpen && object === this.selectedObject) {
        continue;
      }

      this.setHighlight(object, object === nextHovered);
    }

    const outlinedObjects: THREE.Object3D[] = [];

    if (sliderOpen && this.selectedObject) {
      outlinedObjects.push(this.selectedObject);
    }

    if (nextHovered && nextHovered !== this.selectedObject) {
      outlinedObjects.push(nextHovered);
    }

    this.outlinePass.selectedObjects = outlinedObjects;

    this.labels.forEach((labelObject, model) => {
      labelObject.visible = model === nextHovered;
    });
  };

  private getProductQuery(object: THREE.Object3D): string {
    if (object === this.chemistry) return 'repair';
    return '';
  }

  private onCanvasClick = (): void => {
    this.stopTyping();

    this.hideChemistryIngredients();

    this.selectedObject = this.hoveredObject;

    this.selectedName.set(
      this.selectedObject?.name || 'Выбранный объект'
    );

    this.isProductSliderOpen.set(true);

    if (this.selectedObject === this.chemistry) {
      this.showChemistryIngredients();
      return;
    }

    this.updateSliderPosition();
  };

  onSceneClick(event: MouseEvent): void {
    if (!this.isProductSliderOpen()) return;

    const target = event.target as HTMLElement;

    if (target.closest('tabs-products-slider')) return;

    if (target.closest('canvas')) return;

    this.closeProductSlider();
  }

  private closeProductSlider(): void {
    this.isProductSliderOpen.set(false);
    this.selectedObject = null;
    this.selectedName.set(null);
    this.hideChemistryIngredients();

    const targets = [
      this.chemistry,
    ].filter(
      (object): object is THREE.Object3D => !!object
    );

    for (const object of targets) {
      this.setHighlight(object, object === this.hoveredObject);
    }

    this.outlinePass.selectedObjects = this.hoveredObject
      ? [this.hoveredObject]
      : [];

    this.labels.forEach((labelObject) => {
      labelObject.visible = false;
    });
  }

  private createScene() {
    if (this.isBrowser) {
      this.scene = new THREE.Scene();

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./draco/');
      this.loaderGLTF.setDRACOLoader(dracoLoader);

      this.importSceneItem(
        this.chemistryModelGLB,
        0.1, -0.1, -0.35,
        4, 4, 4,
        (model) => {
          this.chemistry = model;

          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());

          this.chemistryHorizontalOffset = -center.x;

          this.chemistryPivot = new THREE.Group();
          this.chemistryPivot.position.set(center.x, center.y, center.z);

          this.scene.add(this.chemistryPivot);
          this.chemistryPivot.attach(model);

          this.chemistryPivot.position.x = 0;
        },
        true,
        true, 0.6,
        'Lab', 0.5, 0.8, 0.5, 'right', 0, -10
      );

      this.importSceneItem(
        this.bubbleOneModelGLB,
        0.1, 0, -0.35,
        4, 4, 4,
        (model) => {
          this.bubbleOne = model;
          this.scene.add(model);
          this.bubbleInitialY = model.position.y;
          model.position.x += this.chemistryHorizontalOffset;
        },
        true,
        true, 0.6,
        '', 0.5, 0.8, 0.5, 'right', 0, -10
      );

      this.importSceneItem(
        this.bubbleTwoModelGLB,
        0.1, 0, -0.35,
        4, 4, 4,
        (model) => {
          this.bubbleTwo = model;
          this.scene.add(model);
          this.bubbleTwoInitialY = model.position.y;
          model.position.x += this.chemistryHorizontalOffset;
        },
        true,
        true, 0.6,
        '', 0.5, 0.8, 0.5, 'right', 0, -10
      );

      this.importSceneItem(
        this.bubbleThreeModelGLB,
        0.1, 0, -0.35,
        4, 4, 4,
        (model) => {
          this.bubbleThree = model;
          this.scene.add(model);
          this.bubbleThreeInitialY = model.position.y;
          model.position.x += this.chemistryHorizontalOffset;
        },
        true,
        true, 0.6,
        '', 0.5, 0.8, 0.5, 'right', 0, -10
      );

      let aspectRatio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(
        this.fieldOfView,
        aspectRatio,
        this.nearClippingPlane,
        this.farClippingPlane
      );
      this.camera.position.z = this.cameraZ;
      this.camera.lookAt(0, 0, 0);

      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight(0xcbff79, 0.6);
      this.directionalLight.position.set(0, 5, 0);
      this.directionalLight.castShadow = true;
      this.scene.add(this.directionalLight);
      this.lightOne = new THREE.PointLight(0xffa4d3, 60);
      this.lightOne.position.set(-3, 3, 5);
      this.scene.add(this.lightOne);
      this.lightTwo = new THREE.PointLight(0xA6FF70, 50);
      this.lightTwo.position.set(3, -1, 1);
      this.scene.add(this.lightTwo);
      this.lightThree = new THREE.PointLight(0xd4ff90, 40);
      this.lightThree.position.set(1, 3, 1);
      this.scene.add(this.lightThree);
      this.lightFour = new THREE.PointLight(0xc9ff72, 50);
      this.lightFour.position.set(5, -2, 1);
      this.scene.add(this.lightFour);
      this.lightFive = new THREE.PointLight(0xff8ac6, 40);
      this.lightFive.position.set(0, 3, -1);
      this.scene.add(this.lightFive);
      this.lightSix = new THREE.PointLight(0xff8dc0, 30);
      this.lightSix.position.set(-3, 1, 5);
      this.scene.add(this.lightSix);
    }
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      logarithmicDepthBuffer: false,
    });

    this.renderer.setClearColor(0x000000, 0);
    this.scene.background = null;
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    );

    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(
      new RenderPass(this.scene, this.camera)
    );

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(
        this.canvas.clientWidth,
        this.canvas.clientHeight
      ),
      this.scene,
      this.camera
    );

    this.outlinePass.visibleEdgeColor.set('#B7FF00');
    this.outlinePass.hiddenEdgeColor.set('#B7FF00');
    this.outlinePass.edgeStrength = 6;
    this.outlinePass.edgeGlow = 1.5;
    this.outlinePass.edgeThickness = 2;
    this.outlinePass.pulsePeriod = 0;
    this.outlinePass.selectedObjects = [];

    this.composer.addPass(this.outlinePass);

    this.composer.addPass(new OutputPass());

    const component = this;

    (function render() {
      requestAnimationFrame(render);

      component.updateProductLabelsPosition();

      const time = performance.now() * 0.001;

      if (component.chemistryIngredientsVisible()) {
        component.updateChemistryIngredientsPosition();
      }

      // if (component.chemistryPivot) {
      //   component.chemistryPivot.rotation.y += component.chemistryRotationSpeed;
      // }

      if (component.bubbleOne) {
        component.bubbleOne.position.y =
          component.bubbleInitialY +
          Math.sin(time * component.bubbleFloatSpeed) *
          component.bubbleFloatAmplitude;
      }

      if (component.bubbleTwo) {
        component.bubbleTwo.position.y =
          component.bubbleTwoInitialY +
          Math.sin(time * component.bubbleTwoFloatSpeed + 1.6) *
          component.bubbleTwoFloatAmplitude;
      }

      if (component.bubbleThree) {
        component.bubbleThree.position.y =
          component.bubbleThreeInitialY +
          Math.sin(time * component.bubbleThreeFloatSpeed + 3.8) *
          component.bubbleThreeFloatAmplitude;
      }

      // if (component.bubbleTwo) {
      //   const duration = 3;
      //   const progress = (time % duration) / duration;

      //   const startY = component.bubbleInitialY;
      //   const riseHeight = 1.2;

      //   component.bubbleTwo.position.y =
      //     startY + progress * riseHeight;

      //   const scale = progress < 0.85
      //     ? progress / 0.85
      //     : 0;

      //   component.bubbleTwo.scale.setScalar(
      //     4 * scale
      //   );
      // }

      component.composer.render();
      component.labelRenderer.render(
        component.scene,
        component.camera
      );
    })();
  }

  private createControls = (): void => {
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enableRotate = false;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = false;

    this.controls.minAzimuthAngle = THREE.MathUtils.degToRad(-30);
    this.controls.maxAzimuthAngle = THREE.MathUtils.degToRad(30);

    // this.controls.minPolarAngle = Math.PI / 2;
    // this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.minPolarAngle = THREE.MathUtils.degToRad(80);
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(105);

    this.controls.minDistance = 450;
    this.controls.maxDistance = 550;

    this.controls.update();
  };

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.createScene();
      this.createLabelRenderer();
      this.startRenderingLoop();
      this.createControls();

      this.resizeObserver = new ResizeObserver(this.resizeScene);
      this.resizeObserver.observe(this.sceneContainer);

      this.resizeScene();

      this.canvas.addEventListener(
        'pointermove',
        this.onPointerMove
      );
    }
  }

  importSceneItem(modelPath: string, positionX: number, positionY: number, positionZ: number, scaleX: number, scaleY: number, scaleZ: number,
    onLoaded?: (model: THREE.Object3D) => void,
    isOnPlatform?: boolean,
    transparency?: boolean, opacity?: number, labelName?: string, labelAnchorX?: number, labelAnchorY?: number,
    labelAnchorZ?: number, labelDirection?: 'left' | 'right', labelOffsetX?: number, labelOffsetY?: number,
  ) {
    this.loaderGLTF.load(modelPath, (gltf: GLTF) => {
      const model = gltf.scene;

      model.traverse((object: THREE.Object3D) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.side = THREE.DoubleSide;
          material.needsUpdate = true;
        });

        if (transparency || opacity) {
          materials.forEach((material) => {
            material.transparent = transparency;
            material.opacity = opacity;
            material.depthTest = true;
            material.depthWrite = true;
            material.side = THREE.DoubleSide;
            material.needsUpdate = true;
          });
        }
      });

      model.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        THREE.MathUtils.degToRad(0)
      );
      model.position.x = positionX;
      model.position.y = positionY;
      model.position.z = positionZ;
      model.scale.set(scaleX, scaleY, scaleZ);

      onLoaded?.(model);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      if (labelName) {
        this.createNewProductLabel(
          model,
          labelName,
          labelAnchorX,
          labelAnchorY,
          labelAnchorZ,
          labelDirection,
          labelOffsetX,
          labelOffsetY
        )
      }
    });
  }

  private setHighlight(
    object: THREE.Object3D,
    enabled: boolean
  ): void {
    object.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (enabled) {
          // Запоминаем исходные параметры только один раз.
          if (!this.originalMaterials.has(material)) {
            const original: {
              color?: THREE.Color;
              emissive?: THREE.Color;
              emissiveIntensity?: number;
            } = {};

            if (
              'color' in material &&
              material.color instanceof THREE.Color
            ) {
              original.color = material.color.clone();
            }

            if (material instanceof THREE.MeshStandardMaterial) {
              original.emissive = material.emissive.clone();
              original.emissiveIntensity = material.emissiveIntensity;
            }

            this.originalMaterials.set(material, original);
          }

          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissive.set('#ff0080');
            material.emissiveIntensity = 3;
          } else if (
            'color' in material &&
            material.color instanceof THREE.Color
          ) {
            material.color.set('#ff0080');
          }
        } else {
          const original = this.originalMaterials.get(material);

          if (!original) continue;

          if (
            original.color &&
            'color' in material &&
            material.color instanceof THREE.Color
          ) {
            material.color.copy(original.color);
          }

          if (material instanceof THREE.MeshStandardMaterial) {
            if (original.emissive) {
              material.emissive.copy(original.emissive);
            }

            if (original.emissiveIntensity !== undefined) {
              material.emissiveIntensity = original.emissiveIntensity;
            }
          }
        }
      }
    });
  }

  private createLabelRenderer(): void {
    this.labelRenderer = new CSS2DRenderer();

    this.labelRenderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    const container = this.canvas.parentElement!;

    container.style.position = 'relative';

    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.inset = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';

    container.appendChild(this.labelRenderer.domElement);
  }

  private updateSliderPosition(): void {
    if (!this.selectedObject || !this.camera) return;

    if (this.selectedObject === this.chemistry) {
      this.sliderX.set(this.sceneContainer.clientWidth / 2);
      this.sliderY.set(this.sceneContainer.clientHeight * 0.75);
      return;
    }

    this.selectedObject.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(this.selectedObject);

    const anchor = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.max.y,
      (box.min.z + box.max.z) / 2
    );

    anchor.project(this.camera);

    if (anchor.z < -1 || anchor.z > 1) return;

    const canvasRect = this.canvas.getBoundingClientRect();

    const containerRect = this.sceneContainer.getBoundingClientRect();

    const screenX =
      canvasRect.left +
      ((anchor.x + 1) / 2) * canvasRect.width;

    const screenY =
      canvasRect.top +
      ((1 - anchor.y) / 2) * canvasRect.height;

    this.sliderX.set(screenX - containerRect.left);
    this.sliderY.set(screenY - containerRect.top);
  }

  showChemistryIngredients() {
    this.chemistryIngredientsVisible.set(true);
    this.updateSliderPosition();
  }

  hideChemistryIngredients() {
    this.chemistryIngredientsVisible.set(false);
    this.chemistryIngredientsPositioned.set(false);
  }

  private typeText(text: string, index = 0): void {
    if (index >= text.length) return;

    this.displayedText.update(
      value => value + text[index]
    );

    this.timer = setTimeout(
      () => this.typeText(text, index + 1),
      25
    );
  }

  onIngredientClick(description: string,
    color: string, event?: Event): void {
    event?.stopPropagation();

    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }

    this.displayedText.set('');
    this.typeText(description);
    this.ingredientTextColor.set(color);
  }

  private stopTyping(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.displayedText.set('');
  }

  closeIngredientText(event: Event) {
    event?.stopPropagation();
    this.stopTyping();
  }

  private projectObjectPosition(
    object: THREE.Object3D,
    useTop = true
  ): { x: number; y: number } | null {
    object.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(object);

    const anchor = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      useTop ? box.max.y : (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2
    );

    anchor.project(this.camera);

    if (anchor.z < -1 || anchor.z > 1) return null;

    const canvasRect = this.canvas.getBoundingClientRect();
    const containerRect = this.sceneContainer.getBoundingClientRect();

    return {
      x: canvasRect.left + ((anchor.x + 1) / 2) * canvasRect.width - containerRect.left,
      y: canvasRect.top + ((1 - anchor.y) / 2) * canvasRect.height - containerRect.top,
    };
  }

  private createNewProductLabel(
    model: THREE.Object3D,
    label: string,
    anchorX = 0.5,
    anchorY = 0.8,
    anchorZ = 0.5,
    lineSide: 'left' | 'right' = 'right',
    offsetX = 0,
    offsetY = 0
  ): void {
    const element = document.createElement('div');
    element.className = `product-callout product-callout--${lineSide}`;

    element.innerHTML = `
    <span class="product-callout__dot"></span>
    <span class="product-callout__line"></span>
    <span class="product-callout__text">${label}</span>
  `;

    element.style.position = 'absolute';
    element.style.pointerEvents = 'none';
    element.style.display = 'none';

    this.sceneContainer.appendChild(element);

    this.productLabels.set(model, {
      element,
      anchorX,
      anchorY,
      anchorZ,
      offsetX,
      offsetY
    });
  }

  private updateProductLabelsPosition(): void {
    if (!this.camera) return;

    for (const [model, data] of this.productLabels) {
      model.updateWorldMatrix(true, true);

      // Находим bounding box в локальных координатах модели
      const localBox = new THREE.Box3();

      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        if (!child.geometry.boundingBox) {
          child.geometry.computeBoundingBox();
        }

        if (!child.geometry.boundingBox) return;

        const meshBox = child.geometry.boundingBox.clone();

        // Переводим координаты меша в систему координат модели
        const relativeMatrix = new THREE.Matrix4()
          .copy(model.matrixWorld)
          .invert()
          .multiply(child.matrixWorld);

        meshBox.applyMatrix4(relativeMatrix);

        localBox.union(meshBox);
      });

      if (localBox.isEmpty()) continue;

      const size = localBox.getSize(new THREE.Vector3());

      // Фиксированная точка в локальных координатах модели
      const anchor = new THREE.Vector3(
        localBox.min.x + size.x * data.anchorX,
        localBox.min.y + size.y * data.anchorY,
        localBox.min.z + size.z * data.anchorZ
      );

      // Переводим якорь в мировые координаты
      model.localToWorld(anchor);

      // Проецируем на экран
      anchor.project(this.camera);

      if (
        anchor.z < -1 ||
        anchor.z > 1 ||
        Math.abs(anchor.x) > 1 ||
        Math.abs(anchor.y) > 1
      ) {
        data.element.style.display = 'none';
        continue;
      }

      const canvasRect = this.canvas.getBoundingClientRect();
      const containerRect = this.sceneContainer.getBoundingClientRect();

      const x =
        canvasRect.left +
        ((anchor.x + 1) / 2) * canvasRect.width -
        containerRect.left +
        data.offsetX;

      const y =
        canvasRect.top +
        ((1 - anchor.y) / 2) * canvasRect.height -
        containerRect.top +
        data.offsetY;

      data.element.style.display =
        this.hoveredObject === model
          ? 'flex'
          : 'none';

      data.element.style.left = `${x}px`;
      data.element.style.top = `${y}px`;
    }
  }

  private updateChemistryIngredientsPosition(): void {
    if (!this.chemistry || !this.chemistryIngredientsVisible()) return;

    const position = this.projectObjectPosition(this.chemistry, false);

    if (!position) return;

    const container = this.sceneContainer.querySelector(
      '.chemistry-ingredients'
    ) as HTMLElement | null;

    if (!container) return;

    const isMobile = window.innerWidth <= 600;

    container.style.left = `${position.x}px`;

    if (isMobile) {
      container.style.top = `${position.y + 200}px`;
    } else {
      container.style.top = `${position.y}px`;
    }

    container.style.transform = 'translate(-50%, -50%)';


    if (!this.chemistryIngredientsPositioned()) {
      this.chemistryIngredientsPositioned.set(true);
    }
  }

  private resizeScene = (): void => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);

    this.composer.setSize(width, height);

    this.labelRenderer.setSize(width, height);
  };

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }

    this.resizeObserver?.disconnect();

    this.canvas.removeEventListener(
      'pointermove',
      this.onPointerMove
    );
  }
}
