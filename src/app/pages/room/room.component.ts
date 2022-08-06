import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../web-socket.service';
import { PeerService } from '../../peer.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  currentStream: any;
  listUser: Array<any> = [];
  roomName: string;

  constructor(private route : ActivatedRoute, private webSocketService: WebSocketService, private peerService: PeerService) {
    this.roomName = route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.checkMediaDevices();
    this.initPeer();
    this.initSocket();
  }

  initPeer = () => {
    const {peer} = this.peerService;
    peer.on('open', (id) => {
      const body = {
        idPeer: id,
        roomName: this.roomName
      };

      this.webSocketService.joinRoom(body);
    });

    peer.on('call', callEnter => {
      callEnter.answer(this.currentStream);
      callEnter.on('stream', (streamRemote) => {
        this.addVideoUser(streamRemote);
      }, err => {
        console.error(err);
      });
    });
  }

  initSocket = () => {
    this.webSocketService.cbEvent.subscribe(res => {
      if(res.name === 'new-user'){
        const {idPeer} = res.data;
        this.sendCall(idPeer, this.currentStream);
      }
      console.log("Socket ", res)
    });
  }

  checkMediaDevices = () => {
    if(navigator && navigator.mediaDevices){
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      }).then((stream) => {
        this.currentStream = stream;
        this.addVideoUser(stream);
      }).catch((e) => {
        console.error(e);
      })
    }
    else{
      console.log("*** ERROR *** No media devices");
    }
  }

  addVideoUser = (stream) => {
    this.listUser.push(stream);
    const unique = new Set(this.listUser);
    this.listUser = [...unique];
  }

  sendCall = (idPeer, stream) => {
    const newUserCall = this.peerService.peer.call(idPeer, stream);
    if(!!newUserCall){
      newUserCall.on('stream', (userStream) => {
        this.addVideoUser(userStream);
      });
    }
  }

}
