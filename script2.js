// console.log("js");

// async function getSongs() {
//   let a = await fetch("http://127.0.0.1:5500/spotify%20clone/songs/");
//   let response = await a.text();
// //   console.log(response)
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let as = div.getElementsByTagName("a");
//   let songs = [];
//   for (let index = 0; index < as.length; index++) {
//     const element = as[index];
//     if (element.href.endsWith(".mp3")) {
//       songs.push(element.href.split("/songs/")[1]);
//     }
//   }
//   return songs;
// }

// async function main() {
//   let songs = await getSongs();
//   console.log(songs);

//   let songUL = document.querySelector(".songList").getElementsByTagName("ul");
//   for (const song of songs) {
//     songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20"," ")}</li>`;
//   }
// }

// //play the first song
// var audio = new Audio(songs[0]);
// // audio.play();

// audioElement.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   console.log(duration);
//   //duration variable now holds the duration (in sec) of audio clip
// });

// main();








let currentSong = new Audio();

function formatTime(seconds) {
  // Make sure seconds is an integer
  seconds = Math.floor(seconds);

  // Calculate minutes and seconds
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;

  // Add leading zeros
  let formattedMinutes = String(minutes).padStart(2, '0');
  let formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}




// console.log("js");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/spotify%20clone/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track,pause=false) => {
  // let audio = new Audio("./songs/" + encodeURIComponent(track));
  currentSong.src = "./songs/" + track;

  if(!pause){
    currentSong.play()
    play.src = "pause.svg";
  }
  currentSong.play();
  

  document.querySelector(".songInfoPlay").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {
  let songs = await getSongs();
  console.log(songs);
  playMusic(songs[0],true)

  // ✅ Fix 1: Select only the first <ul>
  let songUL = document.querySelector(".songlist ul");

  for (const song of songs) {
    songUL.innerHTML += `<li>
    
                <img style="width: 30px;" src="music.svg" alt="">

                <div class="songinfo">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Shashank</div>
                </div>

                <img class="invert" style="width: 25px; padding-left: 42px;" src="playbtn.svg" alt="">
    
    </li>`;
  }

  //attach an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
      playMusic(
        e.querySelector(".songinfo").firstElementChild.innerHTML.trim()
      );
    });
  });


  Array.from(
    document.querySelector(".cardcontainer").getElementsByTagName(".card")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".card").firstElementChild.innerHTML);
      playMusic(
        e.querySelector(".card").firstElementChild.innerHTML.trim()
      );
    });
  });



  //attach an event listener to play,next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "playbtn.svg";
      // play.src="pause.svg"
    }
  });

  //listen for timeupdate event
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime , currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime) }/${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
  }) 

  //add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent + "%";
    currentSong.currentTime=((currentSong.duration)*percent)/100
  })

  //add event listener to previous and next
  previous.addEventListener("click",()=>{
    console.log("previous clicked")
    console.log(currentSong)
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) >= 0){
      playMusic(songs[index-1])
    }
  })

    next.addEventListener("click",()=>{
    console.log("next clicked")
    console.log(currentSong)
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length-1){
      playMusic(songs[index+1])
    }
  })


  // ✅ Fix 2: Play first song here (after songs are loaded)
  var audio = new Audio("/songs/" + songs[0]);
  //   audio.play();

  // ✅ Fix 3: use `audio` instead of undefined `audioElement`
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log("Duration:", duration);
    // document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime) }:${formatTime(currentSong.duration)}`
  });

  
}

main();
