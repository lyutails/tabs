import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnInit,
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


@Component({
  imports: [ProductsSlider],
  selector: 'tabs-interactive-store',
  styleUrl: './interactive-store.scss',
  templateUrl: './interactive-store.html',
})
export class InteractiveStore implements OnInit, AfterViewInit {
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
  isProductSliderOpen = signal(false);
  selectedProduct = signal<Result | null>(null);
  productsSlider = viewChild(ProductsSlider);
  sliderX = signal(0);
  sliderY = signal(0);
  storeModelGLB =
    '/three/store18.glb';
  creamModelGLB =
    '/three/cream3.glb';
  orangeModelGLB =
    '/three/orange1.glb';
  gaModelGLB =
    '/three/ga.glb';
  roundPlatformModelGLB =
    '/three/round_platform1.glb'; 
    
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

  ngOnInit() { }


  private onPointerMove = (event: PointerEvent): void => {
    if (!this.camera) return;

    const rect = this.canvas.getBoundingClientRect();

    this.pointer.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = [this.cream, this.orange].filter(
      (object): object is THREE.Object3D => !!object
    );

    const intersects = this.raycaster.intersectObjects(targets, true);
    const hitObject = intersects[0]?.object ?? null;

    // Определяем, какой корневой объект задет курсором.
    let current: THREE.Object3D | null = hitObject;
    let nextHovered: THREE.Object3D | null = null;

    while (current) {
      if (targets.includes(current)) {
        nextHovered = current;
        break;
      }

      current = current.parent;
    }

    // Переключаем подсветку только при смене объекта.
    if (nextHovered !== this.hoveredObject) {
      if (this.hoveredObject) {
        this.setHighlight(this.hoveredObject, false);
      }

      if (nextHovered) {
        this.setHighlight(nextHovered, true);
      }

      this.hoveredObject = nextHovered;
    }

    // Контур вокруг текущего объекта.
    this.outlinePass.selectedObjects = nextHovered
      ? [nextHovered]
      : [];

    // Каждый объект управляет собственным лейблом.
    this.labels.forEach((labelObject, model) => {
      labelObject.visible = model === nextHovered;
    });

    this.isCreamHovered.set(nextHovered === this.cream);
    this.canvas.style.cursor = nextHovered ? 'pointer' : 'default';
  };

  private getProductQuery(object: THREE.Object3D): string {
    if (object === this.cream) return 'cream';
    if (object === this.orange) return 'vitamin c';

    return '';
  }

  private onCanvasClick = () => {
    if (!this.hoveredObject) return;

    this.selectedObject = this.hoveredObject;

    this.selectedName.set(
      this.selectedObject.name || 'Выбранный объект'
    );

    const query = this.getProductQuery(this.selectedObject);

    if (!query) return;

    this.isProductSliderOpen.set(true);
    this.updateSliderPosition();

    this.productsSlider()?.getProducts(query);
  };

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
        this.store.scale.set(2.1, 2.1, 2.1);
      });

      this.importCream();
      this.importOrange();
      this.importGA();
      this.importRoundPlatform();

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

      if (component.isProductSliderOpen()) {
        component.updateSliderPosition();
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

  importCream() {
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load(this.creamModelGLB, (gltf: GLTF) => {
      this.cream = gltf.scene;

      this.cream.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {

          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
        }
      });

      this.cream.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        THREE.MathUtils.degToRad(0)
      );
      this.cream.position.x = -1.4;
      this.cream.position.y = -0.3;
      this.cream.position.z = 1.2;
      this.scene.add(this.cream);
      this.cream.scale.set(1.8, 1.8, 1.8);

      const box = new THREE.Box3().setFromObject(this.cream);
      const center = box.getCenter(new THREE.Vector3());

      this.createProductLabel(this.cream, "Увлажняющий крем");
    });
  }

  importOrange() {
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load(this.orangeModelGLB, (gltf: GLTF) => {
      this.orange = gltf.scene;

      this.orange.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {

          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
        }
      });

      this.orange.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        THREE.MathUtils.degToRad(0)
      );
      this.orange.position.y = -0.1;
      this.orange.position.x = -1.1;
      this.orange.position.z = 0.45;
      this.scene.add(this.orange);
      this.orange.scale.set(1.8, 1.8, 1.8);

      const box = new THREE.Box3().setFromObject(this.orange);
      const center = box.getCenter(new THREE.Vector3());

      this.createProductLabel(this.orange, 'Витамин С');
    });
  }

  importGA() {
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load(this.gaModelGLB, (gltf: GLTF) => {
      this.ga = gltf.scene;

      this.ga.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {

          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
        }
      });

      this.ga.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        THREE.MathUtils.degToRad(0)
      );
      this.ga.position.y = 0.16;
      this.ga.position.x = -0.8;
      this.ga.position.z = 0.35;
      this.scene.add(this.ga);
      this.ga.scale.set(1.8, 1.8, 1.8);

      const box = new THREE.Box3().setFromObject(this.ga);
      const center = box.getCenter(new THREE.Vector3());

      // this.createProductLabel(this.ga, '');
    });
  }

  importRoundPlatform() {
    const loaderGLTF = new GLTFLoader();

    loaderGLTF.load(this.roundPlatformModelGLB, (gltf: GLTF) => {
      this.roundPlatform = gltf.scene;

      this.roundPlatform.scale.setScalar(1.8);
      this.roundPlatform.rotation.set(
        THREE.MathUtils.degToRad(15),
        THREE.MathUtils.degToRad(45),
        0
      );
      this.roundPlatform.position.set(-0.1, -0.09, 0.35);

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

  private createProductLabel(
    model: THREE.Object3D,
    label: string
  ): void {
    const element = document.createElement('div');
    element.className = 'product-callout';

    element.innerHTML = `
    <span class="product-callout__dot"></span>
    <span class="product-callout__line"></span>
    <span class="product-callout__text">${label}</span>
  `;

    const labelObject = new CSS2DObject(element);
    labelObject.visible = false;

    model.add(labelObject);

    model.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(model);

    const labelPosition = new THREE.Vector3(
      box.max.x + (box.max.x - box.min.x) * 0.85,
      box.max.y - (box.max.y - box.min.y) * 0.2,
      (box.min.z + box.max.z) / 2
    );

    model.worldToLocal(labelPosition);
    labelObject.position.copy(labelPosition);

    this.labels.set(model, labelObject);
    this.labelElements.set(model, element);
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

    this.selectedObject.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(this.selectedObject);

    // Точка над верхней частью объекта
    const anchor = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.max.y,
      (box.min.z + box.max.z) / 2
    );

    anchor.project(this.camera);

    if (anchor.z < -1 || anchor.z > 1) return;

    // Координаты canvas на экране
    const canvasRect = this.canvas.getBoundingClientRect();

    // Координаты общего контейнера на экране
    const containerRect = this.sceneContainer.getBoundingClientRect();

    // Переводим координаты Three.js в CSS-пиксели контейнера
    const screenX =
      canvasRect.left +
      ((anchor.x + 1) / 2) * canvasRect.width;

    const screenY =
      canvasRect.top +
      ((1 - anchor.y) / 2) * canvasRect.height;

    this.sliderX.set(screenX - containerRect.left);
    this.sliderY.set(screenY - containerRect.top);
  }
}
