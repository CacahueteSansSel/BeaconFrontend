import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {apiGetFeed} from "./api/api.js";
import {Article} from "./components/Article.jsx";

function App() {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        async function fetchFeed() {
            let feed = await apiGetFeed();

            console.log(feed);

            if (feed) setFeed(feed)
        }

        fetchFeed();
    }, [])

    return (
        <div className={"mx-4 my-2 mb-20 mt-10"}>
            <p className={"text-2xl font-bold text-center"}>Beacon</p>
            <p className={"text-2xl text-center"}>Articles récents</p>
            <div className={"flex flex-col gap-6 mt-4"}>
                {feed.length > 0 && feed.map((item, i) => {
                    return <Article key={i} article={item} />
                })}
            </div>
        </div>
    )
}

export default App
