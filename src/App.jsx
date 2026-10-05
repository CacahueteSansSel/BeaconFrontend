import {useEffect, useRef, useState} from 'react'
import BeaconIcon from './assets/beacon-icon.svg'
import BeaconIconDark from './assets/beacon-icon-dark.svg'
import './App.css'
import {apiGetFeed, apiGetInfos} from "./api/api.js";
import {Article} from "./components/Article.jsx";
import {ArticlePage} from "./components/ArticlePage.jsx";

function App() {
    const [feed, setFeed] = useState([]);
    const [infos, setInfos] = useState(undefined);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [openArticleId, setOpenArticleId] = useState(undefined);

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    async function loadMoreArticles() {
        const newFeedArticles = await apiGetFeed(page+1);

        setFeed(prev => [...prev, ...newFeedArticles]);
        setPage(prev => prev + 1);
        setHasMore(newFeedArticles.length > 0);
        setLoading(false);
    }

    function openArticle(articleId) {
        setOpenArticleId(articleId);
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
        <>
            {openArticleId && (
                <div className={"absolute left-0 top-0 right-0 bottom-0 z-50 bg-white overflow-y-scroll"}>
                    <ArticlePage articleId={openArticleId} hideCallback={() => setOpenArticleId(undefined)} />
                </div>
            )}
            <div className={"absolute top-2 left-4 right-4 bottom-0 pb-20 pt-4 dark:bg-black dark:text-gray-300 overflow-y-scroll"}>
                <div className={"flex flex-row justify-between items-center"}>
                    {isDarkMode && <img src={BeaconIconDark} alt={"Beacon Logo"} className={"h-20"}/>}
                    {!isDarkMode && <img src={BeaconIcon} alt={"Beacon Logo"} className={"h-20"}/>}
                    {infos && (
                        <div className={"flex flex-col mr-7 items-end"}>
                            <p className={"opacity-50 tinos-regular"}>Dernière récup à {new Date(infos.lastGatherTime).getHours().toString()}h{new Date(infos.lastGatherTime).getMinutes().toString().padStart(2, '0')}</p>
                            <p className={"text-xl font-bold dm-serif-text-regular"}>Actualités - v{infos.version}</p>
                        </div>
                    )}
                </div>
                <div className={"flex flex-col gap-8 mt-10"}>
                    {feed.length > 0 && feed.map((item, i) => {
                        return <Article key={i} article={item} openArticleCallback={openArticle} />
                    })}
                </div>

                <div ref={sentinelRef} />

                {loading && <p style={{ padding: 16 }}>En attente du Beacon...</p>}
                {!loading && <p style={{ padding: 16 }} onClick={() => loadMoreArticles()}>Charger plus d'articles</p>}
                {!hasMore && <p style={{ padding: 16 }}>Aucun article disponible</p>}
            </div>
        </>
    )
}

export default App
