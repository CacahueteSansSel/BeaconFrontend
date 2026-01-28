import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {apiGetFeed} from "./api/api.js";
import {Article} from "./components/Article.jsx";

function App() {
    const [feed, setFeed] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    async function loadMoreArticles() {
        const newFeedArticles = await apiGetFeed(page+1);

        setFeed(prev => [...prev, ...newFeedArticles]);
        setPage(prev => prev + 1);
        setHasMore(newFeedArticles.length > 0);
        setLoading(false);
    }

    useEffect(() => {
        async function fetchFeed() {
            let feed = await apiGetFeed(0);

            console.log(feed);

            if (feed) setFeed(feed)
        }

        fetchFeed();
    }, [])

    useEffect(() => {
        if (!sentinelRef.current) return;

        observerRef.current = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting || loading || !hasMore) return;

                setLoading(true);
                await loadMoreArticles();
            },
            {
                root: document.querySelector("#scroll-container"),
                rootMargin: "100px",
                threshold: 0.1,
            }
        );

        observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
    }, [page, loading, hasMore]);

    return (
        <div className={"mx-4 my-2 mb-20 mt-10"}>
            <p className={"text-2xl font-bold text-center"}>Beacon</p>
            <p className={"text-2xl text-center"}>Articles récents</p>
            <div className={"flex flex-col gap-6 mt-4"}>
                {feed.length > 0 && feed.map((item, i) => {
                    return <Article key={i} article={item} />
                })}
            </div>

            <div ref={sentinelRef} />

            {loading && <p style={{ padding: 16 }}>Chargement…</p>}
            {!loading && <p style={{ padding: 16 }} onClick={() => loadMoreArticles()}>Plus d'articles</p>}
            {!hasMore && <p style={{ padding: 16 }}>Fin 🎉</p>}
        </div>
    )
}

export default App
