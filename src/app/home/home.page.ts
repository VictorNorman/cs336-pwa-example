import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public showVideo = false;
  trustedVideo: SafeResourceUrl = '';
  youtubeUrl = "https://www.youtube.com/embed/oHg5SJYRHA0?autoplay=1"
  // youtubeUrl = "https://youtu.be/oHg5SJYRHA0";

  constructor(
    private domSanitizer: DomSanitizer,
    private platform: Platform,
    private afStorage: AngularFireStorage,
  ) {
    this.trustedVideo = this.domSanitizer.bypassSecurityTrustResourceUrl(this.youtubeUrl);
  }

  surprise() {
    this.showVideo = true;
    this.takePicture();
  }

  async takePicture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      direction: CameraDirection.Rear,
      allowEditing: false,
      quality: 100, // highest quality (0 to 100)
    });

    await this.savePicture(capturedPhoto);
  }

  // Save picture to file on device
  private async savePicture(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const filename = new Date().getTime() + ".jpeg";
    const storageRef = this.afStorage.ref(filename);
    storageRef.put(blob);
  }


}
