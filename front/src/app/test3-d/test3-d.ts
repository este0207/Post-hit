import { Component, ElementRef, AfterViewInit, ViewChild, inject, OnDestroy } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three-stdlib';
import { FetchService } from '../fetch-service';
import { Poster3DService } from '../poster3-d-service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-test3-d',
  imports: [],
  templateUrl: './test3-d.html',
  styleUrl: './test3-d.css'
})
export class Test3D implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private poster3DService = inject(Poster3DService);
  private imageNameSub!: Subscription;
  private currentPoster: THREE.Mesh | null = null;
  private borderMaterials: THREE.MeshBasicMaterial[] = [];

  ngAfterViewInit() {
    this.imageNameSub = this.poster3DService.imageName$.subscribe(name => {
      this.updatePosterTexture(name);
    });
    this.initThree();
  }

  ngOnDestroy() {
    this.imageNameSub.unsubscribe();
  }

  private fetchService = inject(FetchService);

  private async initThree() {
    // Création de la scène
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Création de la caméra
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 3.5;

    // Création du renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );

    // Ajout des contrôles OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    // Ajout d'un poster initial
    await this.updatePosterTexture('Portal In Out');

    // SUPPRIMÉ : Création du cadre (border) séparé
    // (On gère la bordure via les matériaux de la box)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private async updatePosterTexture(imageName: string) {
    const posterGeometry = new THREE.BoxGeometry(2, 3, 0.1);
    const imageUrl = await this.fetchService.getAffiche(imageName);
    const posterTexture = await new Promise<THREE.Texture>((resolve)=>{
      new THREE.TextureLoader().load(imageUrl, resolve);
    });
    posterTexture.colorSpace = THREE.SRGBColorSpace;
    const borderColor = 0x222222;
    const borderMaterials = [
      new THREE.MeshBasicMaterial({ color: borderColor }), // droite
      new THREE.MeshBasicMaterial({ color: borderColor }), // gauche
      new THREE.MeshBasicMaterial({ color: borderColor }), // haut
      new THREE.MeshBasicMaterial({ color: borderColor }), // bas
      new THREE.MeshBasicMaterial({ map: posterTexture }), // avant
      new THREE.MeshBasicMaterial({ color: borderColor })  // arrière
    ];
    this.borderMaterials = [
      borderMaterials[0],
      borderMaterials[1],
      borderMaterials[2],
      borderMaterials[3],
      borderMaterials[5]
    ];
    // Retire l'ancien poster si présent 
    if (this.currentPoster) {
      this.scene.remove(this.currentPoster);
    }
    const poster = new THREE.Mesh(posterGeometry, borderMaterials);
    poster.position.set(0, 0, 0);
    this.scene.add(poster);
    this.currentPoster = poster;
  }

  setOutlineColor(color: string) {
    const colorHex = new THREE.Color(color);
    this.borderMaterials.forEach(mat => mat.color.set(colorHex));
  }
}
