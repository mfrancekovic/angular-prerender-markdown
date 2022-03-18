import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  postContent: any = '';

  constructor(private route: ActivatedRoute,  private http: HttpClient) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.url[0].path;
    this.http.get<{content: string}>(`http://localhost:8080/api/post/${slug}`).subscribe(data => {
      this.postContent = data.content;
    }, () => {
      this.postContent = 'Page not found';
    });
  }

}
