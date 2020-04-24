import React, {useState, useEffect} from "react"

const API_KEY = "{INSERT KEY HERE}"
var songs = []
var qterm = ""

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [count, setCount] = useState(0)
    const [data, setData] = useState({})

    useEffect(() => {
        async function fetchData() {
            qterm=searchTerm
            qterm = qterm.replace(" ", "+")
            const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&order=relevance&q="+qterm+"&type=video&videoCategoryId=10&key="+API_KEY
            console.log("url: "+ url)
            const res = await fetch(url);
            res
                .json()
                .then(res => setData(res))
                .catch(err => setErrors(err));
        }
        if(searchTerm.length !== 0){
            fetchData()
        }
    },[count])

    if(qterm.length !== 0){
        songs=[]
        for (let key in data) {
            if(key === 'items'){
                for(let item in data[key]){
                    songs.push({title: ((data[key][item]['snippet']['title'].replace(/&quot;/g,'"')).replace(/&amp;/g, '&')).replace(/&#39;/g,'\''), 
                        img: data[key][item]['snippet']['thumbnails']['high']['url']})
                }
            }
        }
        qterm=""
    }

    
    return (
        <div>
            <input type="text" placeholder="Search for music..." onChange={e => setSearchTerm(e.target.value)}/>
            <button onClick={() => setCount(count + 1)}>Search</button>
            {songs.length > 0 &&
                <div>
                <h2>Results</h2>
                <hr/>
                <ul>
                    {songs && songs.map((song, ind) => (
                        <div key={song.title}>
                            <p><img src={song.img} className="img-responsive" height="40" width="40"/> {song.title}</p>
                        </div>
                    ))}
                </ul>
                </div>
            }
        </div>
    );
}
export default SearchBar

