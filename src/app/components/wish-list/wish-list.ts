import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [RouterLink],
  selector: 'app-wish-list',
  styleUrl: './wish-list.css',
  templateUrl: './wish-list.html',
})
export class WishList {
  readonly movieService = inject(MovieService)

  removeFromWishList(movieId: number): void {
    this.movieService.removeFromWishList(movieId)
  }
}
