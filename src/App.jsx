import {useEffect, useRef, useState} from 'react'
import BeaconIcon from './assets/beacon-icon.svg'
import './App.css'
import {apiGetFeed, apiGetInfos} from "./api/api.js";
import {Article} from "./components/Article.jsx";

function App() {
    const [feed, setFeed] = useState([]);
    const [infos, setInfos] = useState(undefined);
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
            let infos = await apiGetInfos();

            if (feed) setFeed(feed)
            if (infos) setInfos(infos);
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
        <div className={"mx-4 my-2 mb-20 mt-4"}>
            <div className={"flex flex-row justify-between items-center"}>
                <img src={BeaconIcon} alt={"Beacon Logo"} className={"h-20"}/>
                {infos && (
                    <div className={"flex flex-col mr-7 items-end"}>
                        <p className={"opacity-50"}>Dernière récup à {new Date(infos.lastGatherTime).getHours().toString()}h{new Date(infos.lastGatherTime).getMinutes().toString().padStart(2, '0')}</p>
                        <p className={"text-xl font-bold"}>Actualités - v{infos.version}</p>
                    </div>
                )}
            </div>
            <div className={"flex flex-col gap-8 mt-10"}>
                {feed.length > 0 && feed.map((item, i) => {
                    return <Article key={i} article={item} />
                })}
            </div>

            <div ref={sentinelRef} />

            {loading && <p style={{ padding: 16 }}>En attente du Beacon...</p>}
            {!loading && <p style={{ padding: 16 }} onClick={() => loadMoreArticles()}>Charger plus d'articles</p>}
            {!hasMore && <p style={{ padding: 16 }}>Aucun article disponible</p>}
        </div>
    )
}

export default App
