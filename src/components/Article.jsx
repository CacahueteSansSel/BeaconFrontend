export function Article({article}) {
    let date = new Date(article.publishDate)

    let fgColor = article.outlet.color === "000000" ? "FFFFFF" : "000000"

    return (
        <div className={"border-gray-300 relative border p-4 rounded-lg shadow-2xl flex flex-col gap-1"} onClick={() => window.open(article.url)}>
            <div className={"absolute rounded px-2 -translate-y-6 font-bold border-gray-300 border"} style={{backgroundColor: "#" + article.outlet.color, color: "#" + fgColor}}>{article.outlet.title}</div>
            <div className={"flex flex-row gap-2"}>
                <p className={"opacity-50"}>Publié le {date.toLocaleDateString()} à {date.toLocaleTimeString()}</p>
            </div>
            <img className={"h-50 w-full object-cover"} src={article.coverImageUrl}/>
            <p className={"text-xl font-bold"}>{article.title}</p>
        </div>
    )
}