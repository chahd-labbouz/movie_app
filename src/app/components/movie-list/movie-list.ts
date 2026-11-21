import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  imports: [RouterLink],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList implements OnInit{

  movieService=inject(MovieService)
  ngOnInit(): void {
    this.movieService.getMovieList().subscribe(
      response=> {
        this.movieService.movieList.set(response);
      }  
    )
  }
}
