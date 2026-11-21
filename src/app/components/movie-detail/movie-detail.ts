import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { switchMap } from 'rxjs';
import { Movie } from '../../interfaces/movie';

@Component({
  imports: [],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  readonly movieService = inject(MovieService)
  readonly selectedMovie = this.movieService.selectedMovie

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    ).subscribe(movie => this.movieService.selectedMovie.set(movie));
  }


  backToMovieList() {
    this.router.navigate(['/']);
  }

  addToWish(movie: Movie): void {
    if (this.movieService.isInWishList(movie.id)) {
      this.movieService.removeFromWishList(movie.id);
      return;
    }

    this.movieService.addToWishList(movie);
  }

}
