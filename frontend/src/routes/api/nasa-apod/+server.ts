/**
 * NASA APOD API Proxy
 * 
 * GET /api/nasa-apod — Proxies NASA's Astronomy Picture of the Day API.
 * Keeps the API key server-side and caches responses for 1 hour.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

interface ApodResponse {
    title: string;
    date: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    copyright?: string;
}

// Simple in-memory cache (refreshes once per hour)
let cachedData: ApodResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const GET: RequestHandler = async () => {
    const now = Date.now();

    // Return cached data if still fresh
    if (cachedData && (now - cacheTimestamp) < CACHE_TTL) {
        return json(cachedData);
    }

    try {
        const apiKey = env.NASA_API_KEY || 'DEMO_KEY';
        const res = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!res.ok) {
            console.error(`❌ NASA APOD API returned ${res.status}`);
            return json(
                { error: 'Failed to fetch from NASA API' },
                { status: 502 }
            );
        }

        const data: ApodResponse = await res.json();

        // Cache the response
        cachedData = {
            title: data.title,
            date: data.date,
            explanation: data.explanation,
            url: data.url,
            hdurl: data.hdurl,
            media_type: data.media_type,
            copyright: data.copyright
        };
        cacheTimestamp = now;

        return json(cachedData);
    } catch (error) {
        console.error('❌ Failed to fetch NASA APOD:', error);
        return json(
            { error: 'Failed to fetch NASA APOD data' },
            { status: 500 }
        );
    }
};