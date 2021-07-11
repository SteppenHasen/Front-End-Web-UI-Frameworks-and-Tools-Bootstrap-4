import { Component, OnInit,  } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders: Leader[];

  constructor(private leaderservice: LeaderService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.leaders = this.leaderservice.getLeaders();
  }

}
