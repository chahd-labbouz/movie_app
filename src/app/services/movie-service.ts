import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Movie } from '../interfaces/movie';
import { MovieResponse } from '../interfaces/movie-response';


@Injectable({
    providedIn:'root'
})
export class MovieService {

    private readonly http=inject(HttpClient)
    //readonly : pour etre non podifiable 
    //private : pour que les autres composants ne voient pas la variable 
    private readonly url=environment.url_api
    private readonly key=environment.api_key
    private readonly url_movie_api=environment.url_movie_api

    private readonly wishListStorageKey = 'wishList'

    public movieList = signal<Movie[]>([])
    public movie = signal<Movie | null>(null)
    public selectedMovie = signal<Movie | null>(null)
    public wishList = signal<Movie[]>(this.loadWishList())

    getMovieList():Observable<Movie[]>{
        return this.http.get<MovieResponse>(`${this.url}?api_key=${this.key}`).pipe(
            map(response=>response.results)
            //map permet de transformer les elements par leur resultat qui le correspond
        )
    }

    getMovieById(id:number){
        return this.http.get<Movie>(`${this.url_movie_api}${id}?api_key=${this.key}`).pipe(
            map(response=>response)
        )
    }

    addToWishList(movie: Movie): void {
        const currentWishList = this.wishList()
        if (currentWishList.some(savedMovie => savedMovie.id === movie.id)) {
            return
        }

        const updatedWishList = [...currentWishList, movie]
        this.persistWishList(updatedWishList)
        this.wishList.set(updatedWishList)
    }

    removeFromWishList(movieId: number): void {
        const updatedWishList = this.wishList().filter(movie => movie.id !== movieId)
        this.persistWishList(updatedWishList)
        this.wishList.set(updatedWishList)
    }

    isInWishList(movieId: number): boolean {
        return this.wishList().some(movie => movie.id === movieId)
    }

    private loadWishList(): Movie[] {
        if (typeof localStorage === 'undefined') {
            return []
        }

        const storedWishList = localStorage.getItem(this.wishListStorageKey)
        if (!storedWishList) {
            return []
        }

        try {
            const parsedWishList: unknown = JSON.parse(storedWishList)
            if (!Array.isArray(parsedWishList)) {
                throw new Error('Stored wishlist must be an array.')
            }

            return parsedWishList.filter((movie): movie is Movie => {
                if (typeof movie !== 'object' || movie === null) {
                    return false
                }

                const candidate = movie as Partial<Movie>
                return typeof candidate.id === 'number' && typeof candidate.title === 'string'
            })
        } catch (error) {
            console.error('Could not read the saved wishlist from local storage.', error)
            return []
        }
    }

    private persistWishList(wishList: Movie[]): void {
        if (typeof localStorage === 'undefined') {
            throw new Error('Wishlist storage is unavailable in this environment.')
        }

        localStorage.setItem(this.wishListStorageKey, JSON.stringify(wishList))
    }
}
