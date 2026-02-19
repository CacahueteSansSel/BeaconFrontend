import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import {apiGetBakedArticle, apiGetInfos} from "./api/api.js";
import BeaconIcon from './assets/beacon-icon.svg'
import DefaultCover from "./assets/default-cover.png";

export function ArticlePage() {
    const [article, setArticle] = useState(undefined)
    const [infos, setInfos] = useState(undefined);
    let { articleId } = useParams();

    useEffect(() => {
        async function fetchArticle() {
            let art = await apiGetBakedArticle(articleId)
            let infos = await apiGetInfos()

            setArticle(art)
            setInfos(infos)
        }

        fetchArticle()
    }, [articleId])

    if (!article) {
        return <p>Please wait...</p>
    }

    let date = new Date(article.article.publishDate)

    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    let bgColor = article.article.outlet.color === "000000" && isDarkMode ? "d1d5dc" : article.article.outlet.color
    let fgColor = bgColor === "000000" ? "FFFFFF" : "000000"
    let isToday = date.toDateString() === new Date().toDateString()

    return (
        <div className={"dm-serif-text-regular px-4 py-2 pb-20 pt-4 dark:bg-black dark:text-gray-300"}>
            <div className={"flex flex-row justify-between items-center"}>
                <Link to={'/'}>
                    <img src={BeaconIcon} alt={"Beacon Logo"} className={"h-20"}/>
                </Link>
                {infos && (
                    <div className={"flex flex-col mr-7 items-end"}>
                        <p className={"opacity-50 tinos-regular"}>Dernière récup à {new Date(infos.lastGatherTime).getHours().toString()}h{new Date(infos.lastGatherTime).getMinutes().toString().padStart(2, '0')}</p>
                        <p className={"text-xl font-bold dm-serif-text-regular"}>Articles Baked - v{infos.version}</p>
                    </div>
                )}
            </div>

            <Link to={'/'}>
                <div className={"my-2 w-full border-2 border-gray-700 rounded-lg py-2 text-center text-lg"}>Retour au feed Beacon</div>
            </Link>
            <div className={"my-2 w-full border-2 border-gray-700 rounded-lg py-2 text-center text-lg"} onClick={() => window.open(article.article.url)}>Aller sur le site réel</div>

            {article.article.coverImageUrl && <img className={"h-50 rounded w-full object-cover border-2 dark:opacity-60"} style={{borderColor: "#" + bgColor}} src={article.article.coverImageUrl}/>}
            {!article.article.coverImageUrl && <img className={"h-50 rounded w-full border-2 object-cover"} style={{borderColor: "#" + bgColor}} src={DefaultCover}/>}

            <div style={{borderColor: "#" + bgColor}} className={"mt-5 mb-3 rounded w-fit px-2 font-bold border-2 bg-white dark:bg-black"} style={{color: "#" + bgColor}}>{article.article.outlet.title}</div>

            <p className={"opacity-50 font-sans"}>{article.article.id}</p>
            <p className={"text-xl font-bold"}>{article.article.title}</p>

            <div className={"flex flex-row justify-between items-center mt-1 tinos-regular"}>
                {!isToday && <p className={"opacity-50"}>le {date.toLocaleDateString()}, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                {isToday && <p className={"opacity-50"}>aujourd'hui, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
            </div>

            <p className={"text-xl mt-10 tinos-regular text-justify whitespace-pre-line"}>{article.content}</p>

            <p className={"mt-10 mb-2 text-lg opacity-80 text-center"}>Fin de l'article</p>
            <div className={"w-full border-2 border-gray-700 rounded-lg py-2 text-center text-lg"}
                onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>Retour en haut</div>
            <Link to={'/'}>
                <div className={"mt-2 w-full border-2 border-gray-700 rounded-lg py-2 text-center text-lg"}>Retour au feed Beacon</div>
            </Link>
        </div>
    )
}