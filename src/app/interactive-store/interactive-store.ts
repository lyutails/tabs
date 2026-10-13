import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  InjectionToken,
  Input,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { isPlatformBrowser } from '@angular/common';
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
import { ProductsSlider } from './products-slider/products-slider';
import { ModalState } from './modal-state';
import { ProductsModal } from './products-modal/products-modal';


@Component({
  imports: [ProductsSlider, ProductsModal],
  selector: 'tabs-interactive-store',
  styleUrl: './interactive-store.scss',
  templateUrl: './interactive-store.html',
})
export class InteractiveStore implements AfterViewInit {
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
  // private loader = new THREE.TextureLoader();
  // private geometry = new THREE.BoxGeometry(1, 1, 1);
  // private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
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
  private roundPlatformPivot!: THREE.Group;
  private store!: THREE.Object3D;
  private cream!: THREE.Object3D;
  private orange!: THREE.Object3D;
  private ga!: THREE.Object3D;
  private roundPlatform!: THREE.Object3D;
  private foreo!: THREE.Object3D;
  private heart!: THREE.Object3D;
  private cloud!: THREE.Object3D;
  private bottle1!: THREE.Object3D;
  private bottle2!: THREE.Object3D;
  private bottle3!: THREE.Object3D;
  private brand1!: THREE.Object3D;
  private chemistry!: THREE.Object3D;
  private fan!: THREE.Object3D;
  private bakuchiol!: THREE.Object3D;
  private boxes!: THREE.Object3D;
  private dna!: THREE.Object3D;
  private promo!: THREE.Object3D;
  private decor1!: THREE.Object3D;
  private decor2!: THREE.Object3D;
  private decor3!: THREE.Object3D;
  private cake!: THREE.Object3D;
  isProductSliderOpen = signal(false);
  selectedProduct = signal<Result | null>(null);
  productsSlider = viewChild(ProductsSlider);
  sliderX = signal(0);
  sliderY = signal(0);
  modalStateService = inject(ModalState);
  chemistryIngredientsPositioned = signal(false);
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
  private pendingPlatformObjects: THREE.Object3D[] = [];
  storeModelGLB =
    '/three/store32.glb';
  creamModelGLB =
    '/three/cream5.glb';
  orangeModelGLB =
    '/three/orange2.glb';
  gaModelGLB =
    '/three/ga1.glb';
  roundPlatformModelGLB =
    '/three/round_platform3.glb';
  foreoModelGLB =
    '/three/foreo2.glb';
  heartModelGLB =
    '/three/heart6.glb';
  cloudModelGLB =
    '/three/cloud1.glb';
  bottle1ModelGLB =
    '/three/bottle1_4.glb';
  bottle2ModelGLB =
    '/three/bottle2_3.glb';
  bottle3ModelGLB =
    '/three/bottle3_3.glb';
  brand1ModelGLB =
    '/three/brand1_2.glb';
  chemistryModelGLB =
    '/three/chemistry10.glb';
  fanModelGLB =
    '/three/fan6.glb';
  bakuchiolModelGLB =
    '/three/bakuchiol5.glb';
  boxesModelGLB =
    '/three/boxes2.glb';
  dnaModelGLB =
    '/three/dna7.glb';
  promoModelGLB =
    '/three/promo2.glb';
  decor1ModelGLB =
    '/three/decor1.glb';
  decor2ModelGLB =
    '/three/decor2.glb';
  decor3ModelGLB =
    '/three/decor3.glb';
  cakeModelGLB =
    '/three/cake13.glb';
  chemistryIngredientsVisible = signal(false);
  readonly chemistryIngredients = [
    {
      name: 'Центелла',
      image: '/three/ingredients/centella.jfif',
      query: 'centella',
    },
    {
      name: 'Пантенол',
      image: '/three/ingredients/panthenol1.jfif',
      query: 'panthenol',
    },
    {
      name: 'Керамиды',
      image: '/three/ingredients/ceramide1.webp',
      query: 'ceramide',
    },
    {
      name: 'Ниацинамид',
      image: '/three/ingredients/niacinamide.png',
      query: 'niacinamide',
    },
  ];
  private decorInitialY = 0.3;
  private decorFloatAmplitude = 0.05;
  private decorFloatSpeed = 1.2;
  private decor1Delay = 0;
  private decor2Delay = 1.5;
  private decor3Delay = 3;

  @ViewChild('sceneContainer')
  private sceneContainerRef!: ElementRef<HTMLElement>;

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

    const targets = [this.cream, this.orange, this.foreo, this.bottle1, this.bottle2,
    this.bottle3, this.brand1, this.chemistry, this.fan, this.bakuchiol, this.heart,
    this.dna, this.promo].filter(
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

    this.isCreamHovered.set(nextHovered === this.cream);
    this.canvas.style.cursor = nextHovered ? 'pointer' : 'default';
  };

  private getProductQuery(object: THREE.Object3D): string {
    if (object === this.cream) return 'cream';
    if (object === this.orange) return 'vitamin c';
    if (object === this.foreo) return 'foreo';
    if (object === this.bottle1) return 'serum';
    if (object === this.bottle2) return 'peptide';
    if (object === this.bottle3) return 'retinol';
    if (object === this.brand1) return 'obagi';
    if (object === this.chemistry) return 'repair';
    if (object === this.fan) return 'korea';
    if (object === this.bakuchiol) return 'bakuchiol';
    if (object === this.dna) return 'PDRN';

    return '';
  }

  private onCanvasClick = (): void => {
    if (!this.hoveredObject) {
      this.closeProductSlider();
      this.modalStateService.isOpenModal.set(false);
      return;
    }

    const query = this.getProductQuery(this.hoveredObject);

    if (!query) {
      this.closeProductSlider();
      this.modalStateService.isOpenModal.set(false);
      return;
    }

    this.modalStateService.isOpenModal.set(false);

    this.selectedObject = this.hoveredObject;

    this.selectedName.set(
      this.selectedObject.name || 'Выбранный объект'
    );

    this.isProductSliderOpen.set(true);

    if (this.selectedObject === this.chemistry) {
      this.showChemistryIngredients();
      this.updateSliderPosition();
      this.productsSlider()?.getProducts(query);
      return;
    }

    if (this.selectedObject === this.fan) {
      this.productsSlider()?.getByCountry('korea');
      this.updateSliderPosition();
      return;
    }

    this.hideChemistryIngredients();
    this.updateSliderPosition();
    this.productsSlider()?.getProducts(query);
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
    this.productsSlider()?.clearResults();

    const targets = [
      this.cream,
      this.orange,
      this.foreo,
      this.bottle1,
      this.bottle2,
      this.bottle3,
      this.brand1,
      this.chemistry,
      this.fan,
      this.bakuchiol,
      this.dna,
      this.promo,
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

    this.modalStateService.isOpenModal.set(false);
  }

  private createScene() {
    if (this.isBrowser) {
      this.scene = new THREE.Scene();

      const loaderGLTF = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./draco/');
      loaderGLTF.setDRACOLoader(dracoLoader);

      loaderGLTF.load(this.storeModelGLB, (gltf: GLTF) => {
        this.store = gltf.scene.children[0];
        this.store.rotation.set(
          THREE.MathUtils.degToRad(15),
          THREE.MathUtils.degToRad(45),
          THREE.MathUtils.degToRad(0)
        );
        this.scene.add(this.store);
        this.store.scale.set(2.4, 2.4, 2.4);


        this.store.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;

          object.visible = true;

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            material.side = THREE.DoubleSide;
            material.needsUpdate = true;
          });


          this.store.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => {
              material.transparent = false;
              material.opacity = 1;
              material.depthTest = true;
              material.depthWrite = true;
              material.side = THREE.DoubleSide;
              material.needsUpdate = true;
            });
          });

        });
      });

      this.importSceneItem(this.creamModelGLB,
        0.05, -0.05, 0.2,
        2.4, 2.4, 2.4,
        (model) => {
          this.cream = model;
        },
        false,
        false, 1,
        'Увлажняющий крем', 0.5, 0.3, 0.5, 'right', -10, -20);
      this.importSceneItem(this.orangeModelGLB,
        -0.2, 0, 0.1,
        2.2, 2.2, 2.2,
        (model) => {
          this.orange = model;
        },
        false,
        false, 1,
        'Витамин С', 0.6, 0.5, 0.5, 'right', -10, -10);
      this.importSceneItem(this.gaModelGLB,
        0, -0.05, 0.1,
        2.4, 2.4, 2.4,
        (model) => {
          this.ga = model;
        },
        false,
        false, 1);
      this.importSceneItem(this.foreoModelGLB,
        1, 0, 0.1,
        2, 2, 2,
        (model) => {
          this.foreo = model;
        },
        false,
        false, 1,
        'Foreo', 0.8, 0.2, 0.9, 'right', -50, -50);
      this.importSceneItem(this.heartModelGLB,
        -0.4, -0.1, 0.5,
        2.2, 2.2, 2.2,
        (model) => {
          this.heart = model;
        },
        false,
        false, 1,
        'Киоск', 1.1, -1, 1.2, 'right', -50, -50);
      this.importSceneItem(this.cloudModelGLB,
        0.5, -0.2, 0.8,
        2.4, 2.2, 2.4,
        (model) => {
          this.cloud = model;
        },
        false);
      this.importSceneItem(this.bottle1ModelGLB,
        0.4, -0.2, 0.9,
        2.4, 2.4, 2.4,
        (model) => {
          this.bottle1 = model;
        },
        false,
        false, 1,
        'Увлажняющая сыворотка', 0.5, 0.4, 0.5, 'right', -10, -10);
      this.importSceneItem(this.bottle2ModelGLB,
        0.4, -0.2, 1.4,
        2.4, 2.4, 2.4,
        (model) => {
          this.bottle2 = model;
        },
        false,
        false, 1,
        'Peptides', 0.5, 0, 0.5, 'left', -120, -80);
      this.importSceneItem(this.bottle3ModelGLB,
        0.4, -0.2, 0.9,
        2.4, 2.4, 2.4,
        (model) => {
          this.bottle3 = model;
        },
        false,
        false, 1,
        'Retinol', 0.5, 0, 0.5, 'left', -120, -80);
      this.importSceneItem(this.brand1ModelGLB,
        0.1, 0.7, -0.2,
        2.2, 2.2, 2.2,
        (model) => {
          this.brand1 = model;
        },
        false,
        false, 1,
        'Obagi', 0.5, 0, 0.5, 'left', -100, -50);
      this.importSceneItem(this.fanModelGLB,
        0.2, 0.1, -0.15,
        2.2, 2.2, 2.2,
        (model) => {
          this.fan = model;
        },
        false,
        false, 1,
        'K-Beauty', 0.4, 0.6, 0.8, 'left', -180, -20);
      this.importSceneItem(this.bakuchiolModelGLB,
        0.1, 0.1, -0.15,
        2.2, 2.2, 2.2,
        (model) => {
          this.bakuchiol = model;
        },
        false,
        false, 1,
        'Bakuchiol', 0.4, 0.6, 0.8, 'left', -140, -50);
      this.importSceneItem(this.boxesModelGLB,
        -0.5, 0.3, 0.1,
        2, 2, 2,
        (model) => {
          this.boxes = model;
        },
        false,
        false, 1);
      this.importSceneItem(this.promoModelGLB,
        0.5, 0, -0.1,
        2.4, 2.4, 2.4,
        (model) => {
          this.promo = model;
        },
        false,
        false, 1,
        'Промокоды', 0.3, 0.6, 0.8, 'left', -140, -20);
      this.importSceneItem(this.decor1ModelGLB,
        0.5, 0.3, 0.1,
        2, 2, 2,
        (model) => {
          this.decor1 = model;
        },
        false,
        false, 1);
      this.importSceneItem(this.decor2ModelGLB,
        0.7, 0.3, 0.1,
        2, 2, 2,
        (model) => {
          this.decor2 = model;
        },
        false,
        false, 1);
      this.importSceneItem(this.decor3ModelGLB,
        -0.3, 0.3, 0.4,
        2, 2, 2,
        (model) => {
          this.decor3 = model;
        },
        false,
        false, 1);
      this.importRoundPlatform();
      this.importSceneItem(this.chemistryModelGLB,
        0.1, 0.1, -0.35,
        2.8, 2.8, 2.8,
        (model) => {
          this.chemistry = model;
        },
        true,
        true, 0.6,
        'Repair', 0.5, 0.8, 0.5, 'right', 0, -10);
      this.importSceneItem(this.dnaModelGLB,
        0.1, 0.25, -0.15,
        2.2, 2.2, 2.2,
        (model) => {
          this.dna = model;
        },
        true,
        false, 1,
        'PDRN', 0.5, 0.8, 0.5, 'left', -100, -20);
      this.importSceneItem(this.cakeModelGLB,
        -0.1, 0.1, -0.2,
        2.4, 2.4, 2.4,
        (model) => {
          this.cake = model;
        },
        true,
        false, 1);

      let aspectRatio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(
        this.fieldOfView,
        aspectRatio,
        this.nearClippingPlane,
        this.farClippingPlane
      );
      this.camera.position.z = this.cameraZ;

      this.ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight(0xfffecc, 0.6);
      this.directionalLight.position.set(0, 1, 0);
      this.directionalLight.castShadow = true;
      this.scene.add(this.directionalLight);
      this.lightOne = new THREE.PointLight(0xffa4d3, 80);
      this.lightOne.position.set(1, 3, 5);
      this.scene.add(this.lightOne);
      this.lightTwo = new THREE.PointLight(0xe7ffae, 60);
      this.lightTwo.position.set(5, -5, 0);
      this.scene.add(this.lightTwo);
      this.lightThree = new THREE.PointLight(0xd4ff90, 60);
      this.lightThree.position.set(1, 5, 1);
      this.scene.add(this.lightThree);
      this.lightFour = new THREE.PointLight(0xc9ff72, 40);
      this.lightFour.position.set(3, -5, 2);
      this.scene.add(this.lightFour);
      this.lightFive = new THREE.PointLight(0xff8ac6, 30);
      this.lightFive.position.set(0, 8, 0);
      this.scene.add(this.lightFive);
      this.lightSix = new THREE.PointLight(0xff8dc0, 50);
      this.lightSix.position.set(-3, 1, 6);
      this.scene.add(this.lightSix);
    }
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animCream() {
    // if (this.store) {
    //   this.store.rotation.x += this.rotationSpeedX;
    //   this.store.rotation.y += this.rotationSpeedY;
    // }
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
      this.canvas.clientHeight
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
      component.animCream();

      if (component.roundPlatformPivot) {
        component.roundPlatformPivot.rotateY(0.005);
      }

      // if (component.isProductSliderOpen()) {
      //   component.updateSliderPosition();
      // }

      component.updateProductLabelsPosition();

      const time = performance.now() * 0.001;

      if (component.decor1) {
        component.decor1.position.y =
          component.decorInitialY +
          Math.sin((time - component.decor1Delay) * component.decorFloatSpeed) *
          component.decorFloatAmplitude;
      }

      if (component.decor2) {
        component.decor2.position.y =
          component.decorInitialY +
          Math.sin((time - component.decor2Delay) * component.decorFloatSpeed) *
          component.decorFloatAmplitude;
      }

      if (component.decor3) {
        component.decor3.position.y =
          component.decorInitialY +
          Math.sin((time - component.decor3Delay) * component.decorFloatSpeed) *
          component.decorFloatAmplitude;
      }

      if (component.chemistryIngredientsVisible()) {
        component.updateChemistryIngredientsPosition();
      }

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

    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
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

      this.canvas.addEventListener('pointermove', this.onPointerMove);
      this.canvas.addEventListener('click', this.onCanvasClick);
    }
  }

  importSceneItem(modelPath: string, positionX: number, positionY: number, positionZ: number, scaleX: number, scaleY: number, scaleZ: number,
    onLoaded?: (model: THREE.Object3D) => void,
    isOnPlatform?: boolean,
    transparency?: boolean, opacity?: number, labelName?: string, labelAnchorX?: number, labelAnchorY?: number,
    labelAnchorZ?: number, labelDirection?: 'left' | 'right', labelOffsetX?: number, labelOffsetY?: number,
  ) {
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load(modelPath, (gltf: GLTF) => {
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

      if (isOnPlatform) {
        this.attachToPlatform(model);
      } else {
        this.scene.add(model);
      }

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

  importCream() {
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load(this.creamModelGLB, (gltf: GLTF) => {
      this.cream = gltf.scene;

      this.cream.traverse((object: THREE.Object3D) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.side = THREE.DoubleSide;
          material.needsUpdate = true;
        });
      });

      this.cream.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        THREE.MathUtils.degToRad(0)
      );
      this.cream.position.x = 0.05;
      this.cream.position.y = -0.05;
      this.cream.position.z = 0.2;
      this.scene.add(this.cream);
      this.cream.scale.set(2.4, 2.4, 2.4);

      const box = new THREE.Box3().setFromObject(this.cream);
      const center = box.getCenter(new THREE.Vector3());

      this.createNewProductLabel(
        this.cream,
        'Увлажняющий крем',
        0.5,
        0.3,
        0.5,
        'right',
        -10,
        -20
      );
    });
  }

  importRoundPlatform() {
    const loaderGLTF = new GLTFLoader();

    loaderGLTF.load(this.roundPlatformModelGLB, (gltf: GLTF) => {
      this.roundPlatform = gltf.scene;

      this.roundPlatform.scale.setScalar(2.6);
      this.roundPlatform.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        0
      );
      this.roundPlatform.position.set(0.1, 0.1, -0.3);

      this.scene.add(this.roundPlatform);
      this.roundPlatform.updateWorldMatrix(true, true);

      const box = new THREE.Box3().setFromObject(this.roundPlatform);
      const center = box.getCenter(new THREE.Vector3());

      const worldPosition = this.roundPlatform.getWorldPosition(
        new THREE.Vector3()
      );
      const worldQuaternion = this.roundPlatform.getWorldQuaternion(
        new THREE.Quaternion()
      );
      const worldScale = this.roundPlatform.getWorldScale(
        new THREE.Vector3()
      );

      this.scene.remove(this.roundPlatform);

      const pivot = new THREE.Group();
      pivot.position.copy(center);

      pivot.rotation.copy(this.store.rotation);

      this.scene.add(pivot);

      pivot.add(this.roundPlatform);

      this.roundPlatform.quaternion
        .copy(pivot.quaternion)
        .invert()
        .multiply(worldQuaternion);

      this.roundPlatform.scale.copy(worldScale);

      this.roundPlatform.position
        .copy(worldPosition)
        .sub(center)
        .applyQuaternion(pivot.quaternion.clone().invert());

      this.roundPlatformPivot = pivot;
      this.attachPendingObjects();
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

  onIngredientClick(query: string): void {
    this.productsSlider()?.getProducts(query);
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

    const position = this.projectObjectPosition(this.chemistry);

    if (!position) return;

    const container = this.sceneContainer.querySelector(
      '.chemistry-ingredients'
    ) as HTMLElement | null;

    if (!container) return;

    container.style.left = `${position.x}px`;
    container.style.top = `${position.y - 30}px`;
    container.style.transform = 'translate(-50%, -50%)';

    if (!this.chemistryIngredientsPositioned()) {
      this.chemistryIngredientsPositioned.set(true);
    }
  }

  private attachToPlatform(object: THREE.Object3D): void {
    if (!this.roundPlatformPivot) {
      this.pendingPlatformObjects.push(object);
      return;
    }

    this.roundPlatformPivot.attach(object);
  }

  private attachPendingObjects(): void {
    if (!this.roundPlatformPivot) return;

    for (const object of this.pendingPlatformObjects) {
      this.roundPlatformPivot.attach(object);
    }

    this.pendingPlatformObjects = [];
  }
}
