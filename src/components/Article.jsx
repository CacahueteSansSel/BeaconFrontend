import DefaultCover from '../assets/default-cover.png'
import {useEffect, useState} from "react";

export function Article({article}) {
    const [warning, setWarning] = useState(undefined)

    let date = new Date(article.publishDate)

    let fgColor = article.outlet.color === "000000" ? "FFFFFF" : "000000"
    let isToday = date.toDateString() === new Date().toDateString()

    useEffect(() => {
        if (!article) return;

        console.log(article.outlet.restrictions)

        switch (article.outlet.restrictions) {
            case "none":
                break;
            case "paywall":
                setWarning("Payant")
                return;
            case "cookiesorpaywall":
                setWarning("Cookies imposés")
                return;
        }

        if (article.outlet.temperature < -0.8)
            setWarning("Média d'opinion (Extr.Gauche)")
        if (article.outlet.temperature > 0.8)
            setWarning("Média d'opinion (Extr.Droite)")
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
        <div style={{borderColor: "#" + article.outlet.color}} className={"relative border-2 p-4 rounded-lg shadow-2xl flex flex-col gap-1"} onClick={() => window.open(article.url)}>
            <div className="absolute -translate-y-6 flex flex-row gap-2">
                <div style={{borderColor: "#" + article.outlet.color}} className={"rounded px-2 font-bold border-2 bg-white"} style={{color: "#" + article.outlet.color}}>{article.outlet.title}</div>
                {warning && (
                    <div className={"rounded px-2 font-bold border-2 border-amber-700 bg-amber-700 text-white"}>▲ {warning}</div>
                )}
            </div>
            <div className={"flex flex-row justify-between items-center mt-1"}>
                {!isToday && <p className={"opacity-50"}>le {date.toLocaleDateString()}, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                {isToday && <p className={"opacity-50"}>aujourd'hui, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                <p className={"opacity-50 font-semibold"}>{getArticleCategoryTitle(article.outlet.category)}</p>
            </div>
            {article.coverImageUrl && <img className={"h-50 w-full object-cover border-2"} style={{borderColor: "#" + article.outlet.color}} src={article.coverImageUrl}/>}
            {!article.coverImageUrl && <img className={"h-50 w-full object-cover"} src={DefaultCover}/>}
            <p className={"text-xl font-bold"}>{article.title}</p>
            <p className={"opacity-50"} style={{color: "#" + article.outlet.color}}>{article.id}</p>
        </div>
    )
}