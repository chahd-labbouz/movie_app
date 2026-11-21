import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';
import { WishList } from './wish-list';

describe('WishList', () => {
  let component: WishList;
  let fixture: ComponentFixture<WishList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishList],
      providers: [provideHttpClient()],
    }).compileComponents();

    localStorage.removeItem('wishList');
    fixture = TestBed.createComponent(WishList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows saved movies and removes them from the wishlist', () => {
    const movieService = TestBed.inject(MovieService);
    const movie: Movie = {
      adult: false,
      backdrop_path: '',
      genre_ids: [],
      id: 42,
      title: 'Test movie',
      original_language: 'en',
      original_title: 'Test movie',
      overview: 'A test movie.',
      popularity: 0,
      poster_path: '/poster.jpg',
      release_date: '2026-01-01',
      softcore: false,
      video: false,
      vote_average: 0,
      vote_count: 0,
    };
    movieService.addToWishList(movie);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Test movie');
    const removeButton = fixture.nativeElement.querySelector('.remove-button') as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your wishlist is empty');
    expect(movieService.wishList()).toEqual([]);
    expect(JSON.parse(localStorage.getItem('wishList') ?? '[]')).toEqual([]);
  });
});
