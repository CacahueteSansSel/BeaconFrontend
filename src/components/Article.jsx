import DefaultCover from '../assets/default-cover.png'
import {useEffect, useState} from "react";

export function Article({article}) {
    const [warning, setWarning] = useState(undefined)
    const [political, setPolitical] = useState(undefined)

    let date = new Date(article.publishDate)

    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    let bgColor = article.outlet.color === "000000" && isDarkMode ? "d1d5dc" : article.outlet.color
    let fgColor = bgColor === "000000" ? "FFFFFF" : "000000"
    let isToday = date.toDateString() === new Date().toDateString()

    useEffect(() => {
        if (!article || !article.outlet) {
            setWarning(undefined)
            setPolitical(undefined)

            return;
        }

        console.log(article.outlet.restrictions)

        switch (article.outlet.restrictions) {
            case "none":
                setWarning(undefined)
                break;
            case "paywall":
                setWarning("Payant")
                break;
            case "cookiesorpaywall":
                setWarning("Cookies imposés")
                break;
        }

        // if (article.outlet.temperature < -0.8)
        // {
        //     setPolitical("Extr. Gauche")
        //     return
        // }
        // if (article.outlet.temperature > 0.8)
        // {
        //     setPolitical("Extr. Droite")
        //     return;
        // }
        // if (article.outlet.temperature < -0.35)
        // {
        //     setPolitical("Gauche")
        //     return;
        // }
        // if (article.outlet.temperature > 0.35)
        // {
        //     setPolitical("Droite")
        //     return;
        // }

        setPolitical(undefined)
    }, [article])

    function getArticleCategoryTitle(category) {
        switch (category) {
            case "general":
                return "Général"
            case "tech":
                return "Technologie"
            case "apple":
                return "Apple"
        }
    }

    return (
        <div style={{borderColor: "#" + bgColor}} className={"dm-serif-text-regular relative dark:text-gray-300 border-2 p-4 rounded-lg shadow-2xl flex flex-col gap-1"} onClick={() => window.open(article.url)}>
            <div className="absolute -translate-y-6 flex flex-row gap-2 tinos-regular">
                <div style={{borderColor: "#" + bgColor}} className={"rounded px-2 font-bold border-2 bg-white dark:bg-black"} style={{color: "#" + bgColor}}>{article.outlet.title}</div>
                {political && (
                    <div style={{borderColor: "#" + bgColor}} className={"rounded px-2 font-bold border-2 bg-white dark:bg-black"} style={{color: "#" + bgColor}}>🌡️ {political}</div>
                )}
                {warning && (
                    <div className={"rounded px-2 font-bold border-2 border-amber-700 bg-amber-700 dark:border-amber-900 dark:bg-amber-900 text-white dark:text-gray-300"}>▲ {warning}</div>
                )}
            </div>
            <div className={"flex flex-row justify-between items-center mt-1 tinos-regular"}>
                {!isToday && <p className={"opacity-50"}>le {date.toLocaleDateString()}, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                {isToday && <p className={"opacity-50"}>aujourd'hui, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                <p className={"opacity-50 font-semibold dm-serif-text-regular"}>{getArticleCategoryTitle(article.outlet.category)}</p>
            </div>
            {article.coverImageUrl && <img className={"h-50 w-full object-cover border-2 dark:opacity-60"} style={{borderColor: "#" + bgColor}} src={article.coverImageUrl}/>}
            {!article.coverImageUrl && <img className={"h-50 w-full object-cover"} src={DefaultCover}/>}
            <p className={"text-xl font-bold"}>{article.title}</p>
            <p className={"opacity-50 font-sans"} style={{color: "#" + bgColor}}>{article.id}</p>
        </div>
    )
}