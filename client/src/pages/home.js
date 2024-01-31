import AppLayout from '@/components/Layouts/AppLayout'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { CardMedia, Typography } from '@mui/material';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('api/getPopularMovies');
                setMovies(response.data.results);
            } catch (err) {
                console.log(err);
            }
        }
        fetchMovies();

    }, []);

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Homes
                </h2>
            }>
            <Head>
                <title>Laravel - Home</title>
            </Head>

            <SearchBar />

            <Swiper
                spaceBetween={30}
                slidesPerView={5}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                // Responsive breakpoints
                breakpoints={{
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    // when window width is >= 480px
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    // when window width is >= 640px
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 40
                    }
                }}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Link href={`detail/movie/${movie.id}`}>
                            <CardMedia
                                component={"img"}
                                sx={{
                                    aspectRatio: "2/3"
                                }}
                                image={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </Link>

                        <Typography>
                            公開日：{movie.release_date}
                        </Typography>
                    </SwiperSlide>
                ))}
            </Swiper>

        </AppLayout>
    )
}

export default Home
