import DefaultCover from '../assets/default-cover.png'

export function Article({article}) {
    let date = new Date(article.publishDate)

    let fgColor = article.outlet.color === "000000" ? "FFFFFF" : "000000"
    let isToday = date.toDateString() === new Date().toDateString()

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
            <div style={{borderColor: "#" + article.outlet.color}} className={"absolute rounded px-2 -translate-y-6 font-bold border-2 bg-white"} style={{color: "#" + article.outlet.color}}>{article.outlet.title}</div>
            <div className={"flex flex-row justify-between items-center"}>
                {!isToday && <p className={"opacity-50"}>le {date.toLocaleDateString()}, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                {isToday && <p className={"opacity-50"}>aujourd'hui, à {date.getHours()}h{date.getMinutes().toString().padStart(2, '0')}</p>}
                <p className={"opacity-50 font-semibold"}>{getArticleCategoryTitle(article.outlet.category)}</p>
            </div>
            {article.coverImageUrl && <img className={"h-50 w-full object-cover border-2"} style={{borderColor: "#" + article.outlet.color}} src={article.coverImageUrl}/>}
            {!article.coverImageUrl && <img className={"h-50 w-full object-cover"} src={DefaultCover}/>}
            <p className={"text-xl font-bold"}>{article.title}</p>
        </div>
    )
}