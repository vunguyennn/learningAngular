import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss'],
})
export class SkillComponent implements OnInit {
  @Input() skillName: string;
  @Input() skillImgUrl: string;
  @Input() skillDes: string;
  @Output() changeName = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
