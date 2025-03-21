import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(){
    return {layout: "base", title: "Home"};
  }
}
