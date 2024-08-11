console.log("Lets Write the Java script");
let currentSongs = new Audio();
let songs;
let currfolder;


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`${folder}`)
    let response = await a.text()


    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }




    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">

                                <div class="song-name">${song.replaceAll("%20", " ")} </div>
                                <div> HP </div>
                            </div>
                            <div class="play-music">
                                <span>Play Now </span>
                                <div><img class="invert" src="images/play.svg" alt=""></div>
                            </div>
                            </li>`

    }

    // // play the first song
    // var audio = new Audio(songs[1]);
    // // audio.play()

    // Attach a event listioner to every song.. 
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {


            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })




}

let playmusic = (track, pause = false) => {
    currentSongs.src = `${currfolder}/` + track
    if (!pause) {

        currentSongs.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track);
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"

}



function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    // Add leading zeros to minutes and seconds if necessary
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secs = secs < 10 ? "0" + secs : secs;
    return minutes + ":" + secs;
}


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`Songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")

    let cardcont = document.querySelector(".card-cont")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`Songs/${folder}/info.json`)
            let response = await a.json();
            cardcont.innerHTML = cardcont.innerHTML + ` 
            
             <div data-folder="${folder}" class="card">
            <img src="Songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            <div class="play-button"><img src="images/play.svg" alt=""></div>
            
    

        </div>`
        }
    }
// show playlist when clicking on card 
Array.from(document.getElementsByClassName("card")).forEach(e => {

    e.addEventListener("click", async item => {

        let folderr = item.currentTarget.dataset.folder;
        await getSongs(`Songs/${folderr}`)

    })
})
}




async function main() {
    //get list of songs
    await getSongs("Songs/ncs")
    playmusic(songs[0], true)

    await displayAlbums()

    // Attatch a event listeiner to play , pause , next , 
    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "images/play.svg"
        }
    })

}
// Update current time
currentSongs.addEventListener('timeupdate', () => {

    document.querySelector(".song-time").innerHTML = `${formatTime(currentSongs.currentTime)} / ${formatTime(currentSongs.duration)}`
    document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 98 + "%"
});

// Add an event listener to seekbar
document.querySelector(".seek-bar").addEventListener("click", e => {

    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 98;
    document.querySelector(".circle").style.left = percent + "%";
    currentSongs.currentTime = ((currentSongs.duration) * percent) / 98
})

// Add event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

// Add event listener for close / cross
document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})
// Add an event listener to previous
previous.addEventListener("click", () => {
    currentSongs.pause(); // Pause the current song
    console.log("Previous clicked");

    let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);

    if ((index - 1) >= 0) {
        playmusic(songs[index - 1]); // Play the previous song
    }
});

// Add an event listener to next
next.addEventListener("click", () => {
    currentSongs.pause(); // Pause the current song
    console.log("Next clicked");

    let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);

    if ((index + 1) < songs.length) {
        playmusic(songs[index + 1]); // Play the next song
    }
});


// Add event listner to the  volume bar
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting the volume", e.target.value, "/ 100")
    currentSongs.volume = parseInt(e.target.value) / 100
})

    // Add event listener to mute the track
    document.querySelector(".volume-bar >img").addEventListener("click", e=>{ 
        if(e.target.src.includes("images/volume.svg")){
            e.target.src = e.target.src.replace("images/volume.svg", "images/mutee.svg")
            currentSongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("images/mutee.svg", "images/volume.svg")
            currentSongs.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


main()        